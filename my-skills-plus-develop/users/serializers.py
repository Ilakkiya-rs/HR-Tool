from rest_framework import serializers
from .models import User, VerificationToken, Partner, Admin, Referral, Payout, DashboardSummary, VerificationCode, BlacklistedToken, PasswordResetToken, DirectContact
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.urls import reverse
from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from django.contrib.auth.hashers import make_password, check_password
import logging
import string
import random
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate, get_user_model
import os
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from users.email_service import EmailService

FRONTEND_URL = os.getenv("FRONTEND_URL")
PARTNER_URL = os.getenv("PARTNER_URL")
API_URL = os.getenv("API_URL")

logger = logging.getLogger(__name__)

class CreateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    phone_number = serializers.CharField(max_length=15, required=False)  # Make this optional
    partner_id = serializers.UUIDField(required=False, allow_null=True)
    referral_code = serializers.CharField(max_length=255, required=False, allow_blank=True)
    type = serializers.CharField(max_length=50, required=False, allow_blank=True)
    current_experience_level = serializers.JSONField(required=False)

    class Meta:
        model = User
        fields = (
            "password",
            "email",
            "first_name",
            "last_name",
            "phone_number",  # This is now optional
            "partner_id",
            "referral_code",
            "type",
            "current_experience_level",
        )
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def create(self, validated_data):
        # Generate a 10-character alphanumeric string for individual_profile_id
        def generate_alphanumeric_id(length=10):
            return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

        current_experience_level = validated_data.pop('current_experience_level', None)

        # Create the user instance
        user = User.objects.create(
            username=validated_data["email"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            phone_number=validated_data.get("phone_number"),  # This can be None if not provided
            partner_id=validated_data.get("partner_id"),
            referral_code=validated_data.get("referral_code"),
            type=validated_data.get("type"),
            individual_profile_id=generate_alphanumeric_id(),  # Set only on creation
            current_experience_level=current_experience_level if current_experience_level is not None else {},
        )

        user.set_password(validated_data["password"])
        user.save()

        email_service = EmailService()
        if user.type == 'user':
            email_service.send_registration_alert_user(user)
        elif user.type == 'recruiter':
            email_service.send_registration_alert_recruiter(user)
        
        # Create a Referral instance if referral_code is provided
        if validated_data.get("referral_code"):
            partner_id = validated_data.get("partner_id")
            partner = None

            # Fetch the Partner instance if partner_id is provided
            if partner_id:
                try:
                    partner = Partner.objects.get(partner_id=partner_id)
                except Partner.DoesNotExist:
                    # Handle the case where the partner does not exist
                    logger.warning(f"Partner with ID {partner_id} does not exist.")
                    # You can choose to raise an error or skip creating the referral
                    # raise ValueError("Partner does not exist.")

            # Create the Referral instance
            Referral.objects.create(
                partner=partner,  # Assign the Partner instance
                referred_email=user.email,
                status='Signed Up',
                referral_date=user.date_joined,  # Use the user's join date
            )

        send_verification_email(user)

        return user
    
def send_verification_email(user):
    token, created = VerificationToken.objects.get_or_create(user=user)
    # current_site = 'api.myskillsplus.com'
    verification_link = reverse('users:verify_email', kwargs={'token': token.token})
    verification_url = f"{API_URL}{verification_link}"

    subject = 'Verify your email - My Skills Plus'
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Verify your email - My Skills Plus</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 50px auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                text-align: center;
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
        <div class="container">
            <h1>Welcome to My Skills Plus</h1>
            <p>Please click on the button below to set up your account and start using My Skills Plus.</p>
            <p>
                <a href="{verification_url}" class="button">Activate Now</a>
            </p>
            <br>
            <p>Best wishes,</p>
            <p>My Skills Plus team</p>
        </div>
    </body>
    </html>
    """
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives(
        subject, text_content, settings.DEFAULT_FROM_EMAIL, [user.email]
    )
    email.attach_alternative(html_content, "text/html")
    email.send() 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "verified",
            "is_payment_complete",
            "paid_amount",
            "paid_for",
            "details",
            "workpreference",
            "vsp_details",
            "individual_profile_id",
            "current_experience_level"
        )



class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email','payment_id', 'is_payment_complete', 'paid_amount', 'paid_for', 'individual_profile_id')

class ForgetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    new_password = serializers.CharField(write_only=True, required=True, min_length=6)

class SampleSkillSerializer(serializers.Serializer):
    skill_data = serializers.CharField(max_length=10000)

    class Meta:
        fields = ['skill_data'] 

class PartnerCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    preferred_referral_code = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Partner
        fields = [
            "name",
            "email",
            "phone",
            "partner_type",
            "other_partner_type",
            "channel_name",
            "website_link",
            "bio",
            "country",
            "referred_by",
            "password",
            "preferred_referral_code",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        preferred_referral_code = validated_data.pop("preferred_referral_code", None)
        partner = Partner(**validated_data)
        partner.password_hash = make_password(password)
        # Set referral_code
        import uuid
        partner.referral_code = preferred_referral_code or str(uuid.uuid4())[:12]
        partner.save()
        return partner

class PartnerUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = [
            "name",
            "phone",
            "channel_name",
            "other_partner_type",
            "website_link",
            "bio",
            "country",
        ]

class PartnerOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = [
            "partner_id",
            "name",
            "email",
            "phone",
            "partner_type",
            "other_partner_type",
            "channel_name",
            "website_link",
            "bio",
            "country",
            "referred_by",
            "referral_code",
            "stripe_account_id",
            "logo_url",
            "is_active",
            "email_verified",
            "status",
            "created_at",
            "updated_at",
        ]

class PartnerWithLogoOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = [
            "partner_id",
            "referral_code",
            "stripe_account_id",
            "is_active",
            "email_verified",
            "status",
            "logo_url",
            "created_at",
            "updated_at",
        ]

class DashboardSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardSummary
        fields = [
            "total_signups",
            "active_paying_users",
            "total_earnings",
            "available_for_payout",
            "referral_link",
            "partner_name",
            "partner_type",
        ]

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = [
            "admin_id",
            "username",
            "password_hash",
            "is_active",
            "created_at",
        ]

class ReferralOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Referral
        fields = [
            "referral_id",
            "partner",
            "referred_email",
            "referral_date",
            "status",
            "earnings_amount",
        ]

class PayoutOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payout
        fields = [
            "payout_id",
            "partner",
            "amount",
            "payout_date",
            "status",
            "notes",
            "stripe_transfer_id",
            "updated_at",
        ]

class PayoutCreateSerializer(serializers.Serializer):
    partner_id = serializers.UUIDField(required=True)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    notes = serializers.CharField(required=False, allow_blank=True)

class PayoutStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payout
        fields = [
            "status",
            "notes",
        ]

class PayoutAdminOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payout
        fields = [
            "payout_id",
            "payout_date",
            "amount",
            "status",
            "notes",
            "stripe_transfer_id",
            "updated_at",
        ]

class VerificationCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationCode
        fields = "__all__"

class BlacklistedTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlacklistedToken
        fields = "__all__"

class PasswordResetTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordResetToken
        fields = "__all__"

class PartnerRejectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ["rejection_reason"]

class AdminLoginRequestSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class AdminLoginResponseSerializer(serializers.Serializer):
    access_token = serializers.CharField()
    token_type = serializers.CharField(default="bearer")

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)  # You can adjust the minimum length as needed

class LoginResponse(serializers.Serializer):
    access_token = serializers.CharField()
    token_type = serializers.CharField(default="bearer")





class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)
    type = serializers.CharField(required=True)
    redirect = serializers.BooleanField(required=True)
    current_experience_level = serializers.JSONField(required=False)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        user_type = attrs.get('type')
        redirect = attrs.get('redirect')
        current_experience_level = attrs.get('current_experience_level', None)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError('No active account found with the given credentials')

        if not check_password(password, user.password):
            raise serializers.ValidationError('Incorrect password')

        if user.type != user_type:
            raise serializers.ValidationError('User type does not match')

        if not user.is_active:
            raise serializers.ValidationError('User account is disabled')

        # Update current_experience_level if provided
        if current_experience_level is not None:
            user.current_experience_level = current_experience_level
            user.save(update_fields=['current_experience_level'])

        # Superclass expects username field
        attrs['username'] = username

        data = super().validate(attrs)
        data['user_type'] = user.type  # Optional: include custom info
        # data['current_experience_level'] = user.current_experience_level if hasattr(user, 'current_experience_level') else None
        return data

class DirectContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = DirectContact
        fields = ['contact_id', 'recruiter_id', 'shortlisted_profiles']


from rest_framework import serializers
from .models import Wallet, WalletTransaction


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ["id","individual_profile_id", "balance", "credits", "currency", "created_at", "updated_at"]


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = [
            "id", "individual_profile_id", "transaction_type", "amount", "credits", "currency", "status",
            "payment_gateway", "gateway_transaction_id", "created_at"
        ]
