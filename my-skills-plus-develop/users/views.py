from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import CreateView
from django.contrib.auth import login, get_user_model, authenticate
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect, Http404
from decimal import Decimal, InvalidOperation
from django.db import connection
from django.utils import timezone
from datetime import timedelta

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound, APIException
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from profilers.models import JobProfiles, Skill, IndividualAssessment

from users.forms import UserSignUpForm
from users.serializers import (
    CreateUserSerializer,
    UserSerializer,
    PaymentSerializer,
    ForgetPasswordSerializer,
    SampleSkillSerializer,
    send_verification_email,
    AdminLoginRequestSerializer,
    PartnerOutSerializer,
    LoginResponse,
    VerificationCodeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    DashboardSummarySerializer,
    ReferralOutSerializer,
    PayoutOutSerializer,
    PartnerWithLogoOutSerializer,
    PartnerUpdateSerializer,
    PartnerOutSerializer,
    AdminLoginResponseSerializer,
    PayoutCreateSerializer,
    CustomTokenObtainPairSerializer,
    DirectContactSerializer,
    WalletSerializer,
    WalletTransactionSerializer,
)
from .models import User, VerificationToken, Partner, Referral, Payout, DashboardSummary, Admin, BlacklistedToken, VerificationCode, EmailVerificationCode, DirectContact, Wallet, WalletTransaction  # Adjust the import based on your project structure
import json
from django.core.cache import cache
from django.http import JsonResponse
from urllib.parse import unquote
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests  # Import correctly
import os
import secrets
import string
from .serializers import (
    PartnerCreateSerializer,
    PartnerUpdateSerializer,
    PartnerOutSerializer,
    PartnerWithLogoOutSerializer,
    ReferralOutSerializer,
    PayoutOutSerializer,
)
from .email_service import EmailService
import jwt
from datetime import datetime, timedelta
from uuid import UUID
from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import gettext as _
from typing import Dict, Optional
import logging
# import cloudinary
# import cloudinary.uploader
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import qrcode
import io
import stripe
from django.db import transaction
from django.db.models import F
import requests
import razorpay  # Ensure you have the Razorpay client imported

from dotenv import load_dotenv
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

FRONTEND_URL = os.getenv("FRONTEND_URL")
JOB_URL = os.getenv("JOB_URL")
PARTNER_URL = os.getenv("PARTNER_URL")
API_URL = os.getenv("API_URL")

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# # Cloudinary Configuration
# def verify_cloudinary_config():
#     cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
#     api_key = os.getenv("CLOUDINARY_API_KEY")
#     api_secret = os.getenv("CLOUDINARY_API_SECRET")
    
#     if not all([cloud_name, api_key, api_secret]):
#         raise ValueError("Missing Cloudinary credentials")
    
#     return {
#         "cloud_name": cloud_name,
#         "api_key": api_key,
#         "api_secret": api_secret
#     }

# try:
#     config = verify_cloudinary_config()
#     cloudinary.config(**config)
# except Exception as e:
#     logger.error(f"Failed to configure Cloudinary: {str(e)}")
#     raise

def verify_email(request, token):
    try:
        token_obj = VerificationToken.objects.get(token=token)
        user = token_obj.user
        user.verified = True
        # user.is_active = True
        user.save()
        token_obj.delete()
        if user.type=='user':

            return redirect(f'{FRONTEND_URL}/auth/signup/activate')
        elif user.type=='recruiter':
            return redirect(f'{JOB_URL}/auth/signup/activate')
    except VerificationToken.DoesNotExist:
        # Show a friendly HTML message if token is not found
        from django.http import HttpResponse
        
        return HttpResponse("""
                <html>
                    <head><title>Account Already Activated</title></head>
                    <body style='font-family: Arial, sans-serif; text-align: center; margin-top: 50px;'>
                        <h2>Your account is already activated.</h2>
                    </body>
                </html>
            """)
           

    
       

User = get_user_model()

class ResendVerificationEmailView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

        if user.verified:
            return Response({"detail": "User is already verified."}, status=status.HTTP_400_BAD_REQUEST)

        send_verification_email(user)
        return Response({"detail": "Verification email sent."}, status=status.HTTP_200_OK)


class UserSignUpView(CreateView):
    model = User
    form_class = UserSignUpForm
    template_name = "account/signup.html"

    def form_valid(self, form):
        user = form.save()
        login(
            self.request,
            user,
            backend="allauth.account.auth_backends.AuthenticationBackend",
        )
        return redirect("profilers:skill_playground")


def home_view(request):
    return render(request, "index.html")


class CreateUserView(generics.CreateAPIView):
    serializer_class = CreateUserSerializer
    queryset = User.objects.all()
    authentication_classes = []
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        return Response({"detail": "user is created"}, status=status.HTTP_201_CREATED)


# user info api with authicated user only
class UserView(APIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)



class PaymentVerificationView(APIView):
    def post(self, request):
        # Retrieve the email from the request data
        email = request.data.get('email')
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Find the user by email
        user = User.objects.filter(email=email).first()
        
        if not user:
            return Response({"detail": "Email not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Retrieve payment_id and paid_amount from the request data
        payment_id = request.data.get('payment_id')
        paid_amount_str = request.data.get('paid_amount')

        if not payment_id or not paid_amount_str:
            return Response({"detail": "Payment ID and paid amount are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Convert paid_amount to Decimal
            paid_amount = Decimal(paid_amount_str)
        except (InvalidOperation, ValueError):
            return Response({"detail": "Invalid paid amount."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update the user's payment details
        user.payment_id = payment_id
        user.paid_amount += paid_amount
        
        # Determine the paid_for value based on paid_amount
        paid_for = user.paid_for or []  # Start with an empty list if paid_for is None or empty

        if paid_amount == Decimal('1'):
            if 'print&share' not in paid_for:
                paid_for.append('print&share')
        elif paid_amount == Decimal('5'):
            if 'print&share' in paid_for:
                paid_for.append('add_people')
            if 'print&share' not in paid_for:
                paid_for.append('add_people')

        # Only set is_payment_complete to True if it was not already True
        if not user.is_payment_complete:
            user.is_payment_complete = True
        
        user.paid_for = paid_for
        user.save()

        # Serialize the updated user and return the response
        serializer = PaymentSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ForgetPasswordView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')

        # Validate that email and new_password are provided
        if not email or not new_password:
            return Response({"detail": "Email and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check if the user exists with the provided email
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Update the user's password and save
        user.password = make_password(new_password)
        user.save()

        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

class SampleSkillDetailView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = SampleSkillSerializer

    def get_queryset(self, letter, page_no, page_size, search_term=None):
        cache_key = f'sample_skills_{letter}_{search_term}_{page_no}_{page_size}'
        cached_result = cache.get(cache_key)

        if cached_result is not None:
            return cached_result

        with connection.cursor() as cursor:
            if search_term:
                query = """
                    SELECT 
                        skill_key AS skill_name,
                        skill_data->skill_key->0->'rating'->0->>'rating' AS rating 
                    FROM 
                        sample_skills,
                        LATERAL jsonb_object_keys(skill_data) AS skill_key
                    WHERE 
                        skill_key::text ILIKE %s 
                        AND skill_key ~ '^[a-zA-Z0-9 ]*$'
                    ORDER BY 
                        skill_name         
                    LIMIT %s OFFSET %s;
                """
                cursor.execute(query, [f'{search_term}%', page_size, (page_no - 1) * page_size])
            else:
                query = """
                    SELECT 
                        skill_key AS skill_name,
                        skill_data->skill_key->0->'rating'->0->>'rating' AS rating
                    FROM 
                        sample_skills,
                        LATERAL jsonb_object_keys(skill_data) AS skill_key
                    WHERE 
                         skill_key::text LIKE %s 
                         AND skill_key ~ '^[a-zA-Z0-9 ]*$'
                    ORDER BY 
                        skill_name         
                    LIMIT %s OFFSET %s;
                """
                cursor.execute(query, [f'{letter}%', page_size, (page_no - 1) * page_size])

            rows = cursor.fetchall()
            skills_list = []
            for row in rows:
                skill_data = {
                    "skill_name": row[0]
                }
                skills_list.append(skill_data)

            cache.set(cache_key, skills_list, timeout=300)  # Cache for 5 minutes
            return skills_list

    def list(self, request, *args, **kwargs):
        page_no = int(request.query_params.get('page_no', 1))
        page_size = int(request.query_params.get('page_size', 20))
        letter = request.query_params.get('letter', '').lower()
        search_term = request.query_params.get('search_term', '').strip()

        all_skills = self.get_queryset(letter, page_no, page_size, search_term)
        total_skills = self.get_total_skills(letter, search_term)

        response_data = {
            "skills": all_skills,
            "total_skills": total_skills,
            "page_no": page_no,
            "page_size": page_size,
            "letter_filter": letter,
            "search_term": search_term
        }

        return Response(response_data)

    def get_total_skills(self, letter, search_term=None):
        with connection.cursor() as cursor:
            if search_term:
                query = """
                    SELECT 
                        COUNT(*) 
                    FROM 
                        sample_skills,
                        LATERAL jsonb_object_keys(skill_data) AS skill_key
                    WHERE 
                        skill_key::text ILIKE %s
                        AND skill_key ~ '^[a-zA-Z0-9 ]*$';
                """
                cursor.execute(query, [f'{search_term}%'])
            else:
                query = """
                    SELECT 
                        COUNT(*) 
                    FROM 
                        sample_skills,
                        LATERAL jsonb_object_keys(skill_data) AS skill_key
                    WHERE 
                        skill_key::text LIKE %s
                        AND skill_key ~ '^[a-zA-Z0-9 ]*$';
                """
                cursor.execute(query, [f'{letter}%'])

            total = cursor.fetchone()[0]
            return total

class SampleSkillDetailedView(generics.ListAPIView):
    permission_classes = [AllowAny]

    def get_queryset(self):
        skillname = self.request.query_params.get('skillname')  # Get skillname from query params
        if not skillname:
            return []
        else :
            skillname = unquote(skillname)

        cache_key = f'sample_skills_{skillname}'
        cached_result = cache.get(cache_key)

        if cached_result is not None:
            return cached_result

        with connection.cursor() as cursor:
            query = """
                SELECT 
                        skill_data
                    FROM 
                        sample_skills,
                        LATERAL jsonb_object_keys(skill_data) AS skill_key
                    WHERE 
                        skill_key::text LIKE %s
                AND skill_key::text ~ '^[a-zA-Z0-9 ]*$'
            """
            cursor.execute(query, [skillname])
            rows = cursor.fetchall()  # Fetch all rows directly

            # Cache the result
            cache.set(cache_key, rows, timeout=300)  # Cache for 5 minutes
            return rows  # Return the raw rows

    def get(self, request, *args, **kwargs):
        all_skills = self.get_queryset()

        # Handle case when no skills are found
        if not all_skills:
            return JsonResponse({"error": "Skill not found"}, status=404)  # Return an error if no results

        # Extract the skill data from the first row
        skill_data = all_skills[0][0]  # Assuming skill_data is the first column in your result

        # Make sure skill_data is a valid JSON object
        # If skill_data is in string format (like a JSON string), parse it first
        if isinstance(skill_data, str):
            import json
            skill_data = json.loads(skill_data)

        # Return the skill data directly
        return JsonResponse(skill_data, safe=False)

class SaveUserDetailsView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Access userId directly from the request body
        user_id = request.data.get('userId')

        if user_id is None:
            return Response({"error": "individual_profile_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(individual_profile_id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Update the user's details with the provided data
        user.details = {
            "name": request.data.get('name', user.details.get('name', user.username)),  # Update name if provided
            "email": request.data.get('email', user.details.get('email', user.email)),  # Update email if provided
            "education": request.data.get('education', user.details.get('education', [])),  # Update education
            "experience": request.data.get('experience', user.details.get('experience', [])),  # Update experience
            "projects": request.data.get('projects', user.details.get('projects', [])),  # Update projects
            "tasks": request.data.get('tasks', user.details.get('tasks', [])),  # Update tasks
            "achievements": request.data.get('achievements', user.details.get('achievements', []))  # Update achievements
        }

        user.save()  # Save the updated user

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetUserDetailsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.query_params.get('userId')  # Get userId from the query parameters
        print(user_id)  # Debugging: print the userId

        if user_id is None:
            return Response([], status=status.HTTP_400_BAD_REQUEST)  # Return empty array if userId is not provided

        try:
            user = User.objects.get(individual_profile_id=user_id)
        except User.DoesNotExist:
            return Response([], status=status.HTTP_404_NOT_FOUND)  # Return empty array if user not found

        # Extract details from the user's details JSONField
        details = user.details if user.details else {}  # Ensure details is a dictionary

        # Check if details are empty and return an empty array
        if not details:
            return Response([], status=status.HTTP_200_OK)  # Return empty array if details are empty

        # Generate a random alphanumeric username
        #random_username = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(10))

        # Construct the response data
        response_data = {
            "userId": details.get("userId", user.individual_profile_id),  # Fallback to user.id if not found
            "name": details.get("name", user.username),  # Replace actual username with random alphanumeric value
            "email": details.get("email", user.email),  # Fallback to email if not found
            "education": details.get("education", []),  # Return empty array if not found
            "experience": details.get("experience", []),  # Return empty array if not found
            "projects": details.get("projects", []),  # Return empty array if not found
            "tasks": details.get("tasks", []),  # Return empty array if not found
            "achievements": details.get("achievements", [])  # Return empty array if not found
        }

        return Response(response_data, status=status.HTTP_200_OK)

@api_view(['POST'])
def submit_work_preference(request):
    user_id = request.data.get('userId')
    print(user_id)
    user = get_object_or_404(User, individual_profile_id=user_id)
    work_preference_data = request.data.get('workPreference', {})
    print(work_preference_data)

    # Save or update the user's work preference
    user.workpreference = work_preference_data
    user.save()

    return Response({"message": "Work preference saved successfully."}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_work_preference(request):
    user_id = request.query_params.get('userId')
    user = get_object_or_404(User, individual_profile_id=user_id)
    return Response(user.workpreference, status=status.HTTP_200_OK)



@api_view(['POST'])
def submit_vsp_details(request):
    user_id = request.data.get('userId')
    if user_id is None:
        return Response({"error": "userId is required."}, status=status.HTTP_400_BAD_REQUEST)

    # Extract VSP details from the request
    vsp_details = {
        "name": request.data.get('name'),
        "email": request.data.get('email'),
        "vspCost": request.data.get('vspCost'),
        "vspCurrency": request.data.get('vspCurrency'),
        "ctc": request.data.get('ctc', ""),  # Default to empty string if not provided
        "calculatedVsp": request.data.get('calculatedVsp', ""),  # Default to empty string if not provided
        "pbpFee": request.data.get('pbpFee'),
        "pbpCurrency": request.data.get('pbpCurrency'),
        "pcpFee": request.data.get('pcpFee'),
        "pcpCurrency": request.data.get('pcpCurrency'),
    }

    # Get the user and update the vsp_details field
    user = get_object_or_404(User, individual_profile_id=user_id)
    user.vsp_details = vsp_details
    user.save()

    return Response({"message": "VSP details saved successfully."}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_vsp_details(request):
    user_id = request.query_params.get('userId')
    if user_id is None:
        return Response([], status=status.HTTP_400_BAD_REQUEST)  # Return empty array if userId is not provided

    user = get_object_or_404(User, individual_profile_id=user_id)
    vsp_details = user.vsp_details

    return Response(vsp_details, status=status.HTTP_200_OK)

@api_view(['POST'])
def google_login(request):
    try:
        token = request.data.get('token')
        client_id = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
        
        # Use the correct Request object from google.auth.transport.requests
        req = google_requests.Request()  # Use the imported google_requests
        idinfo = id_token.verify_oauth2_token(token, req, client_id)

        email = idinfo['email']
        name = idinfo.get('name')
        last_name = idinfo.get('family_name', '')  # Get last name if available

        # Extract partner_id, referral_code, and type from the request
        partner_id = request.data.get('partner_id')
        referral_code = request.data.get('referral_code')
        type = request.data.get('type')  # New field to extract

        # Generate a random password
        random_password = generate_random_password()

        # Check if the user already exists
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,  # Use email as username
                'first_name': name,
                'last_name': last_name,
                'password': random_password,  # Set the random password
                'verified': True,  # Set verified to True
                'is_payment_complete': False,  # Default value
                'paid_amount': 0.0,  # Default value
                'paid_for': [],  # Default value
                'details': {},  # Default value
                'workpreference': {},  # Default value
                'vsp_details': {},  # Default value
                'partner_id': partner_id,  # Save partner_id if available
                'referral_code': referral_code,  # Save referral_code if available
                'type': type,  # Store the user type
            }
        )

        # If the user was created, ensure verified is set to True
        if created:
            user.verified = True  # Ensure verified is set to True
            user.set_password(random_password)  # Hash the random password
            user.save()  # Save the user instance

        email_service = EmailService()
        if user.type == 'user':
            email_service.send_registration_alert_user(user)
        elif user.type == 'recruiter':
            email_service.send_registration_alert_recruiter(user)

        # Generate access and refresh tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            'access': access_token,  # Return access token
            'refresh': str(refresh),  # Return refresh token
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.first_name,
                'last_name': user.last_name,
                'password': user.password,
                'verified': user.verified,
                'is_payment_complete': user.is_payment_complete,
                'paid_amount': user.paid_amount,
                'paid_for': user.paid_for,
                'details': user.details,
                'workpreference': user.workpreference,
                'vsp_details': user.vsp_details,
                'partner_id': user.partner_id,  # Include partner_id in the response
                'referral_code': user.referral_code,  # Include referral_code in the response
                'type': user.type,  # Include user_type in the response
            },
        })

    except Exception as e:
        print(f"Error during Google login: {e}")  # Log the error
        return Response({'message': 'Token invalid or expired'}, status=status.HTTP_401_UNAUTHORIZED)

def generate_random_password(length=12):
    """Generate a random password with letters, digits, and special characters."""
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(secrets.choice(characters) for i in range(length))
    return password

@api_view(['POST'])
#@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def find_matching_profiles(request):
    find_match = request.data.get('findMatch', {})
    job_title = request.data.get('jobTitle', '')
    rated_skills = request.data.get('ratedSkills', [])


    # Extract parameters from the request
    vsp_min_cost = find_match.get('vspMinCost')
    vsp_max_cost = find_match.get('vspMaxCost')
    vsp_currency = find_match.get('vspCurrency')
    pbp_min_fee = find_match.get('pbpMinFee')
    pbp_max_fee = find_match.get('pbpMaxFee')
    pbp_currency = find_match.get('pbpCurrency')
    pcp_min_fee = find_match.get('pcpMinFee')
    pcp_max_fee = find_match.get('pcpMaxFee')
    pcp_currency = find_match.get('pcpCurrency')
    employment_type = find_match.get('employmentType')
    state = find_match.get('state')
    city = find_match.get('city')
    country = find_match.get('country')
    full_time = find_match.get('fullTime', False)
    part_time = find_match.get('partTime', False)

    # Extract isot_path_addr from ratedSkills and strip leading dots
    isot_path_addrs = [skill['isot_file']['path_addr'].lstrip('.') for skill in rated_skills]
    print('isot_path_addrs:', isot_path_addrs)

    # SQL query to get ids and ratings from Skills table
    skill_query = """
        SELECT user_id, ratings, isot_path_addr
        FROM "Skills"
        WHERE isot_path_addr IN %s;
    """
    
    with connection.cursor() as cursor:
        cursor.execute(skill_query, (tuple(isot_path_addrs),))
        skill_results = cursor.fetchall()
    
    print('skill_results:', skill_results)  # Debug: see what skills were found

    # Create a mapping of isot_path_addr to (user_id, ratings)
    skill_mapping = {}
    for row in skill_results:
        user_id = row[0]
        ratings_raw = row[1]
        isot_path_addr = row[2].strip()
        if isot_path_addr not in skill_mapping:
            skill_mapping[isot_path_addr] = []
        try:
            ratings = json.loads(ratings_raw) if isinstance(ratings_raw, str) else ratings_raw
        except Exception:
            ratings = []
        skill_mapping[isot_path_addr].append((user_id, ratings))

    # Extract the user_ids for the main query
    skill_ids = list(set([row[0] for row in skill_results]))  # unique user_ids
    print('skill_ids (user_ids from Skills table):', skill_ids)  # Debug

    # Check if skill_ids is empty before proceeding
    if not skill_ids:
        return Response([], status=status.HTTP_200_OK)

    # Build WHERE clause dynamically
    where_clauses = ["u.id IN %s"]
    params = [tuple(skill_ids)]
    print('where_clauses:', where_clauses)  # Debug
    print('params:', params)  # Debug

    if vsp_min_cost is not None and vsp_max_cost is not None and vsp_min_cost != '' and vsp_max_cost != '':
        where_clauses.append("(vsp_details->>'vspCost')::numeric BETWEEN %s AND %s")
        params.extend([vsp_min_cost, vsp_max_cost])
        if vsp_currency:
            where_clauses.append("vsp_details->>'vspCurrency' = %s")
            params.append(vsp_currency)
    if pbp_min_fee is not None and pbp_max_fee is not None and pbp_min_fee != '' and pbp_max_fee != '':
        where_clauses.append("(vsp_details->>'pbpFee')::numeric BETWEEN %s AND %s")
        params.extend([pbp_min_fee, pbp_max_fee])
        if pbp_currency:
            where_clauses.append("vsp_details->>'pbpCurrency' = %s")
            params.append(pbp_currency)
    if pcp_min_fee is not None and pcp_max_fee is not None and pcp_min_fee != '' and pcp_max_fee != '':
        where_clauses.append("(vsp_details->>'pcpFee')::numeric BETWEEN %s AND %s")
        params.extend([pcp_min_fee, pcp_max_fee])
        if pcp_currency:
            where_clauses.append("vsp_details->>'pcpCurrency' = %s")
            params.append(pcp_currency)
    if employment_type:
        where_clauses.append("workpreference->>'employmentType' = %s")
        params.append(employment_type)
    if city:
        where_clauses.append("(workpreference->>'city')::int = %s")
        params.append(city)
    if state:
        where_clauses.append("(workpreference->>'state')::int = %s")
        params.append(state)
    if country:
        where_clauses.append("(workpreference->>'country')::int = %s")
        params.append(country)

    # Add conditions based on fullTime and partTime
    if full_time and part_time:
        where_clauses.append("(workpreference->'freelanceOptions'->>'weekday' IS NOT NULL and workpreference->'freelanceOptions'->>'weekend' IS NOT NULL)")
    elif full_time:
        where_clauses.append("(workpreference->'freelanceOptions'->>'weekday' IS NOT NULL)")
    elif part_time:
        where_clauses.append("(workpreference->'freelanceOptions'->>'weekend' IS NOT NULL)")

    where_sql = " AND ".join(where_clauses) if where_clauses else "TRUE"
    print('Final WHERE SQL:', where_sql)  # Debug
    print('Final params:', params)  # Debug

    query = f"""
        SELECT
            u.id,
            u.individual_profile_id,
            u.username,  
            u.vsp_details->>'name' AS name,
            u.vsp_details->>'pbpFee' AS pbpFee,
            u.vsp_details->>'pcpFee' AS pcpFee,
            u.vsp_details->>'pbpCurrency' AS pbpCurrency,
            u.vsp_details->>'pcpCurrency' AS pcpCurrency,
            u.vsp_details->>'vspCost' AS vspCost,
            u.vsp_details->>'vspCurrency' AS vspCurrency
        FROM
            users_user u
        WHERE
            {where_sql}
    """
    print('Final query:', query)  # Debug

    with connection.cursor() as cursor:
        cursor.execute(query, params)
        results = cursor.fetchall()
    
    print('User query results:', results)  # Debug

    # Process results and return response
    matching_profiles = []
    for row in results:
        individual_profile_id = row[1]
        user_id = row[0]
        vsp_name = row[3]
        pbp_fee = row[4]
        pcp_fee = row[5]
        pbp_currency = row[6]
        pcp_currency = row[7]
        vsp_cost = row[8]
        vsp_currency = row[9]

        # Prepare skill details for the current user
        skill_details = []
        for skill in rated_skills:
            skill_isot_path_addr = skill['isot_file']['path_addr'].lstrip('.')
            # request_rating = skill['rating'][0]['rating'] if skill['rating'] else None
            if skill['rating']:
                if len(skill['rating']) == 2:
                    request_rating = skill['rating'][1]['rating']
                else:
                    request_rating = skill['rating'][0]['rating']
            else:
                request_rating = None
            print('request_rating :', request_rating)

            # Check if the skill exists in the skill mapping
            if skill_isot_path_addr in skill_mapping:
                for user_skill_id, user_ratings in skill_mapping[skill_isot_path_addr]:
                    if user_skill_id == user_id:  # Match the user_id
                        ratings_raw = user_ratings
                        try:
                            ratings = json.loads(ratings_raw) if isinstance(ratings_raw, str) else ratings_raw
                        except Exception:
                            ratings = []
                        user_rating = None
                        if isinstance(ratings, list) and ratings and isinstance(ratings[0], dict) and 'rating' in ratings[0]:
                            user_rating = ratings[0]['rating']
                        elif isinstance(ratings, dict) and 'rating' in ratings:
                            user_rating = ratings['rating']
                        else:
                            user_rating = None

                        if request_rating is not None and user_rating is not None:
                            # Calculate percentage
                            percentage = (request_rating / user_rating) * 100 if user_rating > 0 else 0
                        else:
                            request_rating = None
                            percentage = 0

                        skill_details.append({
                            'skill_id': user_skill_id,  # Use user_id as skill_id for uniqueness
                            'skill_name': skill['isot_file']['name'],
                            'request_rating': request_rating,
                            'user_rating': user_rating,
                            'percentage': percentage,
                        })

        matching_profiles.append({
            'user_id': individual_profile_id,
            'username': row[2],  # Use actual username from the User model
            'vsp_details': {
                'name': vsp_name,
                'pbpFee': pbp_fee,
                'pcpFee': pcp_fee,
                'pbpCurrency': pbp_currency,
                'pcpCurrency': pcp_currency,
                'vspCost': vsp_cost,
                'vspCurrency': vsp_currency,
            },
            'skill_details': skill_details,
        })

    return Response(matching_profiles, status=status.HTTP_200_OK)

class RegisterPartnerView(generics.CreateAPIView):
    serializer_class = PartnerCreateSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            partner = serializer.save()
        except Exception as e:
            return Response({"detail": f"Registration failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Prepare partner dict for email service and response
        partner_dict = {
            "partner_id": partner.partner_id,
            "name": partner.name,
            "email": partner.email,
            "phone": partner.phone,
            "partner_type": partner.partner_type,
            "other_partner_type": partner.other_partner_type,
            "channel_name": partner.channel_name,
            "website_link": partner.website_link,
            "bio": partner.bio,
            "country": partner.country,
            "referred_by": partner.referred_by,
            "referral_code": partner.referral_code,
            "stripe_account_id": partner.stripe_account_id,
            "logo_url": partner.logo_url,
            "is_active": partner.is_active,
            "email_verified": partner.email_verified,
            "status": partner.status,
            "created_at": partner.created_at,
            "updated_at": partner.updated_at,
        }

        # Send registration confirmation and admin notification emails
        email_service = EmailService()
        email_errors = []
        try:
            email_service.send_registration_alert_partner(partner_dict)
            print("Registration alert email sent!")
        except Exception as e:
            print(f"Error sending registration alert email: {e}")
        try:
            email_service.send_registration_confirmation_email(partner_dict)
            print("Registration confirmation email sent!")
        except Exception as e:
            print(f"Error sending registration confirmation email: {e}")
            email_errors.append(f"Failed to send registration confirmation email: {str(e)}")
        try:
            email_service.send_admin_notification_email(partner_dict)
        except Exception as e:
            email_errors.append(f"Failed to send admin notification email: {str(e)}")

        # Prepare response
        response_data = partner_dict.copy()
        if email_errors:
            response_data["email_errors"] = email_errors

        return Response(response_data, status=status.HTTP_201_CREATED)

class DashboardSummaryView(APIView):
    #permission_classes = (IsAuthenticated,)  # Ensure only authenticated users can access this view

    def get(self, request, partner_id: UUID):
        try:
            # Fetch the dashboard summary for the partner
            summary = self.get_dashboard_summary(partner_id)
            return Response(summary, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": "Failed to fetch dashboard summary"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_dashboard_summary(self, partner_id: UUID) -> dict:
        """Get dashboard summary for partner"""
        try:
            # SQLite stores UUIDs without hyphens; Postgres uses standard format
            partner_id_str = str(partner_id).replace("-", "") if connection.vendor == "sqlite" else str(partner_id)
            partner_base_url = PARTNER_URL or os.getenv("PARTNER_URL", "http://localhost:3003")
            with connection.cursor() as cursor:
                # Get partner info
                partner_query = "SELECT name, partner_type, referral_code, partner_id FROM users_partner WHERE partner_id = %s"
                cursor.execute(partner_query, [partner_id_str])
                partner = cursor.fetchone()

                if not partner:
                    raise ValueError("Partner not found")

                # Get referral stats
                stats_query = """
                    SELECT 
                        COUNT(*) as total_signups,
                        COUNT(CASE WHEN status IN ('Paid', 'Earning') THEN 1 END) as active_paying_users,
                        COALESCE(SUM(earnings_amount), 0) as total_earnings
                    FROM users_referral
                    WHERE partner_id = %s
                """
                cursor.execute(stats_query, [partner_id_str])
                stats = cursor.fetchone()

                # Get available for payout (total earnings - already paid out)
                payout_query = """
                    SELECT COALESCE(SUM(amount), 0) as total_paid
                    FROM users_payout
                    WHERE partner_id = %s AND status = 'Completed'
                """
                cursor.execute(payout_query, [partner_id_str])
                payout_result = cursor.fetchone()

                available_for_payout = stats[2] - payout_result[0]  # total_earnings - total_paid

                # Get frontend URL from environment variable with fallback
                # frontend_url = os.getenv("FRONTEND_URL", "https://partner.myskillsplus.com")

                return {
                    'total_signups': stats[0],
                    'active_paying_users': stats[1],
                    'total_earnings': stats[2],
                    'available_for_payout': max(available_for_payout, 0),
                    'referral_link': f"{partner_base_url}/ref/{partner[2]}/{partner[3]}",  # referral_code
                    'partner_name': partner[0],
                    'partner_type': partner[1]
                }
        except Exception as e:
            logger.error(f"Error fetching dashboard summary for partner_id {partner_id}: {str(e)}")
            raise ValueError("Failed to fetch dashboard summary")

class ReferralListView(APIView):
    # permission_classes = (IsAuthenticated,)  # Uncomment if you want to restrict access to authenticated users

    def get(self, request, partner_id):
        try:
            # Fetch the partner using the provided partner_id
            partner = Partner.objects.get(partner_id=partner_id)  # Assuming partner_id is a UUIDField
            limit = request.query_params.get('limit', 50)  # Default limit
            offset = request.query_params.get('offset', 0)  # Default offset

            # Fetch referrals for the partner with pagination
            referrals = Referral.objects.filter(partner=partner)[offset:offset + limit]
            serializer = ReferralOutSerializer(referrals, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Partner.DoesNotExist:
            return Response([])
        except Exception as e:
            return Response({"detail": "Failed to fetch referrals"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PayoutListView(APIView):
    # permission_classes = (IsAuthenticated,)

    def get(self, request, partner_id):
        logger.info(f"Fetching payouts for partner_id: {partner_id}")  # Log the request

        try:
            # Fetch the partner using the provided partner_id
            partner = Partner.objects.get(partner_id=partner_id)  # Assuming partner_id is a UUIDField
            logger.info(f"Partner found: {partner.name}")  # Log partner details

            # Fetch payouts for the partner
            payouts = Payout.objects.filter(partner=partner)
            logger.info(f"Fetched {len(payouts)} payouts for partner_id: {partner_id}")  # Log number of payouts

            serializer = PayoutOutSerializer(payouts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Partner.DoesNotExist:
            logger.warning(f"Partner not found for partner_id: {partner_id}")  # Log warning
            return Response({"detail": "Partner not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error fetching payouts for partner_id {partner_id}: {str(e)}")  # Log error
            return Response({"detail": "Failed to fetch payouts"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PartnerProfileView(APIView):
    #permission_classes = (IsAuthenticated,)

    def get(self, request, partner_id):
        logger.info(f"Fetching profile for partner_id: {partner_id}")  # Log the request

        try:
            # Fetch the partner using the provided partner_id
            partner = Partner.objects.get(partner_id=partner_id)  # Assuming partner_id is a UUIDField
            logger.info(f"Partner found: {partner.name}")  # Log partner details

            # Serialize the partner profile
            serializer = PartnerCreateSerializer(partner)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Partner.DoesNotExist:
            logger.warning(f"Partner not found for partner_id: {partner_id}")  # Log warning
            return Response({"detail": "Partner not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error fetching profile for partner_id {partner_id}: {str(e)}")  # Log error
            return Response({"detail": "Failed to fetch profile"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UpdatePartnerSettingsView(APIView):
    # permission_classes = (IsAuthenticated,)

    def post(self, request, partner_id):
        logger.info(f"Updating settings for partner_id: {partner_id}")  # Log the request

        try:
            # Fetch the partner using the provided partner_id
            partner = Partner.objects.get(partner_id=partner_id)  # Assuming partner_id is a UUIDField
            logger.info(f"Partner found: {partner.name}")  # Log partner details

            # Update partner settings
            serializer = PartnerUpdateSerializer(partner, data=request.data, partial=True)
            
            if serializer.is_valid():
                updated_partner = serializer.save()
                logger.info(f"Partner settings updated successfully for partner_id: {partner_id}")  # Log success
                return Response(PartnerOutSerializer(updated_partner).data, status=status.HTTP_200_OK)
            
            logger.warning(f"Validation errors: {serializer.errors}")  # Log validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Partner.DoesNotExist:
            logger.warning(f"Partner not found for partner_id: {partner_id}")  # Log warning
            return Response({"detail": "Partner not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error updating settings for partner_id {partner_id}: {str(e)}")  # Log error
            return Response({"detail": "Failed to update partner settings"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DeleteAccountView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        partner = request.user.partner  # Assuming a OneToOne relationship with User
        try:
            # Check if partner has any pending payouts
            payouts = self.get_partner_payouts(partner.id)
            pending_payouts = [p for p in payouts if p['status'] == 'Pending']
            
            if pending_payouts:
                return Response(
                    {"detail": "Cannot delete account with pending payouts. Please wait for all payouts to be processed."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Delete partner account
            deleted = self.delete_partner(partner.id)
            if not deleted:
                return Response({"detail": "Partner not found"}, status=status.HTTP_404_NOT_FOUND)

            return Response({"message": "Account deleted successfully"}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"detail": "Failed to delete account"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_partner_payouts(self, partner_id):
        """Get payouts for partner using Django ORM"""
        return Payout.objects.filter(partner_id=partner_id).values('payout_id', 'payout_date', 'amount', 'status', 'notes')

    def delete_partner(self, partner_id):
        """Delete partner account using Django ORM"""
        try:
            partner = Partner.objects.get(id=partner_id)
            # Handle users who were referred by this partner
            # Option 1a: Set their referred_by_code to NULL
            User.objects.filter(referred_by_code=partner.referral_code).update(referred_by_code=None, referred_by_partner_id=None)

            # Delete related records
            Referral.objects.filter(partner_id=partner_id).delete()
            Payout.objects.filter(partner_id=partner_id).delete()

            # Now delete partner record
            partner.delete()
            return True
        except Partner.DoesNotExist:
            return False

def verify_admin_credentials(username, password):
    try:
        admin = Admin.objects.get(username=username)
        if password == admin.password_hash:  # Insecure, for testing only!
            return admin
    except Admin.DoesNotExist:
        return None
    return None

def create_admin_token(admin_id: str, expires_delta: Optional[timedelta] = None) -> str:
    """Create a new admin JWT token compatible with DRF SimpleJWT"""
    to_encode = {
        "sub": admin_id,         # Subject (admin_id)
        "type": "admin"  # Optional, for your use
    }
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(days=1))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

class AdminLoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = AdminLoginRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        admin = verify_admin_credentials(username, password)
        if not admin:
            return Response(
                {"detail": "Incorrect username or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        access_token = create_admin_token(str(admin.admin_id))
        response_data = {
            "access_token": access_token,
            "token_type": "bearer"
        }
        return Response(response_data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def admin_logout(request):
    """Admin logout endpoint"""
    token = request.META.get('HTTP_AUTHORIZATION').split()[1]  # Extract token from the Authorization header
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        expires_at = datetime.fromtimestamp(payload["exp"])

        # Blacklist the token
        BlacklistedToken.objects.create(token=token, expires_at=expires_at)

        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
    except jwt.InvalidTokenError:
        return Response({"detail": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])  # Ensure only authenticated users can access this endpoint
def get_all_partners(request):
    """Get all partners (admin only)"""
    status_filter = request.query_params.get('status_filter', None)  # Optional status filter

    try:
        if status_filter:
            partners = Partner.objects.filter(status=status_filter)  # Filter by status if provided
        else:
            partners = Partner.objects.all()  # Get all partners

        serializer = PartnerOutSerializer(partners, many=True)  # Serialize the partners
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": "Failed to fetch partners"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def approve_partner(request, partner_id: UUID):
    """Approve a partner (admin only)"""
    try:
        # Fetch the partner and update the status
        partner = Partner.objects.get(partner_id=partner_id)
        print('partner: ', partner)  # Log the partner object
        partner.status = "Approved"
        partner.save()

        # Generate a verification code
        verification_code = str(partner_id)

        # Store the verification code
        stored = store_verification_code(partner, partner.email, verification_code)
        print('stored :', stored)
        if not stored:
            return Response({"detail": "Failed to store verification code"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Send activation email
        email_service = EmailService()
        email_service.send_activation_email({
            "name": partner.name,
            "email": partner.email,
            # Add any other necessary fields here
        }, verification_code)

        # Serialize the updated partner data
        serializer = PartnerOutSerializer(partner)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except ObjectDoesNotExist:
        return Response({"detail": "Partner not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Log the exception for debugging
        logger.error(f"Error approving partner: {str(e)}")
        return Response({"detail": "Failed to approve partner"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def store_verification_code(partner, email, code):
    """Store the verification code for the partner."""
    try:
        # Set expiration time (e.g., 24 hours from now)
        expires_at = timezone.now() + timedelta(days=1)

        # Check if a verification code already exists for the given email and partner
        verification_code_entry, created = VerificationCode.objects.update_or_create(
            partner=partner,
            email=email,
            defaults={'code': code, 'expires_at': expires_at}  # Update the code and expiration time if it exists
        )
        return True
    except Exception as e:
        print(f"Error storing verification code: {e}")
        return False

@api_view(['POST'])
#@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access this endpoint
def reject_partner(request, partner_id: UUID):
    """Reject a partner (admin only)"""
    try:
        # Fetch the partner and update the status
        partner = Partner.objects.get(partner_id=partner_id)
        partner.status = "Rejected"
        partner.save()

        # Send rejection email
        email_service = EmailService()
        email_service.send_rejection_email({
            "name": partner.name,
            "email": partner.email
            # Add any other necessary fields here
        })

        # Serialize the updated partner data
        serializer = PartnerOutSerializer(partner)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Partner.DoesNotExist:
        return Response({"detail": "Partner not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"detail": "Failed to reject partner"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow any user to access this endpoint
def partner_login(request):
    """Partner login endpoint - accepts both form data and JSON"""
    email = request.data.get("username")
    password = request.data.get("password")

    if not email or not password:
        return Response({"detail": _("Please provide username and password")}, status=status.HTTP_400_BAD_REQUEST)

    # Verify credentials
    partner = verify_partner_credentials(username=email, password=password)
    
    if not partner:
        return Response({"detail": _("Incorrect email or password")}, status=status.HTTP_401_UNAUTHORIZED)

    # Check partner status
    if partner.status == "Pending":
        return Response({"detail": _("Your account is pending approval. You will receive an email once approved.")}, status=status.HTTP_401_UNAUTHORIZED)
    elif partner.status == "Rejected":
        return Response({"detail": _("Your account application has been rejected. Please contact support for more information.")}, status=status.HTTP_401_UNAUTHORIZED)

    # Check if email is verified
    if not partner.email_verified:
        return Response({"detail": _("Please verify your email address before logging in. Check your email for the activation link.")}, status=status.HTTP_401_UNAUTHORIZED)

    # Check if account is active
    if not partner.is_active:
        return Response({"detail": _("Your account is not active. Please contact support.")}, status=status.HTTP_401_UNAUTHORIZED)

    # Create access token
    access_token = create_access_token(
        data={"partner_id": str(partner.partner_id)},
        expires_delta=timedelta(days=1)
    )

    # Prepare the response data
    response_data = {
        "access_token": access_token,
        "partner_id": str(partner.partner_id),
        "name": partner.name,
        "email": partner.email,
        "phone": partner.phone,
        "partner_type": partner.partner_type,
        "status": partner.status,
        "is_active": partner.is_active,
        "email_verified": partner.email_verified,
        # Add any other details you want to include
    }

    return Response(response_data, status=status.HTTP_200_OK)

def create_access_token(data: Dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a new JWT token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=1)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm='HS256')
    return encoded_jwt

class VerifyEmailView(APIView):
    def post(self, request):
        serializer = VerificationCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        code = serializer.validated_data['code']

        # Verify the email verification code using ORM
        is_valid = self.verify_email_code(email, code)
        if not is_valid:
            return Response({"detail": _("Invalid verification code")}, status=status.HTTP_400_BAD_REQUEST)

        # Activate the partner account
        activated = self.activate_partner(email)
        if not activated:
            return Response({"detail": _("Failed to activate partner account")}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": _("Email verified successfully")}, status=status.HTTP_200_OK)

    def verify_email_code(self, email: str, code: str) -> bool:
        """Verify email verification code using Django ORM"""
        try:
            verification_code = VerificationCode.objects.get(email=email, code=code)
            return verification_code.is_valid()  # Check if the code is still valid
        except VerificationCode.DoesNotExist:
            return False

    def activate_partner(self, email: str) -> bool:
        """Activate partner account after email verification using Django ORM"""
        try:
            partner = Partner.objects.get(email=email)
            partner.email_verified = True
            partner.is_active = True
            partner.save()  # Save the changes to the database
            return True
        except Partner.DoesNotExist:
            return False

class PasswordResetView(APIView):
    def post(self, request):
        logger.info("Password reset request received.")  # Log the request

        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        logger.info(f"Password reset requested for email: {email}")  # Log the email

        # Check if partner exists
        partner = self.get_partner_by_email(email)
        if not partner:
            logger.warning(f"No partner found with email: {email}")  # Log warning
            # Return success even if email doesn't exist (security best practice)
            return Response({"message": "If the email exists, you will receive reset instructions"}, status=status.HTTP_200_OK)

        # Generate reset token
        reset_token = self.create_password_reset_token(str(partner.partner_id))
        logger.info(f"Generated reset token for partner_id: {partner.partner_id}")  # Log token generation

        # Send reset email
        email_service = EmailService()
        email_service.send_password_reset_email(partner.email, reset_token)
        logger.info(f"Password reset email sent to: {partner.email}")  # Log email sending

        return Response({"message": "If the email exists, you will receive reset instructions"}, status=status.HTTP_200_OK)

    def get_partner_by_email(self, email: str):
        """Get partner by email using Django ORM"""
        try:
            return Partner.objects.get(email=email)
        except Partner.DoesNotExist:
            return None

    @staticmethod
    def create_password_reset_token(partner_id: str) -> str:
        """Create password reset token"""
        payload = {
            "partner_id": partner_id,
            "type": "reset",
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

class PasswordResetConfirmView(APIView):
    def post(self, request):
        logger.info("Password reset confirmation request received.")  # Log the request

        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        logger.info(f"Reset token received: {token}")  # Log the token

        # Verify reset token
        partner_id = self.verify_password_reset_token(token)
        if not partner_id:
            logger.warning("Invalid or expired reset token.")  # Log warning
            return Response({"detail": "Invalid or expired reset token"}, status=status.HTTP_400_BAD_REQUEST)

        # Update password
        self.update_partner_password(partner_id, new_password)
        logger.info(f"Password updated successfully for partner_id: {partner_id}")  # Log success

        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

    @staticmethod
    def verify_password_reset_token(token: str) -> str:
        """Verify password reset token"""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            if payload["type"] != "reset":
                return None
            return payload["partner_id"]
        except jwt.InvalidTokenError:
            return None

    def update_partner_password(self, partner_id: str, new_password: str):
        """Update the partner's password"""
        try:
            # Fetch the partner using partner_id
            partner = Partner.objects.get(partner_id=partner_id)  # Use partner_id as the lookup field
            partner.password_hash = make_password(new_password)  # Hash the password manually
            partner.save()
            logger.info(f"Password for partner_id {partner_id} updated successfully.")  # Log password update
        except Partner.DoesNotExist:
            logger.error(f"Partner not found for partner_id: {partner_id}")  # Log error
            raise APIException("Partner not found")

class LogoutView(APIView):
    def post(self, request):
        authorization = request.headers.get('Authorization')
        if not authorization:
            raise APIException(_("Invalid authorization header"))

        try:
            # Extract token from Authorization header
            token = authorization.split(" ")[1] if authorization.startswith("Bearer ") else authorization
            
            # Verify token is valid before blacklisting
            payload = self.verify_token(token)
            if not payload:
                raise APIException(_("Invalid token"))

            # Add token to blacklist with expiry time from token
            self.blacklist_token(token, payload.get("exp", datetime.utcnow() + timedelta(days=1)))

            return Response({"message": _("Successfully logged out")}, status=status.HTTP_200_OK)

        except IndexError:
            raise APIException(_("Invalid authorization header"))
        except Exception as e:
            raise APIException(_("Logout failed"))

    @staticmethod
    def verify_token(token: str):
        """Verify the JWT token"""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            return payload
        except jwt.InvalidTokenError:
            return None

    @staticmethod
    def blacklist_token(token: str, expiry: datetime):
        """Blacklist the token"""
        # Assuming you have a BlacklistedToken model to store blacklisted tokens
        BlacklistedToken.objects.create(token=token, expires_at=expiry)

# @method_decorator(csrf_exempt, name='dispatch')  # Disable CSRF for this view if needed
# class UploadLogoView(APIView):
#     def post(self, request, partner_id: UUID):
#         """Upload partner logo to Cloudinary"""
#         logger.info(f"Starting file upload process for partner_id: {partner_id}")

#         # Check if a file is provided
#         if 'file' not in request.FILES:
#             logger.warning("No file provided in the request")
#             return JsonResponse({"detail": "No file provided"}, status=400)

#         file: InMemoryUploadedFile = request.FILES['file']

#         # Validate file extension
#         file_ext = os.path.splitext(file.name)[1].lower()
#         if file_ext not in ALLOWED_EXTENSIONS:
#             logger.warning(f"Invalid file extension: {file_ext}")
#             return JsonResponse({
#                 "detail": f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
#             }, status=400)

#         # Validate file size
#         file_size = file.size
#         logger.info(f"File size: {file_size} bytes")
#         if file_size > MAX_FILE_SIZE:
#             logger.warning(f"File too large: {file_size} bytes")
#             return JsonResponse({
#                 "detail": f"File size exceeds maximum allowed size of {MAX_FILE_SIZE / 1024 / 1024}MB"
#             }, status=400)

#         # Verify Cloudinary configuration again
#         try:
#             config = verify_cloudinary_config()
#             cloudinary.config(**config)
#         except Exception as e:
#             logger.error(f"Cloudinary configuration error: {str(e)}")
#             return JsonResponse({
#                 "detail": "Cloudinary configuration is incomplete. Please check environment variables."
#             }, status=500)

#         try:
#             logger.info("Attempting to upload to Cloudinary...")
#             upload_result = cloudinary.uploader.upload(
#                 file,
#                 public_id=f"partner_logos/{partner_id}",
#                 overwrite=True,
#                 resource_type="image",
#                 transformation=[
#                     {"quality": "auto"},
#                     {"fetch_format": "auto"},
#                     {"width": 800, "crop": "limit"}
#                 ]
#             )

#             logger.info("Upload to Cloudinary successful")
#             logger.info(f"Upload result: {upload_result}")

#             # Get the secure URL from the response
#             logo_url = upload_result['secure_url']

#             # Update partner record with logo URL
#             logger.info("Updating partner record with logo URL...")
#             partner = Partner.objects.get(id=partner_id)
#             partner.logo_url = logo_url  # Assuming you have a logo_url field
#             partner.save()
#             logger.info("Partner record updated successfully")

#             return JsonResponse({
#                 "message": "Logo uploaded successfully to Cloudinary",
#                 "logo_url": logo_url,
#                 "width": upload_result['width'],
#                 "height": upload_result['height'],
#                 "format": upload_result['format']
#             }, status=200)

#         except Exception as e:
#             logger.error(f"Cloudinary upload failed: {str(e)}")
#             return JsonResponse({
#                 "detail": f"Failed to upload to Cloudinary: {str(e)}"
#             }, status=500)

class HandleReferralLinkView(APIView):
    def get(self, request, referral_code):
        """Handle referral link visits"""
        try:
            # Find partner by referral code
            partner = Partner.objects.filter(referral_code=referral_code).first()
            if not partner:
                # Redirect to main site if invalid code
                return HttpResponseRedirect(API_URL)

            # Set referral cookie (expires in 30 days)
            response = HttpResponseRedirect(f"{API_URL}/users/register/")
            response.set_cookie(
                key="referral_code",
                value=referral_code,
                max_age=30 * 24 * 60 * 60,  # 30 days
                httponly=True,
                secure=True,
                samesite="Lax"
            )
            return response

        except Exception as e:
            # Fallback to main site
            return HttpResponseRedirect(API_URL)

@method_decorator(csrf_exempt, name='dispatch')  # Disable CSRF for this view if needed
class TrackReferralSignupView(APIView):
    def post(self, request):
        """Track when a referred user signs up"""
        try:
            user_data = request.POST  # Assuming data is sent as form data
            referral_code = request.COOKIES.get("referral_code")
            if not referral_code:
                return JsonResponse({"status": "no_referral"})

            # Find partner
            partner = Partner.objects.filter(referral_code=referral_code).first()
            if not partner:
                return JsonResponse({"status": "invalid_referral"})

            # Create referral record
            referral = self.create_referral(
                referred_email=user_data.get("email"),
                partner_id=partner.id
            )

            return JsonResponse({"status": "tracked", "referral_id": str(referral.id)})

        except Exception as e:
            return JsonResponse({"detail": "Failed to track referral"}, status=500)

    def create_referral(self, referred_email, partner_id):
        """Create a referral record"""
        # Assuming you have a Referral model
        from .models import Referral
        referral = Referral.objects.create(
            referred_email=referred_email,
            partner_id=partner_id
        )
        return referral

class ReferralQRCodeView(APIView):
    # permission_classes = (IsAuthenticated,)

    def get(self, request, partner_id):
        try:
            # Fetch the partner using the provided partner_id
            partner = Partner.objects.get(partner_id=partner_id)  # Assuming partner_id is a UUIDField

            # Generate referral URL
            # base_url = os.getenv("FRONTEND_URL", "https://partner.myskillsplus.com")
            referral_url = f"{PARTNER_URL}/ref/{partner.referral_code}/{partner.partner_id}"

            # Generate QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(referral_url)
            qr.make(fit=True)

            # Create QR code image
            img = qr.make_image(fill_color="black", back_color="white")

            # Convert to bytes
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='PNG')
            img_byte_arr.seek(0)

            # Create HTTP response with the image
            response = HttpResponse(img_byte_arr.getvalue(), content_type="image/png")
            response['Content-Disposition'] = f'attachment; filename=referral_qr_{partner.referral_code}.png'
            return response

        except Partner.DoesNotExist:
            raise NotFound("Partner not found")
        except Exception as e:
            return HttpResponse(status=500, content=f"Failed to generate QR code: {str(e)}")

def get_stripe_client():
    """Get configured Stripe client"""
    stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
    return stripe


class InitiateStripeConnectionView(APIView):
    # No authentication required (as per your request)
    # permission_classes = []

    def post(self, request):
        try:
            # Get partner_id from request body
            partner_id = request.data.get("partner_id")
            if not partner_id:
                return JsonResponse({"detail": "partner_id is required."}, status=400)

            # Fetch partner object
            try:
                partner = Partner.objects.get(partner_id=partner_id)
            except Partner.DoesNotExist:
                return JsonResponse({"detail": "Partner not found."}, status=404)

            stripe_client = get_stripe_client()

            # Create Stripe Express account with proper capabilities
            account = stripe_client.Account.create(
                type="express",
                country="US",
                email=partner.email,
                capabilities={
                    "transfers": {"requested": True},
                    "card_payments": {"requested": True}
                },
                business_profile={
                    "product_description": "Digital services and training",
                    "mcc": "7372"  # Business services
                }
            )

            # Create account link for onboarding
            account_link = stripe_client.AccountLink.create(
                account=account.id,
                refresh_url=f"{PARTNER_URL}/partner/stripe/refresh",
                return_url=f"{PARTNER_URL}/partner/dashboard",
                type="account_onboarding",
                collect="currently_due"
            )

            # Update partner with Stripe account ID
            partner.stripe_account_id = account.id
            partner.save()

            return JsonResponse({"onboarding_url": account_link.url}, status=200)

        except stripe.error.StripeError as se:
            raise APIException(detail=f"Stripe account creation failed: {str(se)}", code=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            raise APIException(detail=f"Failed to initiate Stripe connection: {str(e)}", code=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RefreshStripeOnboardingView(APIView):
    permission_classes = []  # remove authentication

    def post(self, request):
        try:
            partner_id = request.data.get("partner_id")
            if not partner_id:
                return JsonResponse({"detail": "partner_id is required."}, status=400)

            try:
                partner = Partner.objects.get(partner_id=partner_id)
            except Partner.DoesNotExist:
                return JsonResponse({"detail": "Partner not found."}, status=404)

            if not partner.stripe_account_id:
                raise APIException(detail="No Stripe account found", code=400)

            stripe_client = get_stripe_client()
            account = stripe_client.Account.retrieve(partner.stripe_account_id)

            # Check if onboarding is already completed
            if account.details_submitted and account.capabilities.get('transfers') == 'active':
                return JsonResponse({"status": "completed", "message": "Account setup is complete"}, status=200)

            # Create a new onboarding link if not completed
            account_link = stripe_client.AccountLink.create(
                account=partner.stripe_account_id,
                refresh_url=f"{PARTNER_URL}/partner/stripe/refresh",
                return_url=f"{PARTNER_URL}/partner/dashboard",
                type="account_onboarding",
                collect="currently_due"
            )

            return JsonResponse({"status": "pending", "onboarding_url": account_link.url}, status=200)

        except Exception as e:
            raise APIException(detail=f"Failed to refresh onboarding: {str(e)}", code=500)

class GetStripeAccountStatusView(APIView):
    # Remove authentication
    # permission_classes = (IsAuthenticated,)

    def get(self, request, partner_id):  # partner_id is now a path parameter
        if not partner_id:
            return JsonResponse({"detail": "partner_id is required."}, status=400)

        try:
            partner = Partner.objects.get(partner_id=partner_id)  # Fetch partner by partner_id
            if not partner.stripe_account_id:
                return JsonResponse({"connected": False, "details_submitted": False, "charges_enabled": False})

            stripe_client = get_stripe_client()
            account = stripe_client.Account.retrieve(partner.stripe_account_id)

            return JsonResponse({
                "connected": True,
                "details_submitted": account.details_submitted,
                "charges_enabled": account.charges_enabled,
                "payouts_enabled": account.payouts_enabled
            }, status=200)

        except Partner.DoesNotExist:
            logger.warning(f"Partner not found for partner_id: {partner_id}")  # Log warning
            return JsonResponse({"detail": "Partner not found"}, status=404)
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error for partner_id {partner_id}: {str(e)}")  # Log Stripe error
            return JsonResponse({"detail": f"Stripe error: {str(e)}"}, status=400)
        except Exception as e:
            logger.error(f"Failed to get account status for partner_id {partner_id}: {str(e)}")  # Log general error
            return JsonResponse({"detail": "Failed to get account status"}, status=500)

def verify_partner_credentials(username, password):
    """Verify partner credentials."""
    if not username:
        return None
    email = username.strip()
    candidates = [email]
    # Form posts may decode '+' as space in the local part of the email
    if " " in email and "@" in email:
        local, domain = email.split("@", 1)
        candidates.append(f"{local.replace(' ', '+')}@{domain}")

    for candidate in dict.fromkeys(candidates):
        try:
            partner = Partner.objects.get(email=candidate)
            if partner.password_hash and check_password(password, partner.password_hash):
                return partner
        except Partner.DoesNotExist:
            continue
    return None

@api_view(['POST'])
def create_payout(request):
    logger.info("Received request to create payout.")
    
    serializer = PayoutCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    payout_data = serializer.validated_data
    partner_id = payout_data['partner_id']
    amount = payout_data['amount']
    notes = payout_data.get('notes', '')

    try:
        partner = Partner.objects.get(partner_id=partner_id)
        logger.info(f"Partner found: {partner_id}")

        if not partner.stripe_account_id:
            logger.warning(f"Partner {partner_id} has not connected their Stripe account.")
            return Response({"detail": "Partner has not connected their Stripe account"}, status=status.HTTP_400_BAD_REQUEST)

        if not validate_stripe_account_capabilities(partner.stripe_account_id):
            logger.warning(f"Partner's Stripe account {partner.stripe_account_id} needs to have transfer capabilities enabled.")
            return Response({"detail": "Partner's Stripe account needs to have transfer capabilities enabled."}, status=status.HTTP_400_BAD_REQUEST)

        amount_cents = int(amount * 100)

        payout = Payout.objects.create(partner=partner_id, amount=amount, notes=notes, status='Pending')
        logger.info(f"Payout record created with ID: {payout.id}")

        try:
            transfer_params = {
                'amount': amount_cents,
                'currency': 'usd',
                'destination': partner.stripe_account_id,
                'metadata': {
                    'partner_id': str(partner_id),
                    'payout_id': str(payout.id),
                    'partner_email': partner.email,
                }
            }

            transfer = stripe.Transfer.create(**transfer_params)
            logger.info(f"Stripe transfer created successfully: {transfer.id}")

            payout.stripe_transfer_id = transfer.id
            payout.status = 'Completed'
            payout.save()

            return Response({"message": "Payout created successfully", "payout_id": payout.id}, status=status.HTTP_201_CREATED)

        except stripe.error.StripeError as stripe_error:
            payout.status = 'Failed'
            payout.notes = f"Stripe error: {str(stripe_error)}"
            payout.save()
            logger.error(f"Payment transfer failed: {str(stripe_error)}")
            return Response({"detail": f"Payment transfer failed: {str(stripe_error)}"}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error(f"Error creating payout: {str(e)}")
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def validate_stripe_account_capabilities(stripe_account_id: str) -> bool:
    try:
        account = stripe.Account.retrieve(stripe_account_id)
        capabilities = account.get('capabilities', {})
        transfers_capability = capabilities.get('transfers')
        return transfers_capability == 'active' and account.get('details_submitted') and account.get('charges_enabled')
    except stripe.error.StripeError as e:
        return False
    except Exception as e:
        return False

class CreatePaymentIntentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Create a Stripe payment intent for user payment"""
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
        print('Stripe Key :', stripe.api_key)

        user_id = request.data.get("user_id")
        amount = request.data.get("amount")

        if amount is None:
            return Response({"detail": "Amount is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            logger.info(f"Creating payment intent for user {user_id}, amount: {amount}")

            intent = stripe.PaymentIntent.create(
                amount=int(float(amount) * 100),
                currency='usd',
                # payment_method_types=['card'],
                metadata={"user_id": str(user_id)},
            )

            logger.info(f"Payment intent created successfully: {intent.id}")
            return Response({
                "clientSecret": intent["client_secret"],
                "paymentIntentId": intent.id
            }, status=status.HTTP_200_OK)

        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {str(e)}")
            return Response({"detail": f"Payment processing error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error creating payment intent: {str(e)}")
            return Response({"detail": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def handle_payment_success(request):
    """Update user payment status and handle referral + admin earnings"""
    
    stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")  # Use env variable in production

    user_id = request.data.get("user_id")
    payment_intent_id = request.data.get("payment_intent_id")
    message_type = request.data.get("message_type")  # 'pbp' or 'pcp'
    job_id = request.data.get("job_id")  # Optional
    contact_id = request.data.get("contact_id")  # Optional

    if not user_id or not payment_intent_id:
        return Response({"detail": "User ID and payment intent ID are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            # Update user status
            user = get_object_or_404(User, individual_profile_id=user_id)
            user.has_paid = True
            user.payment_date = timezone.now()
            user.save()

            # Get payment info from Stripe
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            total_amount = Decimal(intent['amount_received']) / 100  # cents to dollars

            # Admin earnings
            admin_earning = total_amount * Decimal('0.10')
            admin = Admin.objects.first()
            if admin:
                admin.total_earnings += admin_earning
                admin.save()

            # Check if partner_id exists and update partner earnings
            partner_id = user.partner_id
            if partner_id:
                partner = Partner.objects.filter(partner_id=partner_id).first()
                if partner:
                    partner_earning = total_amount * Decimal('0.10')
                    Referral.objects.filter(partner_id=partner_id, referred_email=user.email).update(
                        status='Paid', earnings_amount=partner_earning)
                    Partner.objects.filter(partner_id=partner_id).update(paid_users=F('paid_users') + 1)

            # Check if job_id is provided
            if job_id:
                # Update shortlisted profile status in job
                job_profile = JobProfiles.objects.filter(individual_job_id=job_id).first()
                if job_profile and job_profile.short_listed:
                    try:
                        shortlisted_data = json.loads(job_profile.short_listed)
                        updated = False
                    except json.JSONDecodeError as e:
                        logger.error(f"Failed to decode JSON for job profile: {str(e)}")
                        return Response({"error": "Failed to decode shortlisted profiles."}, status=status.HTTP_400_BAD_REQUEST)

                    for profile in shortlisted_data.get('shortlisted_profiles', []):
                        if str(profile.get('user_id')) == str(user_id):
                            if message_type == 'pbp':
                                profile['pbp_is_paid'] = True
                            elif message_type == 'pcp':
                                profile['pcp_is_paid'] = True

                            updated = True
                            break  # assuming unique user_id per shortlist

                    if updated:
                        job_profile.short_listed = json.dumps(shortlisted_data)
                        job_profile.save()

            # Check if contact_id is provided
            if contact_id:
                # Update the DirectContact model
                direct_contact = DirectContact.objects.filter(contact_id=contact_id).first()
                if direct_contact:
                    # Update the shortlisted_profiles
                    shortlisted_profiles = direct_contact.shortlisted_profiles
                    if message_type == 'pbp':
                        shortlisted_profiles['pbp_is_paid'] = True
                    elif message_type == 'pcp':
                        shortlisted_profiles['pcp_is_paid'] = True

                    direct_contact.shortlisted_profiles = shortlisted_profiles
                    direct_contact.save()

            return Response({
                "message": "Payment processed successfully.",
                "user_id": user.individual_profile_id,
                "payment_amount": str(total_amount),
                "admin_earning": str(admin_earning),
                "has_paid": True
            }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error processing payment: {str(e)}")
        return Response({"detail": f"Payment processing failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_individual_profile_details(request, individual_profile_id):
    try:
        # Get the user by individual_profile_id
        user = User.objects.get(individual_profile_id=individual_profile_id)
        vsp_details = user.vsp_details.copy() if hasattr(user.vsp_details, 'copy') else dict(user.vsp_details)
        # Remove sensitive fields
        vsp_details.pop('name', None)
        vsp_details.pop('email', None)
        workpreference = user.workpreference

        individual_assessment = IndividualAssessment.objects.filter(individual_profile_id=individual_profile_id).first()

        # Get all skills for this user
        skills = Skill.objects.filter(user_id=user.id)
        skill_list = []
        for skill in skills:
            skill_list.append({
                'id': skill.id,
                'isot_path_addr': getattr(skill, 'isot_path_addr', None),
                'ratings': getattr(skill, 'ratings', None),
                'tags': getattr(skill, 'tags', None),
                'created_at': skill.created_at,
                'updated_at': skill.updated_at,
            })

        # Get SkillProfile and use profilers.utills.skill_data
        from profilers.models import SkillProfile
        from profilers.utills import skill_data
        profile = SkillProfile.objects.filter(user=user).first()
        skills_profile = skill_data(profile) if profile else []

        return Response({
            'individual_profile_id': individual_profile_id,
            'vsp_details': vsp_details,
            'workpreference': workpreference,
            'score': individual_assessment.credibility_score if individual_assessment else None,
            'skills_profile': skills_profile
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(["GET"])
# @permission_classes([IsAuthenticated])
def search_skills(request):
    skill_name = request.GET.get("q")
    if not skill_name:
        return JsonResponse({"error": "Skill name is required."}, status=400)

    search_url = f"https://lambdaapi.iysskillstech.com/latest/dev-api/"
    params = {"q": skill_name, "limit": 10}

    try:
        response = requests.get(search_url, params=params)
        response.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)

        search_data = response.json()
        results = []

        for match in search_data.get("matches", []):
            for skill in match.get("skills", []):
                path_addr = skill.get("path_addr")
                skill_instance = Skill.objects.filter(isot_path_addr=path_addr).first()
                if skill_instance:
                    user_id = skill_instance.user_id
                    user_profile = User.objects.filter(id=user_id).first()
                    if user_profile:
                        results.append({
                            "skill_name": skill.get("name"),
                            "path_addr": path_addr,
                            "individual_profile_id": user_profile.individual_profile_id
                        })

        return JsonResponse({"skills": results}, safe=False)

    except requests.exceptions.RequestException as e:
        logger.error(f"Request to external API failed: {str(e)}")
        return JsonResponse({"error": "Failed to fetch skills from external API."}, status=500)
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return JsonResponse({"error": "An internal error occurred."}, status=500)

@api_view(['POST'])
# @permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def save_direct_contact(request):
    # Extract user_id, contact_id, and contactDetails from the request
    user_id = request.data.get('user_id')  # Get user_id from the request
    contact_id = request.data.get('contact_id')  # Get contact_id from the request
    contact_details = request.data.get('contactDetails')  # Get contactDetails from the request

    if contact_id is None or user_id is None or contact_details is None:
        return Response({"error": "user_id, contact_id, and contactDetails are required."}, status=status.HTTP_400_BAD_REQUEST)

    # Extract details from contact_details
    vsp_details = contact_details.get('vsp_details')
    # skill_details = contact_details.get('skill_details')

    # Create a new DirectContact instance
    direct_contact = DirectContact(contact_id=contact_id, recruiter_id=user_id, shortlisted_profiles={
        "vsp_details": vsp_details,
        "pbp_is_paid": False,
        "pbp_msg_status":'null',
        "pcp_is_paid": False,
        "pcp_msg_status": 'null'
        # "skill_details": skill_details
    })
    direct_contact.save()

    serializer = DirectContactSerializer(direct_contact)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def get_direct_contacts(request, recruiter_id):
    try:
        # Fetch contacts for the given recruiter_id
        contacts = DirectContact.objects.filter(recruiter_id=recruiter_id)
        
        # Serialize the contacts
        serializer = DirectContactSerializer(contacts, many=True)

        # Format the response to match the desired structure
        response_data = [{"direct_contacts": contact} for contact in serializer.data]

        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        # return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
          return Response([])

# Get Wallet
class WalletView(generics.RetrieveAPIView):
    serializer_class = WalletSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Get or create the wallet for the authenticated user
        wallet, created = Wallet.objects.get_or_create(user=self.request.user)
        logger.info(f"Wallet {'created' if created else 'retrieved'} for user: {self.request.user.id}")
        # Update credits for the wallet
        wallet.update_credits()
        return wallet
    
# Wallet Transactions
class WalletTransactionsView(generics.ListAPIView):
    serializer_class = WalletTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get or create the wallet for the authenticated user
        wallet, _ = Wallet.objects.get_or_create(user=self.request.user)
        # Return the wallet transactions ordered by creation date
        return wallet.transactions.all().order_by("-created_at")

# Stripe Payment
class StripePaymentView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get("amount")
        currency = request.data.get("currency", "USD")

        if not amount:
            return Response({"error": "Amount required"}, status=status.HTTP_400_BAD_REQUEST)

        stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")

        try:
            # Create a checkout session with Stripe
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': currency.lower(),
                        'product_data': {'name': 'Wallet Top-up'},
                        'unit_amount': int(float(amount) * 100),  # Convert to cents
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=os.getenv("JOB_URL") + '/wallet?success=true',
                cancel_url=os.getenv("JOB_URL") + '/wallet?canceled=true',
            )

            # Get or create the wallet for the authenticated user
            wallet, _ = Wallet.objects.get_or_create(user=request.user)
            credits = float(amount) / Wallet.CREDIT_RATE  # Calculate credits based on the amount

            # Create a wallet transaction
            WalletTransaction.objects.create(
                indvidual_profile_id=wallet.individual_profile_id,
                wallet=wallet,
                transaction_type="CREDIT",
                amount=amount,
                credits=credits,
                currency=currency,
                status="PENDING",
                payment_gateway="Stripe",
                gateway_transaction_id=checkout_session.id
            )

            # Update user payment info
            request.user.payment_id = checkout_session.id
            request.user.paid_amount = amount
            request.user.is_payment_complete = False
            request.user.has_paid = True
            request.user.save()

            return Response({"checkout_url": checkout_session.url})

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Razorpay Payment
class RazorpayPaymentView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get("amount")
        currency = request.data.get("currency", "INR")
        individual_profile_id = request.data.get("individual_profile_id")  # Get the individual_profile_id from the request

        if not amount:
            return Response({"error": "Amount required"}, status=status.HTTP_400_BAD_REQUEST)

        client = razorpay.Client(auth=("rzp_live_kSLiMLsF1i5qo5", "N550BOxyq1fkGghWPVtALW0I"))

        try:
            # Create an order with Razorpay
            order = client.order.create({
                "amount": int(float(amount) * 100),  # Convert to cents
                "currency": currency,
                "payment_capture": 1
            })

            # Get or create the wallet for the authenticated user
            wallet, created = Wallet.objects.get_or_create(user=request.user)
            wallet.individual_profile_id = individual_profile_id  # Set the individual_profile_id
            wallet.save()  # Save the wallet to update the individual_profile_id

            credits = float(amount) / Wallet.CREDIT_RATE  # Calculate credits based on the amount

            # Create a wallet transaction
            WalletTransaction.objects.create(
                individual_profile_id=individual_profile_id,  
                wallet=wallet,
                transaction_type="CREDIT",
                amount=amount,
                credits=credits,
                currency=currency,
                status="PENDING",
                payment_gateway="Razorpay",
                gateway_transaction_id=order["id"]
            )

            # Update user payment info
            request.user.payment_id = order["id"]
            request.user.paid_amount = amount
            request.user.is_payment_complete = False
            request.user.has_paid = True
            request.user.save()

            return Response(order)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Use Credits
class UseCreditsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        credits = request.data.get("credits")

        if not credits:
            return Response({"error": "Credits required"}, status=status.HTTP_400_BAD_REQUEST)

        # Get or create the wallet for the authenticated user
        wallet, _ = Wallet.objects.get_or_create(user=request.user)

        # Attempt to debit the credits from the wallet
        if wallet.debit(float(credits)):
            # Create a wallet transaction for the debit
            WalletTransaction.objects.create(
                individual_profile_id=request.data.get("individual_profile_id"),
                wallet=wallet,
                transaction_type="DEBIT",
                amount=float(credits) * Wallet.CREDIT_RATE,  # Calculate the amount based on the credit rate
                credits=credits,
                currency=wallet.currency,
                status="SUCCESS",
                payment_gateway="Wallet"
            )
            return Response({"message": f"{credits} credits deducted successfully"})

        return Response({"error": "Insufficient balance"}, status=status.HTTP_400_BAD_REQUEST)

# Verify Razorpay Payment
@api_view(['POST'])
def verify_razorpay_payment(request):
    """Verify the payment made through Razorpay and update wallet."""
    individual_profile_id = request.data.get("individual_profile_id")
    razorpay_order_id = request.data.get("razorpay_order_id")
    razorpay_payment_id = request.data.get("razorpay_payment_id")
    razorpay_signature = request.data.get("razorpay_signature")

    if not all([individual_profile_id, razorpay_order_id, razorpay_payment_id, razorpay_signature]):
        return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Razorpay client
        client = razorpay.Client(auth=("rzp_live_kSLiMLsF1i5qo5", "N550BOxyq1fkGghWPVtALW0I"))

        # Verify signature
        client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        })

        # Find transaction linked to order
        wallet_transaction = WalletTransaction.objects.filter(
            gateway_transaction_id=razorpay_order_id,
            status="PENDING"
        ).first()

        if not wallet_transaction:
            return Response({"error": "Transaction not found or already processed."},
                            status=status.HTTP_404_NOT_FOUND)

        # ✅ Mark transaction as successful
        wallet_transaction.status = "SUCCESS"
        wallet_transaction.gateway_transaction_id = razorpay_payment_id
        wallet_transaction.save()

        # ✅ Update Wallet balance
        wallet = get_object_or_404(Wallet, user=wallet_transaction.wallet.user)

        wallet.credit(wallet_transaction.amount)  # uses credit() method
        wallet.individual_profile_id = individual_profile_id
        wallet.save()

        return Response({
            "success": True,
            "message": "Payment verified and wallet credited.",
            "wallet_balance": wallet.balance,
            "wallet_credits": wallet.credits
        })

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)





