from django.urls import path
from django.views.generic import TemplateView
from rest_framework.decorators import api_view

from users.views import UserView, reject_partner, get_individual_profile_details
from .views import (
    verify_email,
    UserSignUpView,
    ResendVerificationEmailView,
    PaymentVerificationView,
    ForgetPasswordView,
    SampleSkillDetailView,
    SampleSkillDetailedView,
    SaveUserDetailsView,
    GetUserDetailsView,
    submit_work_preference,
    get_work_preference,
    submit_vsp_details,
    get_vsp_details,
    google_login,
    find_matching_profiles,
    RegisterPartnerView,
    DashboardSummaryView,
    ReferralListView,
    PayoutListView,
    PartnerProfileView,
    UpdatePartnerSettingsView,
    DeleteAccountView,
    AdminLoginView,
    admin_logout,
    get_all_partners,
    partner_login,
    VerifyEmailView,
    PasswordResetConfirmView,
    LogoutView,
    # UploadLogoView,
    HandleReferralLinkView,
    TrackReferralSignupView,
    ReferralQRCodeView,
    InitiateStripeConnectionView,
    RefreshStripeOnboardingView,
    GetStripeAccountStatusView,
    approve_partner,
    PasswordResetView,
    create_payout,
    CreatePaymentIntentView,
    handle_payment_success,
    CustomTokenObtainPairView,
    search_skills,  # Import the new view
    save_direct_contact,
    get_direct_contacts,
    WalletView, WalletTransactionsView,
    StripePaymentView, RazorpayPaymentView, UseCreditsView,
    verify_razorpay_payment  # Import the new verification view
)

app_name = "users"

urlpatterns = [
    # User detail view
    path("me/", UserView.as_view(), name="user_view"),
    # User signup view
    path('signup/', UserSignUpView.as_view(), name='signup'),
    # Email verification view
    path('verify-email/<uuid:token>/', verify_email, name='verify_email'),
    # Resend verification email view
    path('api/resend-verification-email/', ResendVerificationEmailView.as_view(), name='resend_verification_email'),
    # Payment verification view
    path('api/verify-payment/', PaymentVerificationView.as_view(), name='verify_payment'),
    # Forget password view
    path('api/forget-password/', ForgetPasswordView.as_view(), name='forget_password'),
    # Sample skill detail view
    path('api/sampleskills/', SampleSkillDetailView.as_view(), name='sample_skills'),
    path('api/sampleskills-details/', SampleSkillDetailedView.as_view(), name='sample_skills_details'),
    path('save-details/', SaveUserDetailsView.as_view(), name='save-user-details'),
    path('get-details/', GetUserDetailsView.as_view(), name='get-user-details'),
    path('submit-work-preference/', submit_work_preference, name='submit_work_preference'),
    path('get-work-preference/', get_work_preference, name='get_work_preference'),
    path('submit-vsp-details/', submit_vsp_details, name='submit_vsp_details'),
    path('vsp-details/', get_vsp_details, name='get_vsp_details'),
    path('auth/google/', google_login, name='google_login'),
    path('api/find-matching-profiles/', find_matching_profiles, name='find_matching_profiles'),
    path('partner/register/', RegisterPartnerView.as_view(), name='register_partner'),
    path('partner/dashboard-summary/<uuid:partner_id>/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('partner/referrals/<uuid:partner_id>/', ReferralListView.as_view(), name='referral-list'),
    path('partner/payouts/<uuid:partner_id>/', PayoutListView.as_view(), name='payout-list'),
    path('partner/profile/<uuid:partner_id>/', PartnerProfileView.as_view(), name='partner-profile'),
    path('partner/settings/update/<uuid:partner_id>/', UpdatePartnerSettingsView.as_view(), name='update-partner-settings'),
    path('partner/delete-account/', DeleteAccountView.as_view(), name='delete-account'),
    path('admin/login/', AdminLoginView.as_view(), name='admin_login'),
    path('admin/logout/', admin_logout, name='admin_logout'),
    path('admin/partners/', get_all_partners, name='get_all_partners'),
    path('admin/partners/<uuid:partner_id>/approve/', approve_partner, name='approve_partner'),
    path('admin/partners/<uuid:partner_id>/reject/', reject_partner, name='reject_partner'),
    path('partner/login/', partner_login, name='partner_login'),
    path('partner/verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('partner/reset-password/confirm/', PasswordResetConfirmView.as_view(), name='confirm_password_reset'),
    path('partner/logout/', LogoutView.as_view(), name='logout'),
    # path('partner/files/upload-logo/<uuid:partner_id>/', UploadLogoView.as_view(), name='upload_logo'),
    path('ref/<str:referral_code>/', HandleReferralLinkView.as_view(), name='handle_referral'),
    path('ref/track-signup/', TrackReferralSignupView.as_view(), name='track_referral_signup'),
    path('partner/referral-qr-code/<uuid:partner_id>/', ReferralQRCodeView.as_view(), name='referral-qr-code'),
    path('stripe/connect-initiate/', InitiateStripeConnectionView.as_view(), name='stripe-connect-initiate'),
    path('stripe/refresh/', RefreshStripeOnboardingView.as_view(), name='stripe-refresh'),
    path('stripe/account-status/<uuid:partner_id>/', GetStripeAccountStatusView.as_view(), name='stripe-account-status'),
    path('partner/reset-password/', PasswordResetView.as_view(), name='reset_password'),
    path('admin/payouts/', create_payout, name='create_payout'),
    path('create-payment-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('handle-payment-success/', handle_payment_success, name='handle-payment-success'),
    path('individual-profile-details/<individual_profile_id>/', get_individual_profile_details, name='individual_profile_details'),
    path('api/custom-token/login/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
    path('api/search-skills/', search_skills, name='search_skills'),  # Add this line
    path('api/save-direct-contact/', save_direct_contact, name='save_direct_contact'),
    path('api/get-direct-contacts/<str:recruiter_id>/', get_direct_contacts, name='get_direct_contacts'),
    path("wallet/", WalletView.as_view(), name="wallet"),
    path("wallet/transactions/", WalletTransactionsView.as_view(), name="wallet-transactions"),
    path("wallet/stripe/", StripePaymentView.as_view(), name="wallet-stripe"),
    path("wallet/razorpay/", RazorpayPaymentView.as_view(), name="wallet-razorpay"),
    path("wallet/use-credits/", UseCreditsView.as_view(), name="wallet-use-credits"),  # Add this line
    path("wallet/razorpay/verify/", verify_razorpay_payment, name="verify-razorpay-payment"),  # Add this line
]
