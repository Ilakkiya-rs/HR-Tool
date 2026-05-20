# email_sender/email_utils.py

from django.core.mail import send_mail
from .views import get_receiver_email

def send_email_to_receiver(subject, message, receiver_id):
    recipient_email = get_receiver_email(receiver_id)
    send_mail(subject, message, 'sureshkumar.t@praniontech.com', [recipient_email])
