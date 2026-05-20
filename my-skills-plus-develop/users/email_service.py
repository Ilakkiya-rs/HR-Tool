import os
from typing import Dict
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import logging
from django.conf import settings
from django.core.mail import send_mail
import json

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

FRONTEND_URL = os.getenv("FRONTEND_URL")
PARTNER_URL = os.getenv("PARTNER_URL")
API_URL = os.getenv("API_URL")

class EmailService:
    def __init__(self):
        self.smtp_username = settings.EMAIL_HOST_USER
        self.smtp_password = settings.EMAIL_HOST_PASSWORD
        self.from_email = settings.DEFAULT_FROM_EMAIL or settings.EMAIL_HOST_USER
        self.smtp_server = settings.EMAIL_HOST
        self.smtp_port = settings.EMAIL_PORT

    def _send_email(self, to_email: str, subject: str, body: str):
        """Send email using SMTP"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.from_email
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'html'))

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            # Optionally, re-raise or handle as needed

    def send_registration_confirmation_email(self, partner: Dict):
        subject = "Thank You for Registering with MySkillsPlus Partner Program"
        body = f"""
        <html>
        <body>
            <h2>Welcome {partner['name']}!</h2>
            <p>Thank you for registering to become a MySkillsPlus Partner.</p>
            <p>Your registration is currently under review. Our team will review your application within 2-3 business days.</p>
            <p>Once approved, you will receive an activation email with further instructions.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <br>
            <p>Best regards,</p>
            <p>The MySkillsPlus Team</p>
        </body>
        </html>
        """
        self._send_email(partner['email'], subject, body)

    def send_admin_notification_email(self, partner: Dict):
        admin_email = os.getenv("ADMIN_EMAIL")
        if not admin_email:
            logger.warning("Admin email not configured")
            return
        subject = f"New Partner Registration - {partner['name']}"
        body = f"""
        <html>
        <body>
            <h2>New Partner Registration</h2>
            <p>A new partner has registered and needs review:</p>
            <ul>
                <li>Name: {partner['name']}</li>
                <li>Email: {partner['email']}</li>
                <li>Partner Type: {partner['partner_type']}</li>
                <li>Channel Name: {partner.get('channel_name', 'N/A')}</li>
            </ul>
            <p>Please review and approve/reject in the admin dashboard.</p>
        </body>
        </html>
        """
        self._send_email(admin_email, subject, body)

    def send_activation_email(self, partner: Dict, verification_code: str):
        # frontend_url = os.getenv("FRONTEND_URL", "https://partner.myskillsplus.com")
        subject = "Activate Your MySkillsPlus Partner Account"
        body = f"""
        <html>
        <body>
            <h2>Congratulations {partner['name']}!</h2>
            <p>Your partner application has been approved!</p>
            <p>To activate your account, please use the following verification code:</p>
            <h3 style=\"background-color: #f5f5f5; padding: 10px; text-align: center;\">{verification_code}</h3>
            <p>You can enter this code at: {PARTNER_URL}/partner/verify-email</p>
            <p>This code will expire in 24 hours.</p>
            <p>After activation, you can log in using your email and password.</p>
            <br>
            <p>Best regards,</p>
            <p>The MySkillsPlus Team</p>
        </body>
        </html>
        """
        self._send_email(partner['email'], subject, body)

    def send_rejection_email(self, partner: Dict):
        subject = "MySkillsPlus Partner Application Status"
        body = f"""
        <html>
        <body>
            <h2>Dear {partner['name']},</h2>
            <p>Thank you for your interest in becoming a MySkillsPlus Partner.</p>
            <p>After careful review of your application, we regret to inform you that we cannot approve your partnership request at this time.</p>
            <p>If you believe this was in error or would like to provide additional information, please contact our support team.</p>
            <br>
            <p>Best regards,</p>
            <p>The MySkillsPlus Team</p>
        </body>
        </html>
        """
        self._send_email(partner['email'], subject, body)

    def send_password_reset_email(self, email: str, reset_token: str):
        logger.info(f"Preparing to send password reset email to: {email}")  # Log the email address

        # frontend_url = os.getenv("FRONTEND_URL", "https://partner.myskillsplus.com/")
        reset_link = f"{PARTNER_URL}/partner/reset-password?token={reset_token}"
        subject = "Reset Your MySkillsPlus Partner Password"
        body = f"""
        <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your MySkillsPlus Partner account password.</p>
            <p>To reset your password, click the link below:</p>
            <p><a href=\"{reset_link}\">Reset Password</a></p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
            <br>
            <p>Best regards,</p>
            <p>The MySkillsPlus Team</p>
        </body>
        </html>
        """

        try:
            self._send_email(email, subject, body)  # Assuming this method sends the email
            logger.info(f"Password reset email sent successfully to: {email}")  # Log success
        except Exception as e:
            logger.error(f"Failed to send password reset email to {email}: {str(e)}")  # Log error

    def send_pbp_request_notification(self, user_email: str, user_name: str):
        subject = "Personal Background Profile (PBP) Request"
        body = f"""
        <html>
        <body>
            <h2>Dear {user_name},</h2>
            <p>You have received a request for PBP View sharing.</p>
            <p>Kindly check your MySkillsPlus portal and respond.</p>
            <p>Click here - <a href='{FRONTEND_URL}/auth/signin'>{FRONTEND_URL}/auth/signin</a></p>
            <br>
            <p>Best</p>
            <p>MySkillsPlus team</p>
        </body>
        </html>
        """
        self._send_email(user_email, subject, body)

    def send_pcp_request_notification(self, user_email: str, user_name: str):
        subject = "Personal Career Profile (PCP) Request"
        body = f"""
        <html>
        <body>
            <h2>Dear {user_name},</h2>
            <p>You have received a request for PCP View sharing.</p>
            <p>Kindly check your MySkillsPlus portal and respond.</p>
            <p>Click here - <a href='{FRONTEND_URL}/auth/signin'>{FRONTEND_URL}/auth/signin</a></p>
            <br>
            <p>Best</p>
            <p>MySkillsPlus team</p>
        </body>
        </html>
        """
        self._send_email(user_email, subject, body)

    def send_verification_email(self, name: str, email: str, code: str, frontend_url: str):
        subject = "Verify Your Email Before Starting Your Interview - Code Inside"
        body = f"""
        <html>
        <body>
            <h2>Hi {name},</h2>
            <p>Thank you for being part of MySkillsPlus - we're excited to have you with us!</p>
            <p>Before you start your interview, please take a moment to verify your email address using the code below:</p>
            <h3 style="background-color: #f5f5f5; padding: 10px; text-align: center;">Your Verification Code: {code}</h3>
            <p>You can enter this code at: {frontend_url}/verify-email</p>
            <p>This code will expire in 10 minutes.</p>
            <p>Verifying your email helps us ensure a smooth and secure interview experience. If you didn't request this code or need any help, feel free to contact our support team.</p>
            <br>
            <p>Best regards,</p>
            <p>MySkillsPlus Team</p>
        </body>
        </html>
        """
        self._send_email(email, subject, body)

    def send_registration_alert_interviewee(self, full_name, email, registration_date):
        subject = "🔔 New Interviewee Registered on MySkillsPlus"
        body = f"""
        Hello Team,

        A new interviewee has just registered.

        Details:

        Name: {full_name}

        Email: {email}


        Registered On: {registration_date}

        Kindly ensure further process and allocation.

        Thanks,
        MySkillsPlus System
        """
        # Logic to send the email
        self._send_email(os.getenv("ADMIN_EMAIL"), subject, body)  # Assuming you have a method to send emails

    def send_registration_alert_partner(self, partner_dict):
        subject = "🔔 New Partner Registered on MySkillsPlus"
        body = f"""
        Hello Team,

        A new partner has just registered.

        Details:

        Name: {partner_dict['name']}

        Email: {partner_dict['email']}

        Phone: {partner_dict['phone']}

        Partner Type: {partner_dict['partner_type']}

        Registered On: {partner_dict['created_at']}

        Kindly ensure further process and allocation.

        Thanks,
        MySkillsPlus System
        """
        # Logic to send the email
        self._send_email(os.getenv("ADMIN_EMAIL"), subject, body)  # Assuming you have a method to send emails

    def send_registration_alert_user(self, user):
        subject = "🔔 New User Registered on MySkillsPlus"
        body = f"""
        Hello Team,

        A new user has just registered.

        Details:

        Name: {user.first_name} {user.last_name}

        Email: {user.email}

        Type: {user.type}

        Registered On: {user.date_joined.strftime("%Y-%m-%d %H:%M:%S")}

        Kindly ensure further process and allocation.

        Thanks,
        MySkillsPlus System
        """
        # Logic to send the email
        self._send_email(os.getenv("ADMIN_EMAIL"), subject, body)  # Assuming you have a method to send emails


    def send_registration_alert_recruiter(self, user):
        subject = "🔔 New User Registered on MySkillsPlus"
        body = f"""
        Hello Team,

        A new user has just registered.

        Details:

        Name: {user.first_name} {user.last_name}

        Email: {user.email}

        Type: {user.type}

        Registered On: {user.date_joined.strftime("%Y-%m-%d %H:%M:%S")}

        Kindly ensure further process and allocation.

        Thanks,
        MySkillsPlus System
        """
        # Logic to send the email
        self._send_email(os.getenv("ADMIN_EMAIL"), subject, body)  # Assuming you have a method to send emails

    def send_attempted_interviewee_details(self, recruiter_email: str, candidate_name: str, candidate_email: str, score: str):
        subject = "🔔 Interview Attempt Notification"
        body = f"""
        <html>
        <body>
            <h2>Hello Recruiter,</h2>
            <p>An interviewee has just attempted the interview.</p>
            <h3>Details:</h3>
            <ul>
                <li><strong>Name:</strong> {candidate_name}</li>
                <li><strong>Email:</strong> {candidate_email}</li>
                <li><strong>Score:</strong> {score}</li>
            </ul>
            <p>Best Regards,<br>MySkillsPlus Team</p>
        </body>
        </html>
        """

        # Logic to send the email
        try:
            self._send_email(recruiter_email, subject, body)  # Send to the recruiter's email
        except Exception as e:
            logger.error(f"Failed to send interview attempt notification email: {e}")





    