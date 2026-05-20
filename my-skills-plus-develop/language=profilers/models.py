from django.utils import timezone

class JobProfile(models.Model):
    # ... existing fields ...
    
    created_at = models.DateTimeField(auto_now_add=True, default=timezone.now)  # Automatically set the field to now when the object is first created

    # ... existing methods ... 