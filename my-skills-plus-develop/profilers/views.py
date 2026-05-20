import json,os
import random
from django.shortcuts import get_object_or_404, render, redirect
from django.http import JsonResponse
from django.contrib import messages
from profilers import isot_api
import profilers.utills as utills
from .models import *
import traceback
from .serializers import CreateReviewProfileUserSerializer, VerifyEmailSerializer

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

# HTML TO PDF
from django.views.decorators.clickjacking import xframe_options_exempt
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, UserAssessment
from .serializers import UserSerializer, UserAssessmentSerializer, DisciplineSerializer, LevelOfEducationSerializer, JobProfilesSerializer, GenerateAssessmentSerializer
import openai
import openai
import os
import base64
import logging
from .utills import get_job_profile  # This should work if utils.py is in the same directory
from django.db.models import Q  # Import Q for complex queries
from django.utils import timezone
from django.contrib.auth import get_user_model  # Import the custom user model
import secrets
import string
from users.email_service import EmailService  # Add this import at the top of the file
from users.models import DirectContact  # Add this import at the top of the file
from users.models import Wallet  # Ensure you have the Wallet model imported

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import CandidateProfile
from .serializers import CandidateProfileSerializer

from django.db import transaction

import openai
from .serializers import SubmitAssessmentSerializer
from .serializers import GenerateJobAssessmentSerializer

import uuid
from datetime import timedelta, datetime
from django.utils import timezone

from .models import Interviewee  # Ensure this is included among your other model imports
from .models import RecruiterAssessmentAssignment  # Ensure this is included among your other model imports

from .serializers import SaveInitialVoiceSerializer  # Add your serializers here
from .serializers import SaveResumeVoiceSerializer
from cryptography.fernet import Fernet  # Ensure you have the correct import for your encryption
import tempfile
from pathlib import Path
try:
    from speechbrain.inference.speaker import SpeakerRecognition
except ImportError:
    SpeakerRecognition = None  # optional; voice verification routes need speechbrain installed
from typing import Tuple  # Add this import at the top of your file
from .serializers import SaveAnswerSerializer
# from openai import OpenAI  # Ensure you have the OpenAI client installed
from .serializers import SubmitPaperSerializer
from .serializers import PausePaperSerializer
# from openai import OpenAI  # Ensure you have the correct import for OpenAI client
from .utills import generate_token  # Ensure this matches the function name in utills.py
from .vani_engine import VaniEngine
from rest_framework.parsers import MultiPartParser, FormParser  # Add this import
from django.core.exceptions import ObjectDoesNotExist  # Add this import
from .utills import process_response_audio


User = get_user_model()  # Get the user model dynamically

logger = logging.getLogger(__name__)

# Initialize the FERNET key and verifier (set FERNET_KEY in .env.test for local dev)
FERNET_KEY_GENERATED = os.getenv("FERNET_KEY")
if not FERNET_KEY_GENERATED:
    raise RuntimeError(
        "FERNET_KEY is not set. Add it to .env.test (generate with: "
        "python -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\""
    )
fernet = Fernet(FERNET_KEY_GENERATED)
S3_BUCKET = os.getenv("S3_BUCKET_NAME")


# Speaker Verifier (optional — skills assessment API does not require this)
verifier = None
if SpeakerRecognition is not None:
    verifier = SpeakerRecognition.from_hparams(
        source="speechbrain/spkrec-ecapa-voxceleb",
        savedir="pretrained_models/spkrec-ecapa-voxceleb",
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_search(request):
    skill_name = request.GET.get("q")
    response = isot_api.api_search(skill_name)
    return JsonResponse(response, safe=False)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_get_files(request):
    skill_id = request.GET.get("path_addr")
    response = isot_api.get_files([skill_id])
    return JsonResponse(response, safe=False)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_child(request):
    file_id = request.GET.get("path_addr")
    response = isot_api.api_child(file_id)
    return JsonResponse(response, safe=False)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_tree(request):
    file_id = request.GET.get("path_addr")
    response = isot_api.api_tree(file_id)
    return JsonResponse(response, safe=False)


# Not is used
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_popular_categories(request):
    response = isot_api.api_popular_categories()
    return JsonResponse(response, safe=False)


# @require_POST
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_skills(request):
    profile = request.user.skill_profiles.first()
    if not profile:
        profile = SkillProfile.objects.create(user=request.user)

    body = request.body
    data = json.loads(body)
    skills = data.get("skills")
    user_id = data.get("userId", 0)  # Get userId from the request, default to 0 if not provided

    response_data = []
    for skill in skills:
        # Fetching data from isot_api based on skill's path_addr
        response = isot_api.get_files([skill.get("path_addr")])

        if not response:
            return JsonResponse({"message": "Skill not found in database!"}, status=400)

        qs = Skill.objects.filter(
            isot_path_addr=skill.get("path_addr"),
            user_id=user_id  # Filter by user_id as well
        )

        tags_title = response[0].get("tags")[0].get("title")
        kwargs = {
            "isot_path_addr": skill.get("path_addr"),
            "ratings": skill["ratings"],
            "tags": tags_title,
            "user_id": user_id  # Save userId in the Skill instance
        }

        if qs.exists():
            # If skill already exists for this user, update it
            db_skill = qs.first()
            db_skill.ratings = skill["ratings"]
            db_skill.tags = tags_title
            db_skill.save()
            kwargs["id"] = db_skill.id
            response_data.append(kwargs)
        else:
            # If skill doesn't exist, create a new one
            db_skill = Skill.objects.create(**kwargs)
            profile.skills.add(db_skill)
            kwargs["id"] = db_skill.id
            response_data.append(kwargs)

    return JsonResponse({"message": "Skill added successfully!", "data": response_data})



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_skills(request):
    try:
        print("Request:",request)
        print("User:",request.user)
        print("Skill Profile:", request.user.skill_profiles)
        profile = request.user.skill_profiles.first()
        print('profile:',profile)
        if not profile:
            logger.info("No skill profile found for user, creating a new one.")
            profile = SkillProfile.objects.create(user=request.user)

        data = utills.skill_data(profile)
        logger.info(f"Skill data: {data}")

        if not data:
            logger.info("No skills found for the profile.")
            data = []  # Return an empty list if no skills are found

        return JsonResponse(
            {
                "message": "Skills fetched successfully!",
                "data": data,
                "share_id": utills.encode_to_alphanumeric(profile.id),
            }
        )
    except Exception as e:
        logger.error(f"Error fetching skills: {str(e)}")
        return JsonResponse({"error": "An error occurred while fetching skills."}, status=500)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_skill(request, skill_id):
    profile = request.user.skill_profiles.first()

    # skill =
    skill = get_object_or_404(Skill, id=skill_id, profile=profile)

    skill.delete()
    return JsonResponse({"message": "Skill deleted successfully!"})


# Not is used
def save_profile(request):
    if request.user.is_authenticated:
        messages.success(request, "Your profile have saved successfully!")
        return redirect("profiler:my_skills_profile")

    messages.info(request, "Please login first! to save your profile")
    return redirect("account_login")


# Not is used
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def render_pdf_view(request):
    profile = request.user.skill_profiles.first()
    data = utills.skill_data_(profile)

    all_skills = []
    for skills_child in data:
        all_skills.extend(skills_child["skills"])

    context = {"data": data, "all_skills": all_skills, "profile": profile}
    return render(request, "skill_profiler_download.html", context)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_shared_user_skills(request, share_id):

    profile_id = utills.decode_from_alphanumeric(share_id)
    profile = get_object_or_404(SkillProfile, id=profile_id)

    data = utills.skill_data(profile)

    context = {"data": data, "full_name": profile.user.get_full_name()}
    # retun response
    return JsonResponse(context)


# Not is used
def view_mode_skills_profile(request, alpha_num_str):
    profile_id = utills.decode_from_alphanumeric(alpha_num_str)

    profile = SkillProfile.objects.get(id=profile_id)
    data = utills.skill_data_(profile)

    all_skills = []
    for skills_child in data:
        all_skills.extend(skills_child["skills"])

    context = {"data": data, "all_skills": all_skills, "profile": profile}
    return render(request, "view_mode_skills_profile.html", context)


# Not is used
@xframe_options_exempt
def embed_view_mode_skills_profile(request, alpha_num_str):
    profile_id = utills.decode_from_alphanumeric(alpha_num_str)

    profile = SkillProfile.objects.get(id=profile_id)
    data = utills.skill_data_(profile)

    all_skills = []
    for skills_child in data:
        all_skills.extend(skills_child["skills"])

    context = {"data": data, "all_skills": all_skills, "profile": profile}
    return render(request, "embed_view_mode_skills_profile.html", context)


# create review profile user api
class CreateReviewProfileUserView(APIView):
    serializer_class = CreateReviewProfileUserSerializer
    queryset = ReviewProfileUser.objects.all()
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        serializer = CreateReviewProfileUserSerializer(data=request.data, many=True)

        if serializer.is_valid():
            # send email to review user

            serializer.save(profile=self.request.user.skill_profiles.first())
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetSkillsForReviewUserView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, review_user_token, format=None):
        check_token = decode_token(review_user_token)
        print(check_token)
        if check_token is None:
            return JsonResponse({"message": "Invalid token!"}, status=400)
        else:
            obj_id, profile_id, email, user_type = check_token

        profile = get_object_or_404(SkillProfile, id=profile_id)
        data = utills.review_skill_data(profile)
        context = {"data": data, "full_name": profile.user.get_full_name()}
        return JsonResponse(context)


class SubmitSkillsForReviewUserView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, review_user_token, format=None):
        check_token = decode_token(review_user_token)
        print(check_token)
        if check_token is None:
            return JsonResponse({"message": "Invalid token!"}, status=400)

        obj_id, profile_id, email, user_type = check_token

        # get response data
        body = request.body
        data = json.loads(body)
        skills = data.get("skills")
        profile = get_object_or_404(SkillProfile, id=profile_id)

        data = []
        for skill in skills:

            qs = Skill.objects.filter(
                isot_path_addr=skill.get("isot_file_id"), profile=profile
            )

            if qs.exists():
                db_skill = qs[0]
                # d skill["ratings"]
                review_skills = ReviewSkills.objects.create(
                    review_user_id=obj_id,
                    skill=db_skill,
                    ratings=skill["rating"],
                )
                review_skills.save()
                print(review_skills)

            else:
                print("as skills don't not exist in database")
                pass

            review_profile_user_obj = ReviewProfileUser.objects.get(id=obj_id)
            review_profile_user_obj.is_submitted = True
            review_profile_user_obj.save()

        return JsonResponse({"message": "Skills added successfully!"})


