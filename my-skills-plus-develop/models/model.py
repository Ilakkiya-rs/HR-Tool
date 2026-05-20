# models.py

from django.db import models

class Receiver(models.Model):
    email = models.EmailField(unique=True)
