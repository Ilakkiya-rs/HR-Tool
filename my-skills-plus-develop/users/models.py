from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
import uuid
from django.conf import settings
from uuid import UUID
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta

class User(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    verified = models.BooleanField(default=False)
    payment_id = models.CharField(max_length=255, blank=True, null=True)
    is_payment_complete = models.BooleanField(default=False)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    paid_for = models.JSONField(default=list)
    details = models.JSONField(default=dict)
    workpreference = models.JSONField(default=dict)
    vsp_details = models.JSONField(default=dict)
    has_paid = models.BooleanField(default=False)
    partner_id = models.UUIDField(null=True, blank=True)
    referral_code = models.CharField(max_length=255, null=True, blank=True)
    type = models.CharField(max_length=100, null=True, blank=True)
    earning_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    individual_profile_id = models.CharField(null=True, blank=True, max_length=20)
    current_experience_level = models.JSONField(default=dict, null=True, blank=True)

    def __str__(self):
        return self.username

    def get_user_profile_link(self):
        return f"https://ui-avatars.com/api/?name={self.first_name}+{self.last_name}&size=128&bold=true&background=random"

class VerificationToken(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Partner(models.Model):
    PARTNER_TYPE_CHOICES = [
        ('Training Provider', 'Training Provider'),
        ('Recruitment Services', 'Recruitment Services'),
        ('University / Campus', 'University / Campus'),
        ('HR Consultant', 'HR Consultant'),
        ('Others', 'Others'),
    ]
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    partner_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.TextField()
    email = models.EmailField(unique=True)
    phone = models.TextField(blank=True, null=True)
    password_hash = models.TextField(blank=True, null=True)
    partner_type = models.CharField(max_length=32, choices=PARTNER_TYPE_CHOICES)
    other_partner_type = models.TextField(blank=True, null=True)
    channel_name = models.TextField(blank=True, null=True)
    website_link = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    country = models.TextField(blank=True, null=True)
    referred_by = models.TextField(blank=True, null=True)
    referral_code = models.CharField(max_length=12, unique=True, blank=True, null=True)
    stripe_account_id = models.TextField(blank=True, null=True)
    logo_url = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    status = models.CharField(max_length=8, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_users = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class PartnerWithLogo(models.Model):
    partner = models.OneToOneField(Partner, on_delete=models.CASCADE, related_name='with_logo', blank=True, null=True)
    referral_code = models.CharField(max_length=255)
    stripe_account_id = models.CharField(max_length=255, blank=True, null=True)
    logo_url = models.URLField(blank=True, null=True)

class DashboardSummary(models.Model):
    total_signups = models.IntegerField()
    active_paying_users = models.IntegerField()
    total_earnings = models.DecimalField(max_digits=10, decimal_places=2)
    available_for_payout = models.DecimalField(max_digits=10, decimal_places=2)
    referral_link = models.URLField()
    partner_name = models.CharField(max_length=255)
    partner_type = models.CharField(max_length=32, choices=Partner.PARTNER_TYPE_CHOICES)

class Admin(models.Model):
    admin_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.TextField(unique=True)
    password_hash = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    total_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)


class Referral(models.Model):
    STATUS_CHOICES = [
        ('Signed Up', 'Signed Up'),
        ('Paid', 'Paid'),
    ]
    referral_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    partner = models.ForeignKey(Partner, on_delete=models.CASCADE, blank=True, null=True)
    referred_email = models.EmailField()
    referral_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES)
    earnings_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

class Payout(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
        ('Manual', 'Manual'),
        ('Cancelled', 'Cancelled'),
    ]
    payout_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    partner = models.ForeignKey(Partner, on_delete=models.CASCADE, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payout_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='Pending')
    notes = models.TextField(blank=True, null=True)
    stripe_transfer_id = models.CharField(max_length=255, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

class EmailVerificationCode(models.Model):
    code_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    partner = models.ForeignKey(Partner, on_delete=models.CASCADE, blank=True, null=True)
    email = models.EmailField()
    code = models.TextField()
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return self.expires_at > timezone.now()

class BlacklistedToken(models.Model):
    token_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    token = models.TextField(unique=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return self.token

class PasswordResetToken(models.Model):
    token_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    partner = models.ForeignKey(Partner, on_delete=models.CASCADE, blank=True, null=True)
    token = models.TextField()
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class PayoutAdmin(models.Model):
    payout = models.OneToOneField(Payout, on_delete=models.CASCADE, related_name='admin_out')
    stripe_transfer_id = models.CharField(max_length=255, blank=True, null=True)

class PartnerRejection(models.Model):
    partner = models.ForeignKey(Partner, on_delete=models.CASCADE, related_name='rejections', blank=True, null=True)
    rejection_reason = models.TextField()

class VerificationCode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    partner = models.ForeignKey(Partner, on_delete=models.CASCADE, blank=True, null=True) 
    email = models.EmailField()
    code = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Verification code for {self.email}"

    def is_valid(self):
        return self.expires_at > timezone.now()

class DirectContact(models.Model):
    contact_id = models.CharField(max_length=100, primary_key=True)  # Use IntegerField to accept contact_id from the request
    recruiter_id = models.CharField(max_length=255, blank=True, null=True)  # Assuming User is the recruiter model
    shortlisted_profiles = models.JSONField()  # Store shortlisted profiles as JSON

    def __str__(self):
        return f"Contact ID: {self.contact_id}, Recruiter ID: {self.recruiter_id}"



from django.db import models
from django.conf import settings
import uuid


class Wallet(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wallet")
    individual_profile_id = models.CharField(max_length=255, null=True, blank=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # stores actual money
    credits = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # derived from balance
    currency = models.CharField(max_length=10, default="INR")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # 1 credit = X currency units
    CREDIT_RATE = 100  

    def update_credits(self):
        """Sync credits with balance"""
        self.credits = self.balance / self.CREDIT_RATE
        self.save()

    def credit(self, amount):
        """Add money to wallet"""
        self.balance += amount
        self.update_credits()
        # 🔹 Sync user model
        self.user.paid_amount += amount
        self.user.is_payment_complete = True
        self.user.has_paid = True
        self.user.save()

    def debit(self, credits):
        """Deduct credits (convert to amount internally)"""
        required_amount = credits * self.CREDIT_RATE
        if self.balance >= required_amount:
            self.balance -= required_amount
            self.update_credits()
            return True
        return False

    def __str__(self):
        return f"{self.user.username} - {self.credits} credits"


class WalletTransaction(models.Model):
    TRANSACTION_TYPES = (
        ("CREDIT", "Credit"),
        ("DEBIT", "Debit"),
    )
    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    individual_profile_id = models.CharField(max_length=255, null=True, blank=True)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="transactions")
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)   # money
    credits = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # locked credits at txn time
    currency = models.CharField(max_length=10)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")
    payment_gateway = models.CharField(max_length=20, null=True, blank=True)  # Stripe/Razorpay
    gateway_transaction_id = models.CharField(max_length=200, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.wallet.user.username} - {self.credits} credits ({self.status})"