class GetPeersFeedback(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        profile = request.user.skill_profiles.first()
        all_peers_feedback = ReviewProfileUser.objects.filter(
            profile=profile, is_submitted=True
        )

        if len(all_peers_feedback) < 3:
            return JsonResponse({"message": "Not enough peers feedback!"}, status=400)

        skills = Skill.objects.filter(profile=profile)

        dict_review_user_skills = {}
        for skill in skills:
            dict_review_user_skills[skill.id] = []

        for peer_feedback in all_peers_feedback:
            for review_skill in peer_feedback.review_skills.all():
                l = dict_review_user_skills[review_skill.skill.id]
                for rating in review_skill.ratings:
                    if rating["isot_rating_id"] != "":
                        l.append(rating["rating"])

                dict_review_user_skills[review_skill.skill.id] = l

        return JsonResponse(
            {"all_user_skills": utills.only_skill_data(skills, dict_review_user_skills)}
        )


def questions_filter(question):
    question_type = question.get('type')
    filtered_question = {
        'id': question.get('id'),
        'question': question.get('question'),
        'type': question_type,
        'category': question.get('category'),
        'skill_assessed': question.get('skill_assessed')
    }
    
    if question_type == 'multiple_choice' or question_type == 'fill_in_the_blank':
        filtered_question['options'] = question.get('options')
        filtered_question['correct_answer'] = question.get('correct_answer')
    elif question_type == 'short_answer':
        filtered_question['expected_answer'] = question.get('expected_answer')
    
    return filtered_question

def encode_to_alphanumeric(user_id):
    # Encode the user ID to a base64 string for privacy
    return base64.urlsafe_b64encode(str(user_id).encode()).decode()



@api_view(['POST'])
def generate_assessment(request):
    data = request.data
    # Validate incoming data
    if 'skills' not in data or 'profileData' not in data or 'testLength' not in data or 'timeLimit' not in data:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    selected_skills = data['skills']
    profile_data = data['profileData']
    test_length = data['testLength']
    time_limit = data['timeLimit']

    # Transform the new skill format to the expected format for the prompt
    transformed_skills = [{'name': skill['skill_name'], 'proficiency': skill['rating'], 'category': skill['tag_name']} for skill in selected_skills]

    skill_categories = list(set([skill['category'] for skill in transformed_skills]))
    # Prepare the prompt for OpenAI
    skills_text = "\n".join([f"- {skill['name']} (Self-rated proficiency: {skill['proficiency']}/4, Category: {skill['category']})" for skill in transformed_skills])
    initial_prompt = f"Create a {test_length}-question skills assessment for {profile_data['name']} based on their self-rated skills:\n{skills_text}\nRequirements:\n- Completable in {time_limit} minutes\n- Test deeper knowledge of 4/4 proficiency skills"

    initial_prompt_json = f"""
        Return as JSON:
        {{
          "assessment": {{
            "title": "Skills Assessment for {profile_data['name']}",
            "instructions": "Complete within {time_limit} minutes",
            "user": {{ "name": "{profile_data['name']}", "email": "{profile_data['email']}" }},
            "skills": {selected_skills},
            "questions": [
              {{
                "id": (unique 1-{test_length}),
                "question": "Question text",
    """

    initial_prompt_json_last = f"""
                "category": "One of: {', '.join(skill_categories)}",
                "skill_assessed": "Skill tested",
                "options": ["Option A", "Option B", "Option C", "Option D"]
              }}
              // Repeat for remaining questions
            ]
          }}
        }}
        Notes:
        - Only multiple choice and fill-in-the-blank questions.
    """

    # Update the prompt to only include fill-in-the-blank and multiple-choice questions
    prompt_manager = initial_prompt + f" - Mix of multiple choice and fill-in-blank in RANDOM order " + initial_prompt_json + f""""type": "multiple_choice"|"fill_in_the_blank",""" + initial_prompt_json_last + f"""    
            // Removed short_answer section
              }}
              // Repeat for remaining questions, fill in the blanks and mcqs
            ]
          }}
        }}
        Notes:
        - Only multiple choice and fill-in-the-blank questions should be generated.
    """

    try:
        # Call the OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            # "gpt-4o",
            messages=[{"role": "user", "content": prompt_manager}],
        )

        # Print the raw response for debugging
        print("OpenAI API Response:", response)

        # Check if the response is valid
        if not response.choices:
            raise ValueError("No choices returned from OpenAI API.")

        assessment_content = response.choices[0].message.content
        cleaned_content = assessment_content.replace("```json", "").replace("```", "").strip()

        # print(cleaned_content)

        # Attempt to parse the JSON
        assessment_json = json.loads(cleaned_content)

        for question in assessment_json['assessment']['questions']:
            if 'options' in question and isinstance(question['options'], list):
                random.shuffle(question['options'])

        # print('assesment_json',assessment_json)
        # print('questions',assessment_json['assessment']['questions'])

        # Store the assessment in the database
        user, created = User.objects.get_or_create(email=profile_data['email'], defaults={'name': profile_data['name']})
        user_assessment = UserAssessment.objects.create(
            user=user,
            questions=assessment_json['assessment']['questions'],  # Store all questions in the JSONField
            completed=False  # Set completed to False initially
        )
        # Return the assessment without the user ID
        return JsonResponse({'assessment': assessment_json, 'assessment_id': user_assessment.id})

    except json.JSONDecodeError:
        print("Failed to decode JSON from response:", cleaned_content)
        return JsonResponse({"error": "Invalid JSON response from OpenAI API"}, status=500)
    except Exception as e:
        print(f"Error generating assessment: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)
    

@api_view(['POST'])
def generate_assessment_new(request):
    serializer = GenerateAssessmentSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    selected_skills = data['skills']
    profile_data = data['profileData']
    test_length = data['testLength']
    time_limit = data['timeLimit']

    transformed_skills = [
        {
            'name': skill['skill_name'],
            'proficiency': skill['rating'],
            'category': skill['tag_name']
        }
        for skill in selected_skills
    ]

    skill_categories = list(set(skill['category'] for skill in transformed_skills))

    skills_text = "\n".join(
        f"- {skill['name']} (Self-rated proficiency: {skill['proficiency']}/4, Category: {skill['category']})"
        for skill in transformed_skills
    )

    initial_prompt = f"""
        You are an AI interviewer tasked with evaluating the credibility of an individual's self-rated skills profile.

        Given a structured JSON of a user's Skills Profile — organized by categories such as:
        Knowledge / Concepts
        Applied Skills / Tasks  
        Tools & Technologies
        Domain Expertise
        Certifications
        Soft Skills

        JSON user's Skills Profile: {skills_text}

        IMPORTANT: You must generate exactly {test_length} comprehensive questions that cover the ENTIRE skills profile holistically. Since the user may have claimed 10, 15, or even 20+ skills, your questions should:

        1. **Cross-integrate multiple skills** - Combine skills from different categories into single, complex scenarios
        2. **Cover the full breadth** - Ensure all major skill areas are touched upon across the {test_length} questions
        3. **Create realistic scenarios** - Design questions around real-world projects/situations that would naturally require multiple skills simultaneously

        For example, if a user claims:
        - Web Development (Applied Skills)
        - Healthcare (Domain)  
        - Time Management (Soft Skills)
        - JavaScript (Tools)
        - Database Design (Knowledge)

        Instead of asking {test_length} separate questions about each skill, ask integrated questions like:
        "Describe a healthcare web application project where you had to manage tight deadlines while implementing complex database interactions using JavaScript. How did you balance technical requirements with healthcare compliance standards?"

        Your questions should:
        - Probe real-world application and contextual understanding across multiple claimed skills
        - Require the user to demonstrate how their skills work together in practical scenarios  
        - Test depth, consistency, and practical relevance of their ENTIRE profile
        - Be comprehensive enough that someone truly proficient would need to draw from multiple skill areas to answer effectively

        Focus on creating synergistic questions that validate the user's overall competency profile rather than testing skills in isolation.
        """

    prompt_json = f"""
        Strict: Return ONLY valid JSON (No markdown, No additional text or formatting) with this exact structure:
        {{
          "assessment": {{
            "questions": [
              {{
                "id": 1,
                "question": "Question text",
                "skill_assessed": "Primary skill being explored (but question should integrate multiple skills)",
              }}
            ]
          }}
                "category": "One of: {', '.join(skill_categories)}",
        }}

        Note: Each question should be designed to assess multiple skills simultaneously to make sure all skills are touched under {test_length} questions.
        """

    full_prompt = initial_prompt + prompt_json

    try:
        use_mock = os.getenv("USE_MOCK_ASSESSMENT", "").lower() in ("1", "true", "yes")
        if not os.getenv("OPENAI_API_KEY"):
            use_mock = True

        if use_mock:
            count = int(test_length or 5)
            questions = [
                {
                    "id": i + 1,
                    "question": (
                        f"Describe a real project where you applied "
                        f"{transformed_skills[i % len(transformed_skills)]['name']} "
                        f"({transformed_skills[i % len(transformed_skills)]['category']}). "
                        f"What was your role and outcome?"
                    ),
                    "skill_assessed": transformed_skills[i % len(transformed_skills)]["name"],
                }
                for i in range(count)
            ]
            parsed = {
                "assessment": {
                    "questions": questions,
                    "category": skill_categories[0] if skill_categories else "Tools",
                }
            }
        else:
            openai.api_key = os.getenv("OPENAI_API_KEY")
            response = openai.ChatCompletion.create(
                messages=[{"role": "user", "content": full_prompt}],
                model="gpt-3.5-turbo",
            )

            raw_content = response.choices[0].message.content.strip()

            if raw_content.startswith("```json"):
                raw_content = raw_content.replace("```json", "").replace("```", "").strip()
            elif raw_content.startswith("```"):
                raw_content = raw_content.replace("```", "").strip()

            parsed = json.loads(raw_content)

            if 'assessment' not in parsed or 'questions' not in parsed['assessment']:
                return Response(
                    {"error": "Invalid JSON structure", "raw_content": raw_content},
                    status=500
                )

            questions = parsed['assessment']['questions']

            if len(questions) != test_length:
                return Response(
                    {"error": f"Expected {test_length} questions, got {len(questions)}"},
                    status=500
                )

        if not profile_data.get("email"):
            return Response(
                {"error": "profileData.email is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Save to DB
        user = get_object_or_404(User, email=profile_data['email'])

        with transaction.atomic():
    # Check if an assessment already exists for this individual_profile_id
            assessment, created = UserAssessment.objects.get_or_create(
                individual_profile_id=user.individual_profile_id,
                defaults={f'question{i+1}': questions[i] for i in range(min(test_length, 5))}
        )

    # If it was not created (i.e., it already exists), update it
        if not created:
            for i in range(min(test_length, 5)):
                setattr(assessment, f'question{i+1}', questions[i])
            assessment.save()

        return Response({
            "assessment": parsed,
            "skills": selected_skills,
            "time_limit_minutes": time_limit,
            "assessment_id": assessment.id
        })

    except json.JSONDecodeError as e:
        return Response({
            "error": "Failed to parse JSON",
            "details": str(e),
            "raw_content": raw_content
        }, status=500)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def submit_assessment_new(request):
    serializer = SubmitAssessmentSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    assessment_id = data.get('assessment_id')
    individual_profile_id = data.get('individual_profile_id')
    skills = data.get('skills', [])
    answers = data.get('answers', [])
    test_length = 5

    if not individual_profile_id or not assessment_id:
        return Response({"error": "Missing required identifiers"}, status=400)
    if not skills:
        return Response({"error": "No skills provided"}, status=400)
    if not answers:
        return Response({"error": "No answers provided"}, status=400)

    try:
        user = User.objects.get(individual_profile_id=individual_profile_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    try:
        assessment = UserAssessment.objects.get(individual_profile_id=individual_profile_id)
    except UserAssessment.DoesNotExist:
        return Response({"error": "Assessment not found"}, status=404)

    for answer in answers:
        question_id = answer.get('question_id')
        transcript = answer.get('transcript', '').strip()
        if not transcript:
            continue
        question_field = f"question{question_id}"
        if hasattr(assessment, question_field):
            current = getattr(assessment, question_field, {})
            if current:
                current.update({
                    "user_answer": transcript,
                    "transcript": transcript,
                    "skill_assessed": answer.get('skill_assessed'),
                    "category": answer.get('category')
                })
                setattr(assessment, question_field, current)

    assessment.completed = True
    assessment.save()

    valid_answers = [a for a in answers if a.get("transcript", "").strip()]
    if not valid_answers:
        return Response({"error": "No valid transcripts found"}, status=400)

    rating_map = {1: "Beginner", 2: "Intermediate", 3: "Advanced", 4: "Expert"}
    skills_context = [
        f"- {s['skill_name']} ({s['tag_name']}): Self-rated as {s['rating']}/4 ({rating_map.get(s['rating'], 'Unknown')})"
        for s in skills
    ]

    skill_answers = {}
    for a in valid_answers:
        skill = a.get("skill_assessed", "Unknown")
        skill_answers.setdefault(skill, []).append(a)

    skill_qa = []
    for skill, items in skill_answers.items():
        qa_text = "\n".join(f"Question: {qa['question']}\nAnswer: {qa['transcript']}" for qa in items)
        skill_qa.append(f"SKILL: {skill}\nQuestions and Answers:\n{qa_text}")

    prompt = f"""
         You are a critical evaluator of skill credibility.
         The candidate has submitted answers to {test_length} skill-based questions based on their self-reported skills and proficiency levels.

         CANDIDATE'S SELF-REPORTED SKILLS:
        {chr(10).join(skills_context)}

        SKILL-BASED QUESTION-ANSWER GROUPS:
        {"".join(skill_qa)}

         Your task:       
         1. **Assess each answer individually** for: accuracy, depth, relevance, and real-world clarity.
         2. **Compare each answer to the candidate's self-rated proficiency level**.
         3. **Identify signs of over-claiming**, vague or copy-paste-like responses, reused examples, or incorrect technical content.
        
         ---
        
         ### Credibility Scoring Rules (Strict):
        
         * **HIGH**: All answers are specific, accurate, deeply aligned with claimed proficiency, no factual errors or vagueness.
         * **MEDIUM**: Mostly accurate but some generic answers or minor gaps in technical alignment.
         * **LOW**: Any of the following → vague, generic, reused, misaligned with rating, incorrect facts, or irrelevant answers.
        
         ---
        
        **CREDIBILITY CALCULATION PRIORITY:**
        1. **Mandatory Completion Check:** Count the total number of questions and how many have non-empty answers.
            - If less than 50% are answered → credibility_score must be "Low", no exceptions.
            - If 50–79% are answered → credibility_score must be "Medium" or "Low", never "High".
            - IMPORTANT:**If any question is unanswered (even one), credibility_score cannot be "High".**
            - Only if 100% of questions are answered → then and only then can credibility_score be "High", provided all answers are correct, specific, and aligned with claimed proficiency.
        2. Apply the above rule **before** evaluating the quality of the provided answers.
        3. Never output a score higher than allowed by the completion rate.
        4. IMPORTANT:"High" can only be assigned if **all questions are answered** and **every answer is correct, specific, and aligned with the claimed proficiency**.
        5. If the candidate answered more than 50% of the questions with strong, correct, and specific answers, 
           and the remaining unanswered or weak answers are less than 50%, the credibility_score should be "Medium", 
           not "Low". 
        6. IMPORTANT:"Low" is only assigned when:
           - Less than 50% of questions are answered, OR
           - A majority of the answers are vague, incorrect, or missing.

         ### Output Format (JSON):(return json only, no any additional text or formatting)
        
         ```json
         {{
           "remark": "Provide an overall assessment addressing the candidate directly using 'you' and 'your', explaining their performance across all answered questions, highlighting strengths, weaknesses, any over-claims, vague responses, or mismatches with their claimed proficiency levels.",
           "credibility_score": "High | Medium | Low"
         }}
         ```
        
         Be tough but fair. If the candidate claimed expert skill and gave generic or partially wrong responses, the score must be **LOW**.
         If answers repeat the same story or feel rehearsed, deduct credibility.
        """

    try:
        openai.api_key = os.getenv("OPENAI_API_KEY")
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert technical assessor. Provide accurate, fair evaluations based on the evidence presented. Always return valid JSON in the exact format requested."},
                {"role": "user", "content": prompt}
            ]
        )

        content = response.choices[0].message.content.strip()

        if "```json" in content:
            start = content.find("```json") + 7
            end = content.find("```", start)
            json_text = content[start:end].strip()
        else:
            start = content.find("{")
            end = content.rfind("}") + 1
            json_text = content[start:end]

        result_json = json.loads(json_text)

        AssessmentResult.objects.create(
            individual_profile_id=individual_profile_id,
            assessment_id=assessment_id,
            remarks=result_json.get("remark", ""),
            overall_score=result_json.get("credibility_score", "Low"),
            skills_assessed=len(skills),
            questions_answered=len(valid_answers),
            total_questions=len(answers),
            data=valid_answers
        )

        return Response({
            "assessment_id": assessment_id,
            "remarks": result_json.get("remark", ""),
            "overall_score": result_json.get("credibility_score", ""),
            "skills_assessed": len(skills),
            "questions_answered": len(valid_answers),
            "total_questions": len(answers),
            "data": answers
        })

    except json.JSONDecodeError as e:
        return Response({
            "error": "Failed to parse JSON",
            "details": str(e),
            "raw_content": raw_content
        }, status=500)

    except Exception as e:
        return Response({"error": str(e)}, status=500)




@api_view(['POST'])
def submit_assessment(request):
    data = request.data
    user_email = data.get('email')
    assessment_id = data.get('assessment_id')
    answers = data.get('answers', [])

    try:
        user = User.objects.get(email=user_email)
        assessment = UserAssessment.objects.get(id=assessment_id, user=user)

        total_questions = len(answers)
        total_correct = 0
        evaluated_answers = []

        for answer in answers:
            question_id = answer.get('question_id')
            question_text = answer.get('question')  # now expected in the payload
            user_selected_option_index = answer.get('user_selected_option_index')
            user_selected_option_text = answer.get('user_selected_option_text')

            # Prompt OpenAI to evaluate the correct answer
            prompt = f"""
            You are evaluating a multiple choice question. Identify the correct answer index and text.
            
            Question: {question_text}
            Options: {answer.get("options")}
            User selected index: {user_selected_option_index}
            User selected text: {user_selected_option_text}

            Return the output as JSON in this format:
            {{
              "correct_option_index": <index>,
              "correct_option_text": "<correct option text>"
            }}
            """

            try:
                openai_response = openai.ChatCompletion.create(
                    model="gpt-4o",
                    # "gpt-4o",
                    messages=[{"role": "user", "content": prompt}]
                )
                cleaned = openai_response.choices[0].message.content.strip().replace("```json", "").replace("```", "")
                evaluation = json.loads(cleaned)

                correct_option_index = evaluation["correct_option_index"]
                correct_option_text = evaluation["correct_option_text"]
                is_correct = user_selected_option_index == correct_option_index

                if is_correct:
                    total_correct += 1

                evaluated_answers.append({
                    "question_id": question_id,
                    "question": question_text,
                    "user_selected_option_index": user_selected_option_index,
                    "user_selected_option_text": user_selected_option_text,
                    "is_correct": is_correct,
                    "correct_option_index": correct_option_index,
                    "correct_option_text": correct_option_text
                })

            except Exception as e:
                print(f"OpenAI error for question {question_id}: {e}")
                evaluated_answers.append({
                    "question_id": question_id,
                    "question": question_text,
                    "user_selected_option_index": user_selected_option_index,
                    "user_selected_option_text": user_selected_option_text,
                    "is_correct": False,
                    "correct_option_index": None,
                    "correct_option_text": None,
                    "error": "Evaluation failed"
                })

        score_percentage = round((total_correct / total_questions) * 100) if total_questions > 0 else 0

        # Simple evaluation label
        if score_percentage >= 80:
            overall_evaluation = "excellent"
        elif score_percentage >= 60:
            overall_evaluation = "fair"
        else:
            overall_evaluation = "needs improvement"

        response_data = {
            "assessment_id": assessment_id,
            "email": user_email,
            "total_questions": total_questions,
            "total_correct": total_correct,
            "score_percentage": score_percentage,
            "answers": evaluated_answers,
            "overall_evaluation": overall_evaluation
        }

        assessment.completed = True
        assessment.save()

        return JsonResponse(response_data)

    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except UserAssessment.DoesNotExist:
        return JsonResponse({"error": "Assessment not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

@api_view(['GET'])
def discipline_list(request):
    discipline = Discipline.objects.all()
    serializer = DisciplineSerializer(discipline, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def level_of_education_list(request):
    level_of_education = LevelOfEducation.objects.all()
    serializer = LevelOfEducationSerializer(level_of_education, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_countries(request):
    countries = Country.objects.all().values('id', 'name')
    return Response(countries)

@api_view(['GET'])
def get_states(request, country_id):
    states = State.objects.filter(country_id=country_id).values('id', 'name')
    return Response(states)

@api_view(['GET'])
def get_cities(request, country_id, state_id):
    cities = City.objects.filter(country_id=country_id, state_id=state_id).values('id', 'name')
    return Response(cities)

@api_view(['POST'])
def save_job_profile(request):
    # Prepare the data for the serializer
    user_id = request.data.get('user_id')
    job_title = request.data.get('job_title')

    # Generate a 10-character alphanumeric string
    def generate_alphanumeric_id(length=10):
        return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

    # Check if a JobProfile with the given user_id and job_title already exists
    job_profile, created = JobProfiles.objects.get_or_create(
        individual_profile_id=user_id,
        job_title=job_title,
        defaults={
            'user_name': request.data.get('user_name'),
            'user_email': request.data.get('user_email'),
            'userRatedSkills': request.data.get('userRatedSkills'),
            'background_details': request.data.get('background_details', None),  # Default to None if not provided
            'individual_job_id': generate_alphanumeric_id()  # Generate a 10-character alphanumeric string
        }
    )

    if not created:
        # If the job profile already exists, update the fields (do not update individual_job_id)
        job_profile.user_name = request.data.get('user_name')
        job_profile.user_email = request.data.get('user_email')
        job_profile.userRatedSkills = request.data.get('userRatedSkills')
        job_profile.background_details = request.data.get('background_details', None)  # Update if provided
        job_profile.save()  # Save the updated instance

    # Serialize the job profile data to return
    serializer = JobProfilesSerializer(job_profile)

    # Include the id in the response
    response_data = {
        'job_id': job_profile.individual_job_id,  # Include the id of the job profile
        **serializer.data  # Include the serialized data
    }

    return Response(response_data, status=status.HTTP_200_OK if created else status.HTTP_200_OK)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def get_job_titles(request, user_id):
    try:
        # Query the JobProfile model for the given user_id
        job_profiles = JobProfiles.objects.filter(individual_profile_id=user_id)

        # Extract job titles and ids from the job profiles
        job_data = []
        for job_profile in job_profiles:
            # Count the number of candidates for the current job profile
            applied_candidates_count = CandidateProfile.objects.filter(job_id=job_profile.individual_job_id).count()

            job_data.append({
                'id': job_profile.individual_job_id,  # Get the ID of the job profile
                'job_title': job_profile.job_title,  # Get the job title
                'applied_candidates_count': applied_candidates_count,  # Count of applied candidates
                'has_background_details': bool(job_profile.background_details) and bool(json.loads(job_profile.background_details)) if job_profile.background_details else False,  # Check if background_details has data
                'is_short_listed': bool(job_profile.short_listed) and bool(json.loads(job_profile.short_listed)) if job_profile.short_listed else False  # Check if short_listed has data
            })

        return Response({
            'user_id': user_id,  # Include user_id once
            'job_profiles': job_data  # Return the list of job profiles
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def submit_job_background_profile(request):
    try:
        data = request.data
        
        # Debugging: Log the incoming request data
        print("Incoming request data:", data)

        # Extract data from the request
        user_id = data.get("user_id")
        job_title = data.get("job_title")  # Ensure this matches your model field

        # Validate user existence and retrieve the job profile
        print(f"Looking for JobProfile with user ID: {user_id} and job title: {job_title}")  # Debugging statement
        
        # Check if a JobProfile exists for the given user and job title
        job_profile = JobProfiles.objects.filter(individual_profile_id=user_id, job_title=job_title).first()

        if job_profile:
            # Prepare the background details to save
            background_details = {
                "vsp_cost": data.get("vsp_cost"),
                "vsp_currency": data.get("vsp_currency"),
                "workPreference": data.get("workPreference"),
                "company_name": data.get("company_name"),
                "company_website": data.get("company_website"),
                "company_description": data.get("company_description"),
                "work_description": data.get("work_description"),
            }

            # Save the background details in the JobProfile model
            job_profile.background_details = json.dumps(background_details)  # Assuming background_details is a JSONField
            job_profile.save()

            return Response({"message": "Job background profile updated successfully!"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "No matching JobProfile found for the given user and job title."}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Debugging statement
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def retrieve_job_background_details(request, user_id, id):
    try:
        # Retrieve the JobProfile for the user with the specified id
        job_profile = JobProfiles.objects.filter(individual_profile_id=user_id, individual_job_id=id).first()

        # Check if job_profile exists
        if not job_profile:
            return Response([], status=status.HTTP_200_OK)  # Return empty array if no job profile found

        # Get the background details
        background_details = job_profile.background_details  # Assuming this is a JSONField

        # Check if background details exist
        if background_details:
            background_details = json.loads(background_details)  # Parse JSON if necessary
            return Response({
                'user_id': job_profile.individual_profile_id,  # Return the user_id from the JobProfile
                'job_id': job_profile.individual_job_id,
                'job_title': job_profile.job_title,  # Include the job_title in the response
                'background_details': background_details  # Return the parsed background details
            }, status=status.HTTP_200_OK)
        else:
            return Response([], status=status.HTTP_200_OK)  # Return only empty array if no background details

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_user_rated_skills(request, user_id, id):
    try:
        # Retrieve the JobProfile for the user with the specified id
        job_profile = get_object_or_404(JobProfiles, individual_profile_id=user_id, individual_job_id=id)

        # Extract userRatedSkills from the job profile
        user_rated_skills = job_profile.userRatedSkills  # Assuming this is a JSONField

        # Check if userRatedSkills is a string and parse it
        if isinstance(user_rated_skills, str):
            user_rated_skills = json.loads(user_rated_skills)  # Parse JSON if it's a string
        elif not isinstance(user_rated_skills, list):
            user_rated_skills = []  # Ensure it's a list if it's not a string or list

        return Response(user_rated_skills, status=status.HTTP_200_OK)  # Return the userRatedSkills

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def get_job_rated_skills(request, id):
    try:
        # Retrieve the JobProfile for the user with the specified id
        job_profile = get_object_or_404(JobProfiles, individual_job_id=id)

        # Extract userRatedSkills from the job profile
        user_rated_skills = job_profile.userRatedSkills  # Assuming this is a JSONField

        # Check if userRatedSkills is a string and parse it
        if isinstance(user_rated_skills, str):
            user_rated_skills = json.loads(user_rated_skills)  # Parse JSON if it's a string
        elif not isinstance(user_rated_skills, list):
            user_rated_skills = []  # Ensure it's a list if it's not a string or list

        return Response(user_rated_skills, status=status.HTTP_200_OK)  # Return the userRatedSkills

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def shortlist_profiles(request):
    try:
        data = request.data
        
        # Extract data from the request
        user_id = data.get("user_id")
        job_id = data.get("job_id")
        job_title = data.get("job_title")

        # Validate user existence and retrieve the job profile
        job_profile = get_object_or_404(JobProfiles, individual_profile_id=user_id, individual_job_id=job_id)

        # Save the entire request structure in the short_listed field
        job_profile.short_listed = json.dumps(data)  # Save the entire request data as JSON

        # Save the job profile with updated details
        job_profile.save()

        return Response({"message": "Job profile updated successfully!", "data": json.loads(job_profile.short_listed)}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_shortlisted_profiles(request, user_id, id):
    try:
        # Retrieve the JobProfile for the user with the specified id
        job_profile = get_object_or_404(JobProfiles, individual_profile_id=user_id, individual_job_id=id)

        # Extract the shortlisted profiles from the job profile
        if job_profile.short_listed:
            shortlisted_profiles = json.loads(job_profile.short_listed)  # Parse JSON if it's a string
        else:
            shortlisted_profiles = []  # Return an empty array if no shortlisted profiles

        # Check if user_id exists in JobProfiles for the given individual_job_id
        # has_job_profile = JobProfiles.objects.filter(individual_profile_id=user_id, individual_job_id=id).exists()
        # # Ensure shortlisted_profiles is a list of dictionaries
        # if isinstance(shortlisted_profiles, list):
        #     for profile in shortlisted_profiles:
        #         if isinstance(profile, dict):
        #             profile["job_background_profiles"] = has_job_profile

        return Response(shortlisted_profiles, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def save_request_details(request):
    try:
        request_data = json.loads(request.body)

        # Extract necessary fields from the request
        job_id = request_data.get('job_id')
        user_id = request_data.get('user_id')
        recruiter_id = request_data.get('recruiter_id')
        message_type = request_data.get('message_type')
        message = request_data.get('message')

        if not user_id or not recruiter_id or not message_type or not message:
            return JsonResponse({"error": "user_id, recruiter_id, message_type, and message are required."}, status=400)

        # If job_id is provided, handle as before
        if job_id:
            # Check if notification already exists
            notification, created = Notifications.objects.get_or_create(
                sender_id=recruiter_id,
                receiver_id=user_id,
                job_id=job_id,
                job_name=request_data.get('job_name', None),  # Optional
                message_type=message_type,
                message=message,
                job_profile_url=request_data.get('job_profile_url', None),  # Optional
                job_background_url=request_data.get('job_background_url', None)  # Optional
            )

            if not created:
                # Update existing notification
                notification.job_name = request_data.get('job_name', None)
                notification.message_type = message_type
                notification.message = message
                notification.job_profile_url = request_data.get('job_profile_url', None)
                notification.job_background_url = request_data.get('job_background_url', None)
                notification.save()

            # Retrieve the short_listed field from the job profile using job_id from request data
            job_profile = JobProfiles.objects.filter(individual_job_id=job_id).values('short_listed').first()  # Querying only the short_listed field
            
            if job_profile is None:
                return JsonResponse({'status': 'error', 'message': 'Job profile not found.'}, status=404)

            shortlisted_profiles = json.loads(job_profile['short_listed'])  # Access the short_listed field

            # Update the shortlisted profiles based on the request data
            for profile in shortlisted_profiles['shortlisted_profiles']:
                if profile['user_id'] == user_id:
                    if message_type == 'pbp':
                        profile['pbp_msg_status'] = 'pending'
                    elif message_type == 'pcp':
                        profile['pcp_msg_status'] = 'pending'
                    break  # Exit the loop once the matching user is found

            # Save the updated shortlisted list back into the job_profile
            job_profile_instance = JobProfiles.objects.get(individual_job_id=job_id)
            job_profile_instance.short_listed = json.dumps(shortlisted_profiles)  # Convert back to JSON string
            job_profile_instance.save()

        else:
            # If job_id is not provided, check in DirectContact model
            direct_contact = DirectContact.objects.filter(recruiter_id=recruiter_id).first()
            if direct_contact:
                # Update the message type status in DirectContact
                if message_type == 'pbp':
                    direct_contact.shortlisted_profiles['pbp_msg_status'] = 'pending'
                elif message_type == 'pcp':
                    direct_contact.shortlisted_profiles['pcp_msg_status'] = 'pending'

                direct_contact.save()

                # Store in Notifications model
                notification, created = Notifications.objects.get_or_create(
                    sender_id=recruiter_id,
                    receiver_id=user_id,
                    job_id=None,  # Set to None since job_id is not provided
                    job_name=None,  # Set to None
                    message_type=message_type,
                    message=message,
                    job_profile_url=None,  # Set to None
                    job_background_url=None  # Set to None
                )

                if not created:
                    # Update existing notification
                    notification.message_type = message_type
                    notification.message = message
                    notification.save()

            else:
                return JsonResponse({"error": "Direct contact not found."}, status=404)

        # Send email notification based on message_type
        user_obj = User.objects.filter(individual_profile_id=user_id).first()
        if user_obj and user_obj.email:
            user_name = f"{user_obj.first_name} {user_obj.last_name}".strip() or user_obj.username or "User"
            email_service = EmailService()
            if message_type == 'pbp':
                email_service.send_pbp_request_notification(user_obj.email, user_name)
            elif message_type == 'pcp':
                email_service.send_pcp_request_notification(user_obj.email, user_name)

        return JsonResponse({'status': 'success', 'message': 'Notification saved and status updated.'})

    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON.'}, status=400)
    except KeyError as e:
        return JsonResponse({'status': 'error', 'message': f'Missing key: {str(e)}'}, status=400)
    except JobProfiles.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Job profile not found.'}, status=404)  # Handle case where job profile does not exist
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@api_view(['GET'])
def get_notifications(request, receiver_id):
    try:
        # Retrieve only notifications with status 'pending' for the given receiver_id
        notifications = Notifications.objects.filter(receiver_id=receiver_id, status='pending')

        # Serialize the notifications
        notification_data = []
        for notification in notifications:
            # Initialize user_name as None
            user_name = None
            
            # Check if sender_id matches user_id in JobProfiles
            job_profile = JobProfiles.objects.filter(individual_profile_id=notification.sender_id).first()
            if job_profile:
                user_name = job_profile.user_name  # Get the user_name from JobProfiles

            notification_data.append({
                'id': notification.id,
                'sender_id': notification.sender_id,
                'sender_name': user_name,  # Include the user_name
                'receiver_id': notification.receiver_id,
                'job_id': notification.job_id,
                'job_name': notification.job_name,
                'message_type': notification.message_type,
                'message': notification.message,
                'job_profile_url': notification.job_profile_url,  # Include job_profile_url
                'job_background_url': notification.job_background_url,  # Include job_background_url
                'status': notification.status,
                'created_at': notification.created_at,
                'updated_at': notification.updated_at
            })

        # Return only the notifications array
        return JsonResponse(notification_data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@api_view(['GET'])
def get_closed_messages(request, receiver_id):
    try:
        # Retrieve only notifications with status 'approved' or 'rejected' for the given receiver_id
        notifications = Notifications.objects.filter(
            receiver_id=receiver_id
        ).filter(Q(status='approved') | Q(status='rejected'))  # Corrected filter usage

        # Serialize the notifications
        notification_data = []
        for notification in notifications:
            # Initialize user_name as None
            user_name = None
            
            # Check if sender_id matches user_id in JobProfiles
            job_profile = JobProfiles.objects.filter(individual_profile_id=notification.sender_id).first()
            if job_profile:
                user_name = job_profile.user_name  # Get the user_name from JobProfiles

            notification_data.append({
                'id': notification.id,
                'sender_id': notification.sender_id,
                'sender_name': user_name,  # Include the user_name
                'receiver_id': notification.receiver_id,
                'job_id': notification.job_id,
                'job_name': notification.job_name,
                'message_type': notification.message_type,
                'message': notification.message,
                'status': notification.status,
                'created_at': notification.created_at,
                'updated_at': notification.updated_at,
                'job_profile_url': notification.job_profile_url,  # Include job_profile_url
                'job_background_url': notification.job_background_url  # Include job_background_url
            })

        # Return only the notifications array
        return JsonResponse(notification_data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

# @api_view(['POST'])
# def respond_to_notifications(request):
#     print("🚀 View hit!")
#     return JsonResponse({"msg": "ok"})



@api_view(['POST'])
def respond_to_notifications(request):
    try:
        # Get data from the request
        data = request.data
        receiver_id = data.get('receiver_id')
        notification_id = data.get('notification_id')
        sender_id = data.get('sender_id')
        job_id = data.get('job_id')
        message_type = data.get('message_type')
        status = data.get('status')

        print('notification_id', notification_id)

        # Update the notification status
        notification = Notifications.objects.get(
            id=notification_id,
            receiver_id=receiver_id,
            job_id=job_id,
            sender_id=sender_id,
            message_type=message_type
        )
        notification.status = status
        notification.save()

        if job_id:
            # Update the shortlisted_profiles in JobProfiles
            job_profile = JobProfiles.objects.get(individual_job_id=job_id)

            # Update the corresponding status in shortlisted_profiles
            shortlisted_profiles = json.loads(job_profile.short_listed)  # Assuming short_listed is a JSONField
            
            for profile in shortlisted_profiles['shortlisted_profiles']:
                if profile['user_id'] == receiver_id: 
                    if message_type == "pbp":
                        profile['pbp_msg_status'] = status  # Update pbp status
                    elif message_type == "pcp":
                        profile['pcp_msg_status'] = status  # Update pcp status
                    break  # Exit the loop once the matching user is found

            # Save the updated shortlisted_profiles back to JobProfiles
            job_profile.short_listed = json.dumps(shortlisted_profiles)
            job_profile.save()

        else:
            # If job_id is not provided, check in DirectContact model
            direct_contact = DirectContact.objects.filter(recruiter_id=sender_id).first()
            if direct_contact:
                # Update the message type status in DirectContact
                if message_type == "pbp":
                    direct_contact.shortlisted_profiles['pbp_msg_status'] = status
                elif message_type == "pcp":
                    direct_contact.shortlisted_profiles['pcp_msg_status'] = status

                direct_contact.save()
            else:
                return JsonResponse({"error": "Direct contact not found."}, status=404)

        # If the status is approved, create a chat conversation entry
        if status == "approved":
            message = notification.message  # Get the message from the notification
            ChatConversations.objects.create(
                sender_id=sender_id,
                receiver_id=receiver_id,
                message=message
            )

        return JsonResponse({'status': 'success', 'message': 'Notification status updated and job profile modified.'}, status=200)

    except Notifications.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Notification not found.'}, status=404)
    except JobProfiles.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Job profile not found.'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON in job profile.'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# Fetch conversations for a user
@api_view(['GET'])
# @permission_classes([IsAuthenticated])  # Uncomment if you want to enforce authentication
def fetch_conversations(request, individual_profile_id):
    conversations = (
        ChatConversations.objects.filter(Q(sender_id=individual_profile_id) | Q(receiver_id=individual_profile_id))
        .select_related('sender_id', 'receiver_id')  # Use select_related to fetch related User objects
        .order_by('-send_at')  # Order by the latest message time
        .values('id', 'sender_id', 'receiver_id', 'message', 'send_at')
    )

    conversation_list = []
    for conv in conversations:
        other_user_id = conv['receiver_id'] if conv['sender_id'] == individual_profile_id else conv['sender_id']
        try:
            other_user = User.objects.get(individual_profile_id=other_user_id)  # Fetch the other user dynamically
        except User.DoesNotExist:
            continue  # Skip this conversation if the user does not exist

        conversation_list.append({
            "id": conv['id'],
            "user": {
                "id": other_user.individual_profile_id,
                "username": f"{other_user.first_name} {other_user.last_name}",  # Use actual username
            },
            "last_message": {
                "text": conv['message'],
                "time": conv['send_at'].strftime("%I:%M %p")  # Format time as needed
            },
            "updated_at": conv['send_at'].isoformat()  # ISO format for updated_at
        })

    return Response(conversation_list, status=status.HTTP_200_OK)

# Fetch messages for a conversation
@api_view(['GET'])
# @permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def fetch_messages(request, sender_id, receiver_id):
    messages = (
        ChatConversations.objects.filter(
            (Q(sender_id=sender_id) & Q(receiver_id=receiver_id)) |
            (Q(sender_id=receiver_id) & Q(receiver_id=sender_id))
        )
        .order_by('send_at')  # Order messages by the send_at timestamp
    )

    message_list = []
    for msg in messages:
        # Fetch user details for sender
        sender_user = User.objects.filter(individual_profile_id=msg.sender_id).first()
        sender_username = f"{sender_user.first_name} {sender_user.last_name}" if sender_user else "Unknown"

        message_list.append({
            "id": msg.id,
            "sender": {
                "id": msg.sender_id,
                "username": sender_username,  # Use the fetched username
            },
            "text": msg.message,
            "seen": msg.read_at is not None,  # True if read_at is set
            "timestamp": msg.send_at.isoformat()  # ISO format for timestamp
        })

    return Response(message_list, status=status.HTTP_200_OK)

# Send a message
@api_view(['POST'])
# @permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def send_message(request):
    try:
        to_user_id = request.data.get('to_user_id')
        from_user_id = request.data.get('from_user_id')
        message = request.data.get('message')

        if not to_user_id or not from_user_id or not message:
            return Response({"error": "to_user_id, from_user_id, and message are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Save the message using sender_id and receiver_id as CharFields
        chat_message = ChatConversations.objects.create(
            sender_id=from_user_id,
            receiver_id=to_user_id,
            message=message,
            send_at=timezone.now()  # Set the send_at time to now
        )

        # Look up User object for sender details for the response
        try:
            sender_user = User.objects.get(individual_profile_id=from_user_id)
            sender_username = f"{sender_user.first_name} {sender_user.last_name}".strip() or sender_user.username or "User"
        except User.DoesNotExist:
            sender_username = from_user_id  # fallback to ID if user not found

        return Response({
            "id": chat_message.id,
            "sender": {
                "id": from_user_id,
                "username": sender_username,
            },
            "text": chat_message.message,
            "seen": False,  # Default to false when sending
            "timestamp": chat_message.send_at.isoformat()  # ISO format for timestamp
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def reject_reason(request):
    receiver_id = request.data.get('receiver_id')
    notification_id = request.data.get('notification_id')
    sender_id = request.data.get('sender_id')
    job_id = request.data.get('job_id')
    reasons = request.data.get('reasons')
    other_note = request.data.get('other_note', '')

    try:
        notification = Notifications.objects.get(
            id=notification_id,
            receiver_id=receiver_id,
            sender_id=sender_id,
            job_id=job_id
        )
        notification.reason = {
            "reasons": reasons,
            "other_note": other_note
        }
        notification.save()
        return Response({"message": "Reason saved successfully."}, status=status.HTTP_200_OK)
    except Notifications.DoesNotExist:
        return Response({"error": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def check_job_background_status(request, user_id, job_id):
    try:
        # Check if the JobProfile exists for the given user_id and job_id
        job_profile_exists = JobProfiles.objects.filter(individual_profile_id=user_id, individual_job_id=job_id).exists()

        if job_profile_exists:
            return Response({
                "status": "success",
                "hasBackgroundProfile": True
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "status": "success",
                "hasBackgroundProfile": False
            }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def save_candidate_profile(request):
    candidate_data = {
        'name': request.data.get('name'),
        'email': request.data.get('email'),
        'job_id': request.data.get('job_id'),
        'job_name': request.data.get('job_title'),
        'candidate_skills': request.data.get('rated_skills')  # Should be sent as JSON
        # 'resume': request.FILES.get('resume')
    }

    # Ensure `candidate_skills` is parsed from JSON if it was sent as a string
    if isinstance(candidate_data['candidate_skills'], str):
        try:
            candidate_data['candidate_skills'] = json.loads(candidate_data['candidate_skills'])
        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON in rated_skills'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = CandidateProfileSerializer(data=candidate_data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])  # Allow any user to access this endpoint
def get_candidate_details(request, job_id):
    candidates = CandidateProfile.objects.filter(job_id=job_id)
    candidate_profiles = CandidateProfileSerializer(candidates, many=True).data

    if not candidate_profiles:
        return Response({"message": "No candidates found for this job."}, status=status.HTTP_201_CREATED)
    
    job_profile = get_object_or_404(JobProfiles, individual_job_id=job_id)


    response_data = {
        "job_id": job_id,
        "job_title": candidates.first().job_name if candidates else None,
        "job_skills": job_profile.userRatedSkills,  # Assuming job_name is the same for all candidates
        "candidate_profiles": candidate_profiles
    }

    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
# @permission_classes([IsAuthenticated])  # Uncomment if you want to enforce authentication
def delete_job(request, id):
    try:
        # Delete the job profile
        job_profile = JobProfiles.objects.get(individual_job_id=id)
        
        # Delete associated candidates
        CandidateProfile.objects.filter(job_id=job_profile).delete()
        
        # Delete the job profile itself
        job_profile.delete()

        return Response({"message": "Job and associated candidates deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    except JobProfiles.DoesNotExist:
        return Response({"error": "Job profile not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
# @permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def update_job_profile(request):
    try:
        # Extract data from the request
        job_id = request.data.get('job_id')
        job_title = request.data.get('job_title')
        user_rated_skills = request.data.get('userRatedSkills')

        if not job_id or not job_title or user_rated_skills is None:
            return Response({"error": "job_id, job_title, and userRatedSkills are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the JobProfile for the specified job_id
        job_profile = get_object_or_404(JobProfiles, individual_job_id=job_id)

        # Update the job title
        job_profile.job_title = job_title

        # Update the userRatedSkills
        job_profile.userRatedSkills = json.dumps(user_rated_skills)  # Assuming userRatedSkills is a JSONField

        # Save the updated job profile
        job_profile.save()

        return Response({"message": "Job profile updated successfully."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
def generate_assessment_id():
    """Generate a random 10-character alphanumeric string."""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))


@api_view(['GET'])
def get_assessment_result(request, individual_profile_id):
    try:
        # Retrieve the assessment results for the given individual_profile_id
        results = IndividualAssessment.objects.filter(individual_profile_id=individual_profile_id)

        if not results.exists():
            # Debug: Check total count and sample IDs in table
            total_count = IndividualAssessment.objects.count()
            sample_ids = list(IndividualAssessment.objects.values_list('individual_profile_id', flat=True)[:10])
            return Response({
                "error": "No assessment results found for this individual profile ID.",
                "debug": {
                    "requested_id": individual_profile_id,
                    "total_records_in_table": total_count,
                    "sample_individual_profile_ids": sample_ids
                }
            }, status=404)

        # Prepare the response data
        response_data = []
        for result in results:
            response_data.append({
                "assessment_id": result.assessment_id,
                "remarks": result.remarks,
                "overall_score": result.credibility_score,
                "skills_assessed": result.skills,
                "questions_answered": len(result.qa_data) if result.qa_data else 0,
                "total_questions": len(result.qa_data) if result.qa_data else 0,
                "data": result.qa_data,
                "created_at": result.created_at,
                "updated_at": result.updated_at,
            })

        return Response(response_data, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def generate_questions(request):
    serializer = GenerateJobAssessmentSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    recruiter_id = data["recruiter_id"]
    job_description = data["job_description"]
    job_title = data["job_title"]
    test_length = 5

    # Create OpenAI client
    openai.api_key = os.getenv("OPENAI_API_KEY")

    prompt = f"""
            You are an AI interviewer tasked with generating exactly {test_length}  questions to test the interviewee's job fit for the job description below:{job_description}
            IMPORTANT: You must generate exactly {test_length} comprehensive questions  based on this job description to evaluate whether the user's experience and qualifications align with the role requirements.
            Your questions should:
            - Probe real-world application and contextual understanding across multiple claimed skills
            - Require the user to demonstrate how their skills work together in practical scenarios  
            - Test depth, consistency, and practical relevance of their ENTIRE profile
            - Be comprehensive enough that someone truly proficient would need to draw from multiple skill areas to answer effectively
            !!Strict!! IMPORTANT: Return ONLY valid JSON (No markdown, No additional text or formatting) with this exact structure:
            {{
              "assessment": {{
                "questions": [
                  {{
                    "id": 1,
                    "question": "Question text",
                  }}
                ]
              }}
            }}
            """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ],
        )

        gpt_content = response.choices[0].message.content.strip()

        # Clean GPT response
        if "```json" in gpt_content:
            gpt_content = gpt_content.replace("```json", "").replace("```", "").strip()
        elif "```" in gpt_content:
            gpt_content = gpt_content.replace("```", "").strip()

        questions_json = json.loads(gpt_content)

        # Validate structure
        if "assessment" not in questions_json or "questions" not in questions_json["assessment"]:
            return Response({"error": "Invalid GPT JSON structure"}, status=500)

        questions_list = questions_json["assessment"]["questions"]
        if len(questions_list) != test_length:
            return Response({"error": f"Expected {test_length} questions, got {len(questions_list)}"}, status=500)
        
        
        # Save to DB
        token = uuid.uuid4().hex
        assessment = RecruiterAssessment.objects.create(
            job_title=job_title,
            recruiter_id=recruiter_id,
            job_description=job_description,
            token=token,
            questions=questions_list
        )

        frontend_url = os.getenv("VANI_URL", "https://localhost:3000")
        interview_link = f"{frontend_url}/jobfit/interview/{token}"

        return Response({
            "job_title": job_title,
            "job": job_description,
            "link": interview_link,
            "token": token
        }, status=200)

    except json.JSONDecodeError:
        return Response({"error": "Failed to parse GPT response as JSON"}, status=500)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(['POST'])
def jobfit_generate_assessment(request):
    serializer = GenerateJobAssessmentSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    recruiter_id = data["recruiter_id"]
    job_description = data["job_description"]
    job_title = data["job_title"]
    test_length = 5


    existing_assessment = RecruiterAssessment.objects.filter(
        job_title=job_title,
        recruiter_id=recruiter_id,
    ).first()
    
    if existing_assessment:
        return Response(
            {"error": "You already created a job with this title."},
            status=400
        )

    # Create OpenAI client
    prompt = VaniEngine.build_prompt("jobfit","generate_questions",{"test_length":test_length,"job_description":job_description})
    recruiter_questions = VaniEngine.ask_ai_questions(5,prompt)

    try:
        
        # Save to DB
        token = uuid.uuid4().hex
        assessment = RecruiterAssessment.objects.create(
            job_title=job_title,
            recruiter_id=recruiter_id,
            job_description=job_description,
            token=token,
            questions=recruiter_questions
        )

        frontend_url = os.getenv("VANI_URL", "https://localhost:3000")
        interview_link = f"{frontend_url}/jobfit/interview/{token}"

        return Response({
            "success":True,
            "message": "Interview Link Generated Successfully...",
            "job_title": job_title,
            "job": job_description,
            "link": interview_link,
            "token": token
        }, status=200)

    except json.JSONDecodeError:
        return Response({"error": "Failed to parse GPT response as JSON"}, status=500)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
def jobfit_fetch_interview_link(request):
    try:
        # 🔹 Get query params
        job_id = request.GET.get("job_id")
        job_title = request.GET.get("job_title")

        # 🔹 Validate input
        if not job_id or not job_title:
            return Response(
                {"error": "job_id and job_title are required"},
                status=400
            )

        job_profiles = JobProfiles.objects.filter(
            individual_job_id=job_id,
            job_title=job_title
        ).first()

        # 🔹 Find existing record
        assessment = RecruiterAssessment.objects.filter(
            recruiter_id = job_profiles.individual_profile_id,
            job_title=job_title
        ).first()

        if not assessment:
            return Response(
                {"error": "No assessment found for this job."},
                status=404
            )

        # 🔹 Build response
        token = assessment.token

        frontend_url = os.getenv("VANI_URL", "http://localhost:3000")
        interview_link = f"{frontend_url}/jobfit/interview/{token}"

        return Response({
            "link": interview_link
        }, status=200)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=500
        )
    
@api_view(['POST'])
def generate_questions_new(request):
    serializer = GenerateJobAssessmentSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    recruiter_id = data["recruiter_id"]
    job_description = data["job_description"]
    job_title = data["job_title"]
    emails = data.get("emails", [])
    test_length = 5

    if not job_description or not emails or not isinstance(emails, list):
        return Response({"error": "Job Description and emails list are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Check if job_description already exists
    existing_assessment = RecruiterAssessment.objects.filter(recruiter_id=recruiter_id, job_description=job_description).first()
    if existing_assessment:
        return Response({"error": "Already generated link for this job..."}, status=status.HTTP_409_CONFLICT)

    # Create OpenAI client
    openai.api_key = os.getenv("OPENAI_API_KEY")

    prompt = f"""
    You are an AI interviewer tasked with generating exactly {test_length} questions to test the interviewee's job fit for the job description below: {job_description}
    IMPORTANT: You must generate exactly {test_length} comprehensive questions based on this job description to evaluate whether the user's experience and qualifications align with the role requirements.
    Your questions should:
    - Probe real-world application and contextual understanding across multiple claimed skills
    - Require the user to demonstrate how their skills work together in practical scenarios  
    - Test depth, consistency, and practical relevance of their ENTIRE profile
    - Be comprehensive enough that someone truly proficient would need to draw from multiple skill areas to answer effectively
    !!Strict!! IMPORTANT: Return ONLY valid JSON (No markdown, No additional text or formatting) with this exact structure:
    {{
      "assessment": {{
        "questions": [
          {{
            "id": 1,
            "question": "Question text"
          }}
        ]
      }}
    }}
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
        )

        gpt_content = response.choices[0].message.content.strip()

        # Clean GPT response
        if "```json" in gpt_content:
            gpt_content = gpt_content.replace("```json", "").replace("```", "").strip()
        elif "```" in gpt_content:
            gpt_content = gpt_content.replace("```", "").strip()

        questions_json = json.loads(gpt_content)

        # Validate structure
        if "assessment" not in questions_json or "questions" not in questions_json["assessment"]:
            return Response({"error": "Invalid GPT JSON structure"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        questions_list = questions_json["assessment"]["questions"]
        if len(questions_list) != test_length:
            return Response({"error": f"Expected {test_length} questions, got {len(questions_list)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Save to DB
        token = uuid.uuid4().hex
        created_at = datetime.now(timezone.utc)

        assessment = RecruiterAssessment.objects.create(
            job_title=job_title,
            recruiter_id=recruiter_id,
            job_description=job_description,
            token=token,
            questions=questions_list,
            created_at=created_at
        )

        # Save interviewee assignments
        # for email in emails:
        #     # Check if interviewee exists
        #     interviewee, created = Interviewee.objects.get_or_create(email=email, defaults={'created_at': created_at})

        #     # Insert assignment with questions
        #     RecruiterAssessmentAssignment.objects.create(
        #         assessment=assessment,
        #         interviewee=interviewee,
        #         recruiter_id=recruiter_id,
        #         email=email,
        #         qa_data=json.dumps(questions_list),
        #         created_at=created_at
        #     )

        frontend_url = os.getenv("FRONTEND_URL", "https://localhost:3000")
        interview_link = f"{frontend_url}/interview/{token}"

        return Response({
            "job_title": job_title,
            "job": job_description,
            "link": interview_link,
            "token": token
        }, status=status.HTTP_200_OK)

    except json.JSONDecodeError:
        return Response({"error": "Failed to parse GPT response as JSON"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def fetch_assessment(request, token):
    try:
        # Validate token format
        try:
            uuid.UUID(str(token))
        except ValueError:
            return JsonResponse({"error": "Invalid token format"}, status=400)

        # Fetch assessment from DB
        assessment_obj = get_object_or_404(RecruiterAssessment, token=token)

        # Extract questions
        questions = assessment_obj.questions  # Assuming questions is stored as JSON

        return JsonResponse({
            "assessment": questions,
            "time_limit_minutes": 20,
            "assessment_id": assessment_obj.assessment_id
        }, status=200)

    except RecruiterAssessment.DoesNotExist:
        return JsonResponse({"error": "Assessment not found"}, status=404)

    except Exception:
        return JsonResponse(
            {"error": "Unexpected error occurred. Please Try Again..."},
            status=500
        )
    

@api_view(['POST'])
def submit_job_assessment(request):
    try:
        data = json.loads(request.body)

        assessment_id = data.get("assessment_id")
        answers = data.get("answers", [])
        token = data.get("token")
        candidate_name=data.get("candidate_name")
        candidate_email=data.get("candidate_email")
        
        test_length = 5

        if not answers:
            return JsonResponse({"error": "No Answers provided for assessment"}, status=400)

        try:
            recruiter_assessment = RecruiterAssessment.objects.get(token=token)
            job_description = recruiter_assessment.job_description
            job_id = recruiter_assessment.job_id
            recruiter_id = recruiter_assessment.recruiter_id
        except RecruiterAssessment.DoesNotExist:
            return JsonResponse({"error": "Assessment not found"}, status=404)

        # Prepare fields for IntervieweeAssessment insertion
        interviewee_data = {
            "job_description": job_description,
            "token": token,
            "candidate_name": candidate_name,
            "candidate_email": candidate_email,
        }
        for i in range(min(test_length, len(answers))):
            interviewee_data[f"question{i+1}"] = answers[i]

        interviewee_obj = IntervieweeAssessment.objects.create(**interviewee_data)

        # Filter out empty answers
        valid_answers = [ans for ans in answers if ans.get("transcript", "").strip()]
        if not valid_answers:
            return JsonResponse({"error": "No valid answers found"}, status=400)

        # Group Questions & Answers
        qa_pairs = []
        for ans in valid_answers:
            transcript = ans.get("transcript", "").strip()
            qa_pairs.append(f"""
                Question: {ans['question']}
                Answer: {transcript}
            """)

        # Create evaluation prompt
        prompt = f"""
        You are a critical evaluator of interviewee answers to evaluate whether the user's experience and qualifications align with the given job description: {job_description}.
        Exactly {test_length} questions are asked from interview and the interview submitted question-answer groups are: {"".join(qa_pairs)}

        Your task:       
        1. **Assess each answer individually** for: accuracy, depth, relevance, and real-world clarity.
        2. **Assign job fit score to interviewee based on his answers alignment with job requirements**
         ---
        
         ### JOb Fit Scoring Rules (Strict):
        
         * **HIGH**: All answers are specific, accurate, deeply aligned with job description requirements, no factual errors or vagueness.
         * **MEDIUM**: Mostly accurate but some generic answers or minor gaps in technical alignment.
         * **LOW**: Mostly answers are vague, generic, reused, misaligned with job requirements, incorrect facts, or irrelevant answers.
        
         ---
        
        **JOB FIT CALCULATION PRIORITY:**
        1. **Mandatory Completion Check:** Count the total number of questions and how many have non-empty answers.
            - If less than 50% are answered → job_fit_score must be "Low", no exceptions.
            - If 50-79% are answered → job_fit_score must be "Medium" or "Low", never "High".
            - IMPORTANT:**If any question is unanswered (even one), job_fit_score cannot be "High".**
            - Only if 100% of questions are answered → then and only then can job_fit_score be "High", provided all answers are correct, specific, and aligned with job requirement.
        2. Apply the above rule **before** evaluating the quality of the provided answers.
        3. IMPORTANT: Never output a score higher than allowed by the completion rate.
        4. IMPORTANT:"High" can only be assigned if **all questions are answered** and **every answer is correct, specific, and aligned with the job requirements**.
        5. IMPORTANT: If the candidate answered more than 50% of the questions with strong, correct, and specific answers, 
           and the remaining unanswered or weak answers are less than 50%, the job_fit_score should be "Medium", 
           not "Low". 
        6. IMPORTANT:"Low" is only assigned when:
           - Less than 50% of questions are answered, OR
           - A majority of the answers are vague, incorrect, or missing.

         ### Output Format (JSON):(return json only, no any additional text or formatting)
        
         ```json
         {{
           "remark": "Provide an overall assessment addressing the candidate directly using 'you' and 'your', explaining their performance across all answered questions, highlighting strengths, weaknesses, any over-claims, vague responses, or mismatches with job requirement.",
           "job_fit_score": "High | Medium | Low"
         }}
         ```
        
         Be tough but fair. If the job requirements are high and candidate gave generic or partially wrong responses, the score must be **LOW**.
         IMPORTANT: If answers are incorrect or irrelavant, deduct job_fit_score.
        """

        # Send to OpenAI
        openai.api_key = os.getenv("OPENAI_API_KEY")
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert technical assessor. Provide accurate, fair evaluations based on the evidence presented. Always return valid JSON in the exact format requested."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ]
            )
        except Exception as e:
            return Response({"error": f"An error occurred while calling OpenAI: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        content = response.choices[0].message.content.strip()

        # Extract JSON
        if "```json" in content:
            json_start = content.find("```json") + 7
            json_end = content.find("```", json_start)
            json_content = content[json_start:json_end].strip()
        else:
            json_start = content.find("{")
            json_end = content.rfind("}") + 1
            json_content = content[json_start:json_end]

        assessment_result = json.loads(json_content)

        # Build result
        result = JobAssessmentResult.objects.create(
            job_id=job_id,
            recruiter_id=recruiter_id,
            assessment_id=assessment_id,
            token=token,
            remarks=assessment_result.get("remark", ""),
            overall_score=assessment_result.get("job_fit_score", ""),
            questions_answered=len(valid_answers),
            total_questions=len(answers),
            answers=answers,
            candidate_name=candidate_name,
            candidate_email=candidate_email,
        )

        response_data = {
            "job_id": result.job_id,
            "recruiter_id": result.recruiter_id,
            "assessment_id": result.assessment_id,
            "remarks": result.remarks,
            "overall_score": result.overall_score,
            "questions_answered": result.questions_answered,
            "total_questions": result.total_questions,
            "answers": result.answers,  
            "candidate_name": result.candidate_name,
            "candidate_email": result.candidate_email,
            "created_at": result.created_at.isoformat()  # Ensure the date is in ISO format
        }



        return JsonResponse({"Result": response_data}, status=200)

    except Exception as e:
        return JsonResponse({"error": f"Unexpected error occurred: {str(e)}"}, status=500)
 


@api_view(['GET'])
def get_job_assessment(request, recruiter_id):
    # Fetch all RecruiterAssessment records based on recruiter_id
    assessments = RecruiterAssessmentAssignment.objects.filter(recruiter_id=recruiter_id)

    if not assessments.exists():
        return Response([], status=200)  # Return an empty list if no records are found

    # Prepare the response data
    response_data = []
    for assessment in assessments:
        interviewee = Interviewee.objects.filter(email=assessment.email).first()  # Get the interviewee for each assessment
        response_data.append({
            "job_id": assessment.job_id,
            "recruiter_id": assessment.recruiter_id,
            "assessment_id": assessment.assessment_id,
            "remarks": assessment.remarks,
            "overall_score": assessment.job_fit_score,
            "answers": assessment.qa_data,
            "candidate_name": interviewee.name if interviewee else None,  # Handle case where interviewee might not exist
            "candidate_email": assessment.email,
            "is_paid": assessment.is_paid,
            "created_at": assessment.created_at.isoformat()
        })

    return Response(response_data, status=200)

@api_view(['GET'])
def get_recruiter_assessment(request, recruiter_id):
    try:
        # Fetch all RecruiterAssessment records based on recruiter_id
        assessments = RecruiterAssessment.objects.filter(recruiter_id=recruiter_id)

        if not assessments.exists():
            return Response([], status=200)  # Return an empty list if no records are found

        # Prepare the response data
        response_data = []
        frontend_url = os.getenv("VANI_URL", "https://localhost:3000")
        for assessment in assessments:
            questions = assessment.questions
            # Check if questions is a string and load it if necessary
            if isinstance(questions, str):
                questions = json.loads(questions)

            response_data.append({
                "job_id": assessment.job_id,
                "job_title": assessment.job_title,
                "recruiter_id": assessment.recruiter_id,
                "job_description": assessment.job_description,
                "questions": questions,  # Use the loaded or original list
                "interview_link": f"{frontend_url}/jobfit/interview/{assessment.token}",
                "created_at": assessment.created_at.isoformat()  # Ensure the date is in ISO format
            })

        return Response(response_data, status=200)  # Return as a list

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def interview_link(request, token):
    try:
        data = request.data
        name = data.get("name")
        email = data.get("email")

        # Validate token format
        try:
            uuid.UUID(str(token))
        except ValueError:
            return JsonResponse({"error": "Invalid token format"}, status=400)

        # Fetch assessment
        assessment = get_object_or_404(RecruiterAssessment, token=token)

        now = timezone.now()

        # Fetch or create interviewee
        interviewee, _ = Interviewee.objects.get_or_create(
            email=email,
            name=name
        )

        # Fetch or create assignment
        assignment, created = RecruiterAssessmentAssignment.objects.get_or_create(
            assessment=assessment,
            email=email,
            defaults={
                "interviewee": interviewee,
                "recruiter_id": assessment.recruiter_id,
                "qa_data": assessment.questions
            },
        )

        # Check expiry
        if assignment.expires_at and timezone.now() > assignment.expires_at:
            return JsonResponse({"error": "Interview Link has expired!"}, status=403)

        # Verify name matches
        if interviewee.name.strip().lower() != name.strip().lower():
            return JsonResponse({"error": "Name does not match our records"}, status=403)

        # Handle verification
        if not assignment.verified:
            code = generate_code()
            expires_at_code = now + timedelta(minutes=10)

            IntervieweeVerificationSession.objects.create(
                assignment=assignment,
                email=email,
                code=code,
                expires_at=expires_at_code,
                is_verified=False,
            )

            # Send verification email
            email_service = EmailService()
            frontend_url = os.getenv("FRONTEND_URL")
            email_service.send_verification_email(name, email, code, frontend_url)

            registration_date = now.strftime("%Y-%m-%d %H:%M:%S")
            email_service.send_registration_alert_interviewee(name, email, registration_date)

            return JsonResponse(
                {
                    "token": str(token),
                    "phase": "start",
                    "message": "A verification code has been sent to your email.",
                },
                status=200,
            )

        # Already verified
        return JsonResponse(
            {"token": str(token), "phase": "resume", "message": "Verification done successfully..."},
            status=200,
        )

    except Exception as e:
        logger.error(f"Error in interview_link: {str(e)}")
        return JsonResponse({"error": "Unexpected error occurred. Please Try Again..."}, status=500)
    

@api_view(['POST'])
def jobfit_interview_link(request, token):
    try:
        data = request.data
        name = data.get("name")
        email = data.get("email")
        language = data.get("language")

        # Validate required fields
        if not all([name, email, language]):
            return JsonResponse({"error": "Name, email, and language are required"}, status=400)

        # Validate token format
        try:
            uuid.UUID(str(token))
        except ValueError:
            return JsonResponse({"error": "Invalid token format"}, status=400)

        # Fetch assessment
        assessment = get_object_or_404(RecruiterAssessment, token=token)
        now = timezone.now()

        # ---- Handle Interviewee ----
        interviewee, _ = Interviewee.objects.get_or_create(email=email)
        if interviewee.name:
            if interviewee.name.strip().lower() != name.strip().lower():
                return JsonResponse({"error": "Name does not match our records"}, status=403)
        else:
            interviewee.name = name
            interviewee.save(update_fields=["name"])

        # ---- Handle Assignment ----
        assignment, created = RecruiterAssessmentAssignment.objects.get_or_create(
            assessment=assessment,
            email=email,
            defaults={
                "language": language,
                "interviewee": interviewee,
                "recruiter_id": assessment.recruiter_id,
                "qa_data": assessment.questions,
            },
        )

        if language and assignment.language != language:
            assignment.language = language
            assignment.save(update_fields=["language"])

        attempted = getattr(assignment, "attempted", False) or False
        restricted = getattr(assignment, "restricted", False) or False
        paused = getattr(assignment, "paused", False) or False

        # ---- Expiry ----
        if assignment.expires_at and now > assignment.expires_at:
            return JsonResponse({"error": "Interview Link has expired!"}, status=403)

        # ---- Verification ----
        if not bool(getattr(assignment, "verified", False)):
            code = generate_code()
            expires_at_code = now + timedelta(minutes=10)

            IntervieweeVerificationSession.objects.create(
                assignment=assignment,
                email=email,
                code=code,
                expires_at=expires_at_code,
                is_verified=False,
            )

            # Send verification email
            try:
                email_service = EmailService()
                frontend_url = os.getenv("FRONTEND_URL", "")
                email_service.send_verification_email(name, email, code, frontend_url)

                registration_date = now.strftime("%Y-%m-%d %H:%M:%S")
                email_service.send_registration_alert_interviewee(name, email, registration_date)
            except Exception as e:
                logger.error(f"Email sending failed: {e}")
                return JsonResponse({"error": "Failed to send verification code. Try Again..."}, status=500)

            return JsonResponse(
                {"token": str(token), "phase": "start", "message": "A verification code has been sent to your email."},
                status=200,
            )

        # ---- Already verified cases ----
        if attempted:
            return JsonResponse({"error": "Interview link has expired..."}, status=403)

        if restricted:
            return JsonResponse(
                {"error": "You have reached the maximum number of resume submissions (2)"},
                status=403,
            )

        if paused:
            if assignment.language and assignment.language.lower() != language.lower():
                return JsonResponse({"error": "Language does not match our records"}, status=403)

            return JsonResponse(
                {"token": str(token), "phase": "resume", "languageCode": language, "message": "Verification done successfully..."},
                status=200,
            )

        if assignment.language and assignment.language.lower() != language.lower():
            return JsonResponse({"error": "Language does not match our records"}, status=403)

        return JsonResponse(
            {"token": str(token), "phase": "continue", "languageCode": language, "message": "Verification done successfully..."},
            status=200,
        )

    except Exception as e:
        logger.error(f"Error in interview_link: {str(e)}")
        return JsonResponse({"error": "Unexpected error occurred. Please Try Again..."}, status=500)




def generate_code(length=6):
    """Generate a random verification code of specified length."""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

@api_view(['POST'])
def verify_email(request, token):
    try:
        # Validate request
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        now = timezone.now()

        # Fetch assessment
        try:
            assessment = RecruiterAssessment.objects.get(token=token)
        except RecruiterAssessment.DoesNotExist:
            return Response({"error": "Invalid Assessment Token!"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch assignment
        try:
            assignment = RecruiterAssessmentAssignment.objects.get(assessment=assessment, email=email)
        except RecruiterAssessmentAssignment.DoesNotExist:
            return Response({"error": "Unauthorized Access!"}, status=status.HTTP_403_FORBIDDEN)

        # Validate code
        session = IntervieweeVerificationSession.objects.filter(
            assignment=assignment,
            email=email,
            code=code,
            expires_at__gt=now,      # ✅ consistent timezone-aware comparison
            is_verified=False
        ).first()

        if not session:
            return Response({"error": "Code is invalid or has expired!"}, status=status.HTTP_403_FORBIDDEN)

        # Mark session verified
        session.is_verified = True
        session.save()

        # Activate assignment for 24 hours
        assignment.started_at = now
        assignment.expires_at = now + timedelta(hours=24)
        assignment.verified = True
        assignment.save()

        return Response(
            {"message": "Verification successful.", "token": str(token), "email": email},
            status=status.HTTP_200_OK
        )

    except Exception as e:
        import traceback
        logger.error(f"Error in verify_email: {str(e)}\n{traceback.format_exc()}")
        return Response({"error": "Unexpected error occurred. Please Try Again..."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def jobfit_verify_email(request, token):
    try:
        # Validate request
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        now = timezone.now()

        # Fetch assessment
        try:
            assessment = RecruiterAssessment.objects.get(token=token)
        except RecruiterAssessment.DoesNotExist:
            return Response({"error": "Invalid Assessment Token!"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch assignment
        try:
            assignment = RecruiterAssessmentAssignment.objects.get(assessment=assessment, email=email)
        except RecruiterAssessmentAssignment.DoesNotExist:
            return Response({"error": "Unauthorized Access!"}, status=status.HTTP_403_FORBIDDEN)

        # Validate code
        session = IntervieweeVerificationSession.objects.filter(
            assignment=assignment,
            email=email,
            code=code,
            expires_at__gt=now,      # ✅ consistent timezone-aware comparison
            is_verified=False
        ).first()

        if not session:
            return Response({"error": "Code is invalid or has expired!"}, status=status.HTTP_403_FORBIDDEN)

        # Mark session verified
        session.is_verified = True
        session.save()

        # Activate assignment for 24 hours
        assignment.started_at = now
        assignment.expires_at = now + timedelta(hours=24)
        assignment.verified = True
        assignment.save()

        return Response(
            {"message": "Verification successful.", "token": str(token), "email": email},
            status=status.HTTP_200_OK
        )

    except Exception as e:
        import traceback
        logger.error(f"Error in verify_email: {str(e)}\n{traceback.format_exc()}")
        return Response({"error": "Unexpected error occurred. Please Try Again..."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['POST'])
def save_initial_voice(request, token):
    serializer = SaveInitialVoiceSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    audio_file = serializer.validated_data['audio_file']
    created_at = timezone.now()

    try:
        assessment = RecruiterAssessment.objects.get(token=token)
    except RecruiterAssessment.DoesNotExist:
        return Response({"error": "Invalid Assessment Token!"}, status=status.HTTP_404_NOT_FOUND)

    try:
        assignment = RecruiterAssessmentAssignment.objects.get(assessment=assessment, email=email)
    except RecruiterAssessmentAssignment.DoesNotExist:
        return Response({"error": "Unauthorized Access!"}, status=status.HTTP_403_FORBIDDEN)

    if assignment.expires_at and timezone.now() > assignment.expires_at:
        return Response({"error": "Interview Link has expired!"}, status=status.HTTP_403_FORBIDDEN)

    # ✅ Encrypt audio before saving
    raw_audio = audio_file.read()
    encrypted_audio = fernet.encrypt(raw_audio)

    assignment.initial_voice = encrypted_audio
    assignment.updated_at = created_at
    assignment.save()

    return Response({
        "message": "Thank you for accepting the terms for Vani's audio interview",
        "assessment_id": assessment.id,
        "assessment": assignment.qa_data if assignment.qa_data else [],
        "token": str(token),
        "email": email,
        "keyword": "start"
    }, status=status.HTTP_200_OK)



@api_view(['POST'])
def saving_resume_voice(request, token):
    serializer = SaveResumeVoiceSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    audio_file = serializer.validated_data['audio_file']

    # Fetch assessment
    try:
        assessment = RecruiterAssessment.objects.get(token=token)
    except RecruiterAssessment.DoesNotExist:
        return Response({"error": "Invalid Assessment Token!"}, status=status.HTTP_404_NOT_FOUND)

    # Fetch assignment
    try:
        assignment = RecruiterAssessmentAssignment.objects.get(assessment=assessment, email=email)
    except RecruiterAssessmentAssignment.DoesNotExist:

    # Check expiry
        return Response({"error": "Unauthorized Access!"}, status=status.HTTP_403_FORBIDDEN)
    if assignment.expires_at and timezone.now() > assignment.expires_at:
        return Response({"error": "Interview Link has expired!"}, status=status.HTTP_403_FORBIDDEN)

    # # Check if initial voice exists
    # if not assignment.initial_voice:
    #     return Response({"error": "Terms and conditions are not recorded by this interviewee"}, status=status.HTTP_400_BAD_REQUEST)

    # # Decrypt initial voice
    # try:
    #     initial_audio = fernet.decrypt(assignment.initial_voice)
    # except Exception:
    #     return Response({"error": "Error decrypting initial voice. Data may be corrupted."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # # Encrypt resume audio
    # resume_audio = audio_file.read()
    # print("resume_audio", resume_audio)
    # encrypted_resume_voice = fernet.encrypt(resume_audio)

    # # Verify voice match
    # similarity_score, voice_match = verify_voice_match(initial_audio, resume_audio)
    # if not voice_match:
    #     return Response({"error": "Voice Verification failed"}, status=status.HTTP_403_FORBIDDEN)

    # # Save
    # if assignment.first_chance:
    #     assignment.resume_voice = encrypted_resume_voice
    #     assignment.updated_at = timezone.now()
    #     assignment.paused = False
    #     assignment.restricted = True
    # else:
    #     assignment.resume_voice = encrypted_resume_voice
    #     assignment.updated_at = timezone.now()
    #     assignment.first_chance = True

    # assignment.save()

    # Read & encrypt audio
    resume_audio = audio_file.read()
    encrypted_resume_voice = fernet.encrypt(resume_audio)

    # Decide first_chance / restricted logic
    if getattr(assignment, "first_chance", False):
        # Update when already used first chance
        assignment.resume_voice = encrypted_resume_voice
        assignment.paused = False
        assignment.restricted = True
    else:
        # First resume
        assignment.resume_voice = encrypted_resume_voice
        assignment.first_chance = True

    assignment.updated_at = datetime.now(timezone.utc)
    assignment.save()

    return Response({
        "message": "Voice saved and verified successfully...",
        "assessment_id": assessment.id,
        "assessment": assignment.qa_data,
        "token": str(token),
        "email": email,
        "keyword": "resume"
    }, status=status.HTTP_200_OK)


def verify_voice_match(initial_audio: bytes, resume_audio: bytes, threshold: float = 0.75) -> Tuple[float, bool]:
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f1, \
         tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f2:
        
        f1.write(initial_audio)
        f1.flush()
        f2.write(resume_audio)
        f2.flush()

        try:
            initial_path = Path(f1.name).as_posix()
            resume_path = Path(f2.name).as_posix()

            # Assuming `verifier` is defined and has a method `verify_files`
            similarity_score, _ = verifier.verify_files(initial_path, resume_path)
            similarity_score = float(similarity_score.item())
        except Exception as e:
            return None, False  # Return None for score and False for match if an error occurs

    return similarity_score, similarity_score >= threshold

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def save_answer(request, token, question_id):
    try:
        email = request.data.get("email")
        audio_file = request.data.get("audio_file")
        answer = request.data.get("answer")

        if not answer or not audio_file:
            return Response({"error": "Answer is required!"}, status=status.HTTP_400_BAD_REQUEST)

        # Parse answer JSON
        try:
            data = json.loads(answer)
        except json.JSONDecodeError:
            return Response({"error": "Invalid Answer format"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch Assessment
        assessment = RecruiterAssessment.objects.filter(token=str(token)).first()
        if not assessment:
            return Response(
                {"error": "Invalid Assessment Token Or Unauthorized User!"},
                status=status.HTTP_404_NOT_FOUND,
            )

        assignment = RecruiterAssessmentAssignment.objects.get(assessment=assessment, email=email)

        # Check expiry
        if assignment.expires_at and datetime.now(timezone.utc) > assignment.expires_at:
            return Response({"error": "Interview Link has expired!"}, status=status.HTTP_403_FORBIDDEN)

        # Encrypt audio
        encrypted_audio = fernet.encrypt(audio_file.read())

        # Update QA Data
        qa_data = assignment.qa_data or []
        updated = False
        for q in qa_data:
            if str(q.get("id")) == str(question_id) and q.get("question") == data.get("question"):
                q["answer"] = data.get("transcript")
                q["answer_original"] = data.get("transcript_original")
                q["question_translated"] = data.get("question_translated")
                # store encrypted audio inline (optional)
                q["encrypted_audio"] = encrypted_audio.decode("utf-8")
                updated = True
                break

        if not updated:
            return Response({"error": "Question not found in Database!"}, status=status.HTTP_404_NOT_FOUND)

        # Save QA Data back
        assignment.qa_data = qa_data
        assignment.updated_at = datetime.now(timezone.utc)
        assignment.save()

        # Save Recruiter Question Record
        question_record = RecruiterAssessmentAssignmentQuestions.objects.create(
            assessment=assessment,
            email=email,
            interviewee_id=assignment.interviewee_id,
            recruiter_id=assignment.recruiter_id,
            assignment=assignment,
            question_no=str(question_id),
            question=data.get("question"),
            question_translated=data.get("question_translated"),
            audio_file_path=f"s3://{S3_BUCKET}/{data.get('s3_key')}",
            audio_filename=data.get("audio_filename"),
            transcript_original=data.get("transcript_original"),
            transcript_en=data.get("transcript"),
            processing_state="pending",
            created_at=now()
        )

        # Enqueue async task (Celery / RQ etc.)
        # process_response_audio.delay(
        #     response_id=question_record.id,
        #     s3_key=data.get("s3_key"),
        #     key="skills",
        #     tts_end_ts_ms=data.get("tts_end_ts_ms"),
        #     recording_start_ts_ms=data.get("recording_start_ts_ms"),
        #     recording_stop_ts_ms=data.get("recording_stop_ts_ms"),
        #     transcript_en=data.get("transcript"),
        # )

        return Response(
            {
                "message": "Answer saved successfully...",
                "token": str(token),
                "email": email,
                "question_id": question_record.id,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {"error": "Unexpected error occurred. Please Try Again..."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    


@api_view(['POST'])
def save_translated_questions(request, token: str):
    try:
        email = request.data.get("email")
        questions = request.data.get("questions")

        if not questions:
            return Response(
                {"error": "Translating Question to your language failed! \nTry Again!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Handle both str (FormData) and list (JSON)
        if isinstance(questions, str):
            try:
                data = json.loads(questions)
            except json.JSONDecodeError:
                return Response({"error": "Invalid Questions format"}, status=status.HTTP_400_BAD_REQUEST)
        elif isinstance(questions, list):
            data = questions
        else:
            return Response({"error": "Invalid Questions format"}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure list of dicts
        if not isinstance(data, list) or not all(isinstance(q, dict) for q in data):
            return Response({"error": "Questions must be a list of objects"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch assessment
        try:
            assessment = RecruiterAssessment.objects.get(token=token)
        except RecruiterAssessment.DoesNotExist:
            return Response({"error": "Invalid Assessment Token!"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch assignment
        try:
            assignment = RecruiterAssessmentAssignment.objects.get(
                assessment=assessment,
                email=email
            )
        except RecruiterAssessmentAssignment.DoesNotExist:
            return Response({"error": "Unauthorized Access!"}, status=status.HTTP_403_FORBIDDEN)

        if not assignment.verified:
            return Response({"error": "Verification needed!"}, status=status.HTTP_403_FORBIDDEN)

        # Ensure qa_data is a list
        if isinstance(assignment.qa_data, str):
            try:
                qa_data = json.loads(assignment.qa_data)
            except json.JSONDecodeError:
                qa_data = []
        else:
            qa_data = assignment.qa_data or []

        if not isinstance(qa_data, list):
            qa_data = []

        updated = False
        extra_data = {}
        for item in data:
            qid = item.get("id")
            qtext = item.get("question")
            if qid is not None and qtext:
                extra_data[(qid, qtext)] = item

        for item in qa_data:
            key = (item.get("id"), item.get("question"))
            if key in extra_data:
                item.update(extra_data[key])
                updated = True

        if not updated:
            return Response({"error": "No matching questions found in qa_data"}, status=status.HTTP_404_NOT_FOUND)

        assignment.qa_data = qa_data
        assignment.updated_at = timezone.now()
        assignment.save(update_fields=["qa_data", "updated_at"])

        return Response({"message": "Saved Successfully...."}, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error in save_translated_questions: {str(e)} | data={request.data}")
        return Response(
            {"error": f"Unexpected error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(['POST'])
def submit_paper(request, token):
    try:
        data = request.data
        email = data.get("email")
        skills = data.get("skills",[])
        created_at = datetime.now(timezone.utc)
        test_length = 5

        # Fetch assessment
        try:
            assessment = RecruiterAssessment.objects.get(token=token)
        except RecruiterAssessment.DoesNotExist:
            return Response({"error": "Invalid Assessment Token!"}, status=status.HTTP_404_NOT_FOUND)

        job_description = assessment.job_description

        # Fetch assignment
        try:
            assignment = RecruiterAssessmentAssignment.objects.get(
                assessment=assessment, email=email
            )
        except RecruiterAssessmentAssignment.DoesNotExist:
            return Response({"error": "Unauthorized Access!"}, status=status.HTTP_403_FORBIDDEN)

        # Check expiry
        if assignment.expires_at and datetime.now(timezone.utc) > assignment.expires_at:
            return Response({"error": "Interview Link has expired!"}, status=status.HTTP_403_FORBIDDEN)

        # Unverified user
        if not assignment.verified:
            return Response({"error": "Verification needed!"}, status=status.HTTP_403_FORBIDDEN)

        # Already submitted
        if assignment.attempted:
            return Response({"error": "You have already submitted your answers"}, status=status.HTTP_403_FORBIDDEN)

        # Extract answers
        qa_data = assignment.qa_data or []
        questions = [item.get("question") for item in qa_data]
        valid_answers = [item for item in qa_data if item.get("answer", "").strip()]

        if not valid_answers:
            return Response({"error": "No valid answers found..."}, status=status.HTTP_400_BAD_REQUEST)

        # Filter for prompt
        filtered = []
        for r in qa_data:
            filtered.append({
                "id": r.get("id"),
                "question": r.get("question"),
                "answer": r.get("answer"),
            })

        # Build prompt and get AI evaluation
        prompt = VaniEngine.build_prompt(
            "jobfit",
            "evaluate_answers",
            {
                "test_length": test_length,
                "job_description": job_description,
                "len(valid_answers)": len(valid_answers),
                "qa_data": filtered,
            },
        )
        assessment_result = VaniEngine.ask_ai_answers(5, prompt)

        # Update assignment
        assignment.remarks = assessment_result.get("remark", "")
        assignment.job_fit_score = assessment_result.get("job_fit_score", "")
        assignment.attempted = True
        assignment.first_chance = True
        assignment.paused = False
        assignment.job_id = assessment.job_id
        assignment.updated_at = datetime.now(timezone.utc)
        assignment.save()

        # Check wallet credits
        try:
            wallet = Wallet.objects.filter(individual_profile_id=assignment.recruiter_id).first()
            if wallet and wallet.credits >= 1:
                assignment.is_paid = True
                assignment.save(update_fields=["is_paid"])
                wallet.balance -= 1 * Wallet.CREDIT_RATE  # deduct balance
                wallet.credits -= 1  # deduct credits
                wallet.save()
        except Exception as e:
            print(f"Wallet check/update failed: {e}")

        if skills: 
            user = Interviewee.objects.get(
                email=assignment.email
            )

            jobprofile = JobProfiles.objects.get(
                individual_profile_id=assessment.recruiter_id,
                job_title=assessment.job_title
            ) 

            CandidateProfile.objects.create(
                name=user.name,
                email=email,
                job_id=jobprofile.individual_job_id,
                job_name=assessment.job_title,
                candidate_skills=skills,
                assessment_score=assignment.job_fit_score,
            )

        # Build result
        result = {
            "assessment_id": assessment.id,
            "remarks": assignment.remarks,
            "overall_score": assignment.job_fit_score,
            "questions_answered": len(valid_answers),
            "total_questions": len(questions),
            "data": qa_data,
            "language": assignment.language,
            "is_paid": assignment.is_paid,
        }

        return Response({"Result": result}, status=status.HTTP_200_OK)

    except Exception as e:
        print("Unexpected error in submit_paper:", str(e))
        return Response(
            {"error": "Unexpected error occurred. Please Try Again..."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(['POST'])
def pause_paper(request, token):
    try:
        serializer = PausePaperSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']

        # Fetching assessment_id
        assessment = RecruiterAssessment.objects.filter(token=token).first()
        if not assessment:
            return Response({"error": "Invalid Assessment Token!"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch assignment_id
        assignment = RecruiterAssessmentAssignment.objects.filter(assessment=assessment, email=email).first()
        if not assignment:
            return Response({"error": "Unauthorized Access!"}, status=status.HTTP_403_FORBIDDEN)

        # Update the assignment to set paused status
        assignment.paused = True
        assignment.paused_at = timezone.now()
        assignment.updated_at = timezone.now()
        assignment.save(update_fields=["paused", "paused_at", "updated_at"])

        return Response({"message": "You can continue from where you left within the next 24 hours."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": "Unexpected error occurred. Please Try Again..."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(["POST"])
def skills_generate_assessment(request):
    try:
        # Request data
        data = request.data
        selected_skills = data.get("skills", [])
        profile_data = data.get("profileData", {})
        test_length = data.get("testLength")

        # Transform skills into readable text
        transformed_skills = [
            {
                "name": skill.get("skill_name"),
                "proficiency": skill.get("rating"),
                "category": skill.get("tag_name"),
            }
            for skill in selected_skills
        ]
        skills_text = "\n".join(
            [
                f"- {s['name']} (Self-rated proficiency: {s['proficiency']}/4, Category: {s['category']})"
                for s in transformed_skills
            ]
        )

        # AI question generation (mock locally when OPENAI_API_KEY is not set)
        use_mock = os.getenv("USE_MOCK_ASSESSMENT", "").lower() in ("1", "true", "yes")
        if not os.getenv("OPENAI_API_KEY"):
            use_mock = True

        if use_mock:
            count = int(test_length or 5)
            questions = [
                {
                    "id": i + 1,
                    "question": (
                        f"Describe a real project where you applied "
                        f"{transformed_skills[i % len(transformed_skills)]['name']} "
                        f"({transformed_skills[i % len(transformed_skills)]['category']}). "
                        f"What was your role and outcome?"
                    ),
                }
                for i in range(count)
            ]
        else:
            prompt = VaniEngine.build_prompt(
                "skills", "generate_questions",
                {"test_length": test_length, "skills_text": skills_text}
            )
            questions = VaniEngine.ask_ai_questions(int(test_length or 5), prompt)

        # Generate token
        assessment_token = generate_token()

        # ✅ Check if user exists
        user = None
        # if profile_data.get("individual_profile_id"):
        #     user = User.objects.filter(individual_profile_id=profile_data.get("individual_profile_id")).first()
        # elif profile_data.get("recruiter_id"):
        #     user = User.objects.filter(individual_profile_id=profile_data.get("recruiter_id")).first()


        if profile_data.get("email"):
            user = User.objects.filter(email=profile_data.get("email")).first()

        if not user:
            return Response(
                {"error": "User not found. Please create a profile first."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # ✅ Pick profile data safely (optional fields allowed)
        individual_profile_id = profile_data.get("individual_profile_id") or None
        recruiter_id = profile_data.get("recruiter_id") or None
        job_id = profile_data.get("job_id") or None
        job_title = profile_data.get("job_title") or None
        email = profile_data.get("email") or None
        name = profile_data.get("name") or None
        

        # ✅ Create assessment record
        IndividualAssessment.objects.create(
            individual_profile_id=individual_profile_id,
            recruiter_id=recruiter_id,
            job_id=job_id,
            job_title=job_title,
            name=name,
            email=email,
            token=assessment_token,
            qa_data=questions,
            skills=selected_skills,
        )

        # Build interview link (VANI_URL = Vite app, e.g. http://localhost:5174)
        frontend_url = os.getenv("VANI_URL", os.getenv("FRONTEND_URL", "http://localhost:5174")).rstrip("/")
        interview_link = f"{frontend_url}/skills/interview/{assessment_token}"

        return Response(
            {
                "success": True,
                "message": "Interview Generated Successfully...",
                "link": interview_link,
                "token": assessment_token,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )





@api_view(["POST"])
def skills_interview_link(request, token: str):
    try:
        data = request.data
        name = data.get("name")
        email = data.get("email")
        language = data.get("language")

        # ✅ Find assessment by token (priority: individual_profile_id → job_id)
        assessment = None
        # if data.get("individual_profile_id"):
        assessment = IndividualAssessment.objects.filter(
            token=str(token),
            # individual_profile_id=data.get("individual_profile_id"),
            name=name,
            email=email
        ).first()
        # elif data.get("job_id"):
        #     assessment = IndividualAssessment.objects.filter(
        #         token=str(token),
        #         job_id=data.get("job_id"),
        #         job_title=data.get("job_title"),
        #         recruiter_id=data.get("recruiter_id")
        #     ).first()

        if not assessment:
            return Response(
                {"error": "Invalid Assessment Token Or Unauthorized User!"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # ✅ Expiry check
        if assessment.expires_at and timezone.now() > assessment.expires_at:
            return Response(
                {"error": "Interview Link has expired!"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # ✅ Attempted check
        if assessment.attempted:
            return Response(
                {"error": "Interview link has expired..."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # ✅ Restricted check
        if assessment.restricted:
            return Response(
                {"error": "You have reached the maximum number of resume submissions (2)"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # ✅ Paused check (resume flow)
        if assessment.paused:
            if assessment.language and assessment.language.strip().lower() != language.strip().lower():
                return Response(
                    {"error": "Language does not match our records"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            return Response(
                {
                    "token": str(token),
                    "phase": "resume",
                    "languageCode": language,
                    "message": "Verification done successfully...",
                },
                status=status.HTTP_200_OK,
            )

        # ✅ First-time verification (continue flow)
        assessment.language = language
        assessment.name=name
        assessment.email=email
        assessment.save(update_fields=["name","email","language", "updated_at"])

        return Response(
            {
                "token": str(token),
                "phase": "continue",
                "languageCode": language,
                "message": "Verification done successfully...",
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {
                "error": "Unexpected error occurred. Please try again...",
                "details": str(e),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )





@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def skills_saving_initial_voice(request, token: str):
    try:
        email = request.data.get("email")
        audio_file = request.FILES.get("audio_file")

        if not email or not audio_file:
            return Response(
                {"error": "Email and audio file are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Read and encrypt audio
        initial_audio = audio_file.read()
        encrypted_initial_voice = fernet.encrypt(initial_audio)

        # Fetch assessment
        try:
            assessment = IndividualAssessment.objects.get(
                token=str(token)
                # email=email
            )
        except IndividualAssessment.DoesNotExist:
            return Response(
                {"error": "Invalid Assessment Token Or Unauthorized User!"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check expiry
        if assessment.expires_at and timezone.now() > assessment.expires_at:
            return Response(
                {"error": "Interview Link has expired!"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Save encrypted audio in a new field (you should add this to model)
        assessment.initial_voice = encrypted_initial_voice
        assessment.updated_at = timezone.now()
        assessment.save()

        data = {
            "message": "Thank You for accepting the terms for Vanis terms for audio interview",
            "assessment": assessment.qa_data,
            "assessment_id": assessment.assessment_id,
            "token": str(token),
            "email": email,
            "languageCode": assessment.language,
            "keyword": "start"
        }

        return Response(data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": "Unexpected error occurred. Please Try Again..."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def skills_resume_voice(request, token: str):
    try:
        email = request.data.get("email")
        audio_file = request.FILES.get("audio_file")

        if not email or not audio_file:
            return Response(
                {"error": "Email and audio file are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch assessment
        assessment = IndividualAssessment.objects.filter(
            token=str(token)
            # email=email
        ).first()

        if not assessment:
            return Response(
                {"error": "Invalid Assessment Token Or Unauthorized User!"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check expiry
        if assessment.expires_at and datetime.now(timezone.utc) > assessment.expires_at:
            return Response(
                {"error": "Interview Link has expired!"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Read & encrypt audio
        resume_audio = audio_file.read()
        encrypted_resume_voice = fernet.encrypt(resume_audio)

        # Decide first_chance / restricted logic
        if getattr(assessment, "first_chance", False):
            # Update when already used first chance
            assessment.resume_voice = encrypted_resume_voice
            assessment.paused = False
            assessment.restricted = True
        else:
            # First resume
            assessment.resume_voice = encrypted_resume_voice
            assessment.first_chance = True

        assessment.updated_at = datetime.now(timezone.utc)
        assessment.save()

        data = {
            "message": "Resuming… getting everything ready.",
            "assessment": assessment.qa_data,
            "assessment_id": assessment.assessment_id,
            "token": str(token),
            "email": email,
            "languageCode": assessment.language,
            "keyword": "resume"
        }

        return Response(data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": "Unexpected error occurred. Please Try Again..."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def skills_save_answer(request, token, question_id):
    try:
        email = request.data.get("email")
        audio_file = request.data.get("audio_file")
        answer = request.data.get("answer")

        if not answer or not audio_file:
            return Response({"error": "Answer is required!"}, status=status.HTTP_400_BAD_REQUEST)

        # Parse answer JSON
        try:
            data = json.loads(answer)
        except json.JSONDecodeError:
            return Response({"error": "Invalid Answer format"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch Assessment
        assessment = IndividualAssessment.objects.filter(token=str(token)).first()
        if not assessment:
            return Response(
                {"error": "Invalid Assessment Token Or Unauthorized User!"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Check expiry
        if assessment.expires_at and datetime.now(timezone.utc) > assessment.expires_at:
            return Response({"error": "Interview Link has expired!"}, status=status.HTTP_403_FORBIDDEN)

        # Encrypt audio
        encrypted_audio = fernet.encrypt(audio_file.read())

        # Update QA Data
        qa_data = assessment.qa_data or []
        updated = False
        for q in qa_data:
            if str(q.get("id")) == str(question_id) and q.get("question") == data.get("question"):
                q["answer"] = data.get("transcript")
                q["answer_original"] = data.get("transcript_original")
                q["question_translated"] = data.get("question_translated")
                # store encrypted audio inline (optional)
                q["encrypted_audio"] = encrypted_audio.decode("utf-8")
                updated = True
                break

        if not updated:
            return Response({"error": "Question not found in Database!"}, status=status.HTTP_404_NOT_FOUND)

        # Save QA Data back
        assessment.qa_data = qa_data
        assessment.updated_at = datetime.now(timezone.utc)
        assessment.save()

        # Save Recruiter Question Record
        question_record = RecruiterAssessmentAssignmentQuestion.objects.create(
            assessment=assessment,
            email=email,
            question_no=str(question_id),
            question=data.get("question"),
            question_translated=data.get("question_translated"),
            audio_file_path=f"s3://{S3_BUCKET}/{data.get('s3_key')}",
            audio_filename=data.get("audio_filename"),
            transcript_original=data.get("transcript_original"),
            transcript_en=data.get("transcript"),
            processing_state="pending",
        )

        # Enqueue async task (Celery / RQ etc.)
        # process_response_audio.delay(
        #     response_id=question_record.id,
        #     s3_key=data.get("s3_key"),
        #     key="skills",
        #     tts_end_ts_ms=data.get("tts_end_ts_ms"),
        #     recording_start_ts_ms=data.get("recording_start_ts_ms"),
        #     recording_stop_ts_ms=data.get("recording_stop_ts_ms"),
        #     transcript_en=data.get("transcript"),
        # )

        return Response(
            {
                "message": "Answer saved successfully...",
                "token": str(token),
                "email": email,
                "question_id": question_record.id,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {"error": "Unexpected error occurred. Please Try Again..."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def skills_save_translated_questions(request, token):
    try:
        email = request.POST.get("email")
        questions = request.POST.get("questions")

        if not questions:
            return JsonResponse(
                {"error": "Translating Question to your language failed! Try Again!"},
                status=400,
            )

        # Parse JSON safely
        try:
            data = json.loads(questions)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid Questions format"}, status=400)

        try:
            assessment = IndividualAssessment.objects.get(token=token)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"error": "Invalid Assessment Token Or Unauthorized User!"}, status=404
            )

        qa_data = assessment.qa_data or []
        updated = False

        # Create lookup for new translated questions
        extra_data = {(item["id"], item["question"]): item for item in data}

        # Merge translated data into qa_data
        for item in qa_data:
            key = (item.get("id"), item.get("question"))
            if key in extra_data:
                item.update(extra_data[key])
                updated = True

        if not updated:
            return JsonResponse(
                {"error": "Some error occurred! Try Again!"}, status=404
            )

        # Save updated qa_data
        assessment.qa_data = qa_data
        assessment.updated_at = timezone.now()
        assessment.save(update_fields=["qa_data", "updated_at"])

        return JsonResponse({"message": "Saved Successfully...."}, status=200)

    except Exception as e:
        return JsonResponse(
            {"error": f"Unexpected error occurred: {str(e)}"}, status=500
        )
    
@api_view(["POST"])
def skills_submit_paper(request, token):
    try:
        email = request.data.get("email")
        if not email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch assessment using ORM
        assessment = get_object_or_404(
            IndividualAssessment,
            token=str(token)
            # ,
            # email=email
        )

        # Check expiry
        if assessment.expires_at and timezone.now() > assessment.expires_at:
            return Response(
                {"error": "Interview Link has expired!"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Already submitted?
        if assessment.attempted:
            return Response(
                {"error": "You have already submitted your answers"},
                status=status.HTTP_403_FORBIDDEN
            )

        qa_data = assessment.qa_data or []
        skills = assessment.skills or []
        test_length = 5

        # Filter answers
        questions = [item.get("question") for item in qa_data]
        valid_answers = [item for item in qa_data if item.get("answer", "").strip()]

        if not valid_answers:
            return Response(
                {"error": "No valid answers found..."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prepare filtered QA
        filtered = [
            {"id": r.get("id"), "question": r.get("question"), "answer": r.get("answer")}
            for r in qa_data
        ]

        # Skills context
        rating_map = {1: "Beginner", 2: "Intermediate", 3: "Advanced", 4: "Expert"}
        skills_context = [
            f"- {s['skill_name']} ({s['tag_name']}): Self-rated as {s['rating']}/4 ({rating_map.get(s['rating'], 'Unknown')})"
            for s in skills
        ]

        # AI evaluation
        prompt = VaniEngine.build_prompt(
            "skills",
            "evaluate_answers",
            {
                "len(valid_answers)": len(valid_answers),
                "test_length": test_length,
                "skills_context": skills_context,
                "qa_data": filtered,
            },
        )
        assessment_result = VaniEngine.ask_ai_answers(5, prompt)





        # Update ORM object
        assessment.remarks = assessment_result.get("remark", "")
        assessment.credibility_score = assessment_result.get("credibility_score", "")
        assessment.paused = False
        assessment.attempted = True
        assessment.first_chance = True
        assessment.updated_at = timezone.now()
        assessment.save(update_fields=["remarks", "credibility_score", "paused", "attempted", "first_chance", "updated_at"])

        if assessment.job_id:  # only run if job_id is not empty / not None
            candidate = CandidateProfile.objects.filter(
                job_id=assessment.job_id,
                email=assessment.email
            ).first()

            if not candidate:
                return Response(
                    {"error": "Invalid Job id and email"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            candidate.assessment_score = assessment_result.get("credibility_score", "")
            candidate.save(update_fields=["assessment_score"])
                
        

        # Prepare response
        result = {
            "assessment_id": assessment.assessment_id,
            "remarks": assessment_result.get("remark", ""),
            "overall_score": assessment_result.get("credibility_score", ""),
            "questions_answered": len(valid_answers),
            "total_questions": len(questions),
            "data": qa_data,
            "language": assessment.language,
        }

        return Response({"Result": result}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"Unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(["POST"])
def skills_pause_assessment(request, token):
    """
    Pause an assessment (Django ORM version of pause API).
    """
    try:
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch assessment by token + email
        try:
            assessment = IndividualAssessment.objects.get(token=token)
        except IndividualAssessment.DoesNotExist:
            return Response(
                {"error": "Invalid Assessment Token Or Unauthorized User!"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update pause fields
        assessment.paused = True
        assessment.paused_at = timezone.now()
        assessment.updated_at = timezone.now()
        assessment.save(update_fields=["paused", "paused_at", "updated_at"])

        return Response(
            {"message": "You can continue from where you left within the next 24 hours."},
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {"error": f"Unexpected error occurred. Please Try Again... ({str(e)})"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

import io
import json
import boto3
from uuid import uuid4
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Import your service functions (optional for local dev without Google Cloud)
try:
    from .services.google_translate import translate_text
    from .services.google_tts import synthesize_speech, list_voices
except ImportError:
    def translate_text(text, target_lang="en"):
        return text

    def synthesize_speech(*args, **kwargs):
        raise NotImplementedError("Google TTS not available in local dev")

    def list_voices(*args, **kwargs):
        return []

creds = os.getenv("GOOGLE_APPLICATION_CREDENTIALS") 
if creds:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds


# Setup AWS S3
s3 = boto3.client("s3", region_name=os.getenv("AWS_REGION"))
S3_BUCKET = os.getenv("S3_BUCKET_NAME")


@api_view(["GET"])
def home(request):
    return Response({"message": "OpenAI Backend is running"})


@api_view(["GET"])
def get_voices(request):
    language_code = request.query_params.get("language_code")
    voices = list_voices(language_code)
    return Response({"voices": voices})

from django.http import HttpResponse


@api_view(["POST"])
def tts(request):
    try:
        text = request.data.get("text")
        language_code = request.data.get("language_code", "en-US")
        voice_name = request.data.get("voice_name")
        ssml_gender = request.data.get("ssml_gender", "NEUTRAL")

        if not text:
            return Response({"error": "Text is required"}, status=status.HTTP_400_BAD_REQUEST)

        print("➡️ Calling synthesize_speech...")

        audio_content = synthesize_speech(text, language_code, voice_name, ssml_gender)

        print("✅ Got audio:", type(audio_content), len(audio_content))

        # Use HttpResponse for binary content
        response = HttpResponse(audio_content, content_type="audio/mpeg")
        response["Content-Disposition"] = 'attachment; filename="output.mp3"'
        return response

    # except Exception as e:
    #     return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        print("❌ FULL ERROR:")
        traceback.print_exc()   # 👈 THIS is key
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
def translate(request):
    try:
        text = request.data.get("text")
        language = request.data.get("target_language")

        if not text or not language:
            return Response(
                {"error": "Both 'text' and 'target_language' are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = translate_text(text, language)
        return Response({"Result": result}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": "Error translating", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from uuid import uuid4
import boto3, os

S3_BUCKET = os.getenv("S3_BUCKET_NAME")

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION", "ap-south-1"),
)

@api_view(["POST"])
def presign_upload(request):
    try:
        question_id = request.data.get("question_id")
        if not question_id:
            return Response(
                {"error": "Error Uploading Audio..."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        key = f"question_{question_id}/{uuid4().hex}.wav"

        url = s3.generate_presigned_url(
            "put_object",
            Params={"Bucket": S3_BUCKET, "Key": key, "ContentType": "audio/wav"},
            ExpiresIn=60,
        )

        return Response({"url": url, "key": key, "expires_in": 60})

    except Exception as e:
        return Response(
            {"error": "Unexpected error occurred. Please Try Again...", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )



