# views.py

from django.shortcuts import get_object_or_404
from .models import Receiver

def get_receiver_email(receiver_id):
    receiver = get_object_or_404(Receiver, pk=receiver_id)
    return receiver.email
