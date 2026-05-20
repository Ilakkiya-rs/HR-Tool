"""Create a user for skills assessment API testing."""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my_skill_plus.settings_dev")
django.setup()

from users.models import User

EMAIL = "assessment@test.com"
NAME = "Assessment Test User"

user, created = User.objects.get_or_create(
    email=EMAIL,
    defaults={
        "username": EMAIL,
        "first_name": "Assessment",
        "last_name": "Test",
        "individual_profile_id": "TEST-PROFILE-001",
    },
)
if not user.individual_profile_id:
    user.individual_profile_id = "TEST-PROFILE-001"
    user.save()

print("User ready for skills assessment:")
print(f"  email: {EMAIL}")
print(f"  individual_profile_id: {user.individual_profile_id}")
print(f"  created: {created}")
