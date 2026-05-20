from rest_framework import serializers
from .models import ReviewProfileUser

from django.conf import settings
from django.utils.html import strip_tags

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from email.mime.image import MIMEImage
import os
from .models import User, UserAssessment, Discipline, LevelOfEducation, JobProfiles, JobProfile
#import base64


#with open("static/img/logo.png", "rb") as image_file:
 #   base64_string = base64.b64encode(image_file.read()).decode('utf-8')

#print("image: ",base64_string)

def send_feedback_request_email(
    feedback_giver_email,
    feedback_request_subject,
    feedback_giver_name,
    feedback_link,
    feedback_seeker_name,
):
    subject = feedback_request_subject
    # message = render_to_string(
    #     "email/feedback_request.html",
    #     {
    #         "feedback_request_subject": feedback_request_subject,
    #         "feedback_giver_name": feedback_giver_name,
    #         "feedback_link": feedback_link,
    #         "feedback_seeker_name": feedback_seeker_name,
    #     },
    # )
    # send_mail(
    #     subject=subject,
    #     message=strip_tags(message),
    #     from_email=settings.EMAIL_HOST_USER,
    #     recipient_list=[feedback_giver_email],
    #     html_message=message,
    # )
    
    html_content = f'''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Feedback Request</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }}
            .container {{
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                text-align: center;
                margin-bottom: 20px;
            }}
            .header img {{
                max-width: 200px;
                height: auto;
                margin-top: 20px;
                width: 50px;
            }}
            h1, p {{
                margin: 0;
                padding: 0;
            }}
            p {{
                margin-bottom: 10px;
                line-height: 1.6;
            }}
            .buttonContainer{{
                width: 100%;
                display: flex;
                justify-content: center;
                margin: 30px 0px;
            }}
            .button {{
                display: inline-block;
                background-color: transparent;
                color: #1d4ed8;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                transition: background-color 0.3s;
                font-weight: bold;
                border: 1px solid #3b82f6;
            }}
            .button:hover {{
                background-color: #0056b3;
                color: #fff;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <img src="cid:logo_image" alt="Company Logo">
        </div>
        <div class="container">
            <p>Sub: {feedback_request_subject}</p>
            <p>Hi {feedback_giver_name},</p>
            <p>I am interested in having your feedback on my skills for my personal improvement and development. In this link being sent through IYS, please go to my skills profile and against each skill give me what you think is my appropriate proficiency in the skill. A comment on the skill is also highly welcome. Btw, I do know your time is valuable.</p>
            <p>I can assure you that the process will not take more than five minutes.</p>
            <div class="buttonContainer">
                <a class="button" href="{feedback_link}">Link to provide feedback</a>
            </div>
            <p>Your feedback is ANONYMOUS. I will NOT KNOW what ratings you gave. So you can be truthful in your feedback 🙂 After all, it is for my development.</p>
            <p>Thank you very much for your feedback.</p>
            <p>Regards,</p>
            <p>{feedback_seeker_name}</p>
        </div>
    </body>
    </html>
    '''
    msg = EmailMultiAlternatives(
        subject=subject,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[feedback_giver_email])
    msg.attach_alternative(html_content, "text/html")

    image_path = os.path.join(settings.BASE_DIR, 'static/img/logo-icon.png')
    with open(image_path, 'rb') as img:
        msg_image = MIMEImage(img.read())
        msg_image.add_header('Content-ID', '<logo_image>')
        msg.attach(msg_image)

    msg.send()



# create serializer for  creating ReviewProfileUser
class CreateReviewProfileUserSerializer(serializers.ModelSerializer):
    profile = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ReviewProfileUser
        fields = ("name", "email", "user_type", "profile")

    def create(self, validated_data):
        try:
            review_user = ReviewProfileUser.objects.create(**validated_data)
            print("Dfg", review_user.profile)

            send_email_obj = send_feedback_request_email(
                feedback_giver_email=review_user.email,
                feedback_request_subject="Feedback Request",
                feedback_giver_name=review_user.name,
                feedback_link=review_user.genrate_review_profile_link(),
                feedback_seeker_name=review_user.profile.user.get_full_name(),
            )
            print("send_email_obj", send_email_obj)
        except Exception as e:
            raise serializers.ValidationError(e)

        return review_user
    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email']

class UserAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAssessment
        fields = ['id', 'user', 'questions', 'completed']


# Compare this snippet from users/models.py:

class DisciplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discipline
        fields = ['id', 'category', 'sub_category']

class LevelOfEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelOfEducation
        fields = ['id', 'name']

class JobProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobProfile
        fields = ['user_id', 'user_name', 'job_title', 'user_email', 'userRatedSkills']


class JobProfilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobProfiles
        fields = ['user_id','individual_profile_id', 'user_name', 'job_title', 'user_email', 'userRatedSkills', 'created_at', 'background_details', 'short_listed', 'individual_job_id']

from rest_framework import serializers
from .models import CandidateProfile

class CandidateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = ['name', 'email', 'job_id', 'job_name', 'candidate_skills','assessment_score', 'created_at', 'updated_at']

class SkillSerializer(serializers.Serializer):
    skill_name = serializers.CharField()
    rating = serializers.IntegerField()
    tag_name = serializers.CharField()

    class Meta:
        fields = ['skill_name', 'rating', 'tag_name']

class ProfileDataSerializer(serializers.Serializer):
    individual_profile_id = serializers.CharField()

    class Meta:
        fields = ['individual_profile_id']

class GenerateAssessmentSerializer(serializers.Serializer):
    skills = serializers.ListField(child=serializers.DictField())
    profileData = serializers.DictField()
    testLength = serializers.IntegerField()
    timeLimit = serializers.IntegerField()

    class Meta:
        fields = ['skills', 'profileData', 'testLength', 'timeLimit']


class AssessmentAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    transcript = serializers.CharField()
    question = serializers.CharField()
    skill_assessed = serializers.CharField(required=False)
    category = serializers.CharField(required=False)

    class Meta:
        fields = ['question_id', 'transcript', 'question', 'skill_assessed', 'category']

class SubmitAssessmentSerializer(serializers.Serializer):
    assessment_id = serializers.IntegerField()
    individual_profile_id = serializers.CharField()
    skills = serializers.ListField(child=serializers.DictField())
    answers = AssessmentAnswerSerializer(many=True)

    class Meta:
        fields = ['assessment_id', 'indvidual_profile_id', 'skills', 'answers']

from rest_framework import serializers
from .models import AssessmentResult

class AssessmentResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentResult
        fields = ['individual_profile_id', 'assessment_id', 'remarks', 'overall_score', 'skills_assessed', 'questions_answered', 'total_questions', 'data']


from rest_framework import serializers
from .models import RecruiterAssessment

class GenerateJobAssessmentSerializer(serializers.Serializer):
    recruiter_id = serializers.CharField()
    job_description = serializers.CharField()
    job_title = serializers.CharField()

class RecruiterAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruiterAssessment
        fields = "__all__"

# myapp/serializers.py
from rest_framework import serializers

class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=255)

# profilers/serializers.py
from rest_framework import serializers

class SaveInitialVoiceSerializer(serializers.Serializer):
    email = serializers.EmailField()
    audio_file= serializers.FileField()

class SaveAnswerSerializer(serializers.Serializer):
    email = serializers.EmailField()
    audio_file = serializers.FileField(required=False, allow_empty_file=True)
    answer = serializers.JSONField()
    # question_id = serializers.IntegerField()

class SaveResumeVoiceSerializer(serializers.Serializer):
    email = serializers.EmailField()
    audio_file= serializers.FileField()


class PausePaperSerializer(serializers.Serializer):
    email = serializers.EmailField()


class SubmitPaperSerializer(serializers.Serializer):
    email = serializers.EmailField()
    

