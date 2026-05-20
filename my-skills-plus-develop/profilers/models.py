from django.db import models
from django.core.signing import Signer, BadSignature
from django.conf import settings
from django.contrib.auth.models import User  # Import the User model
from django.contrib.auth import get_user_model

from django.utils import timezone


class SkillProfile(models.Model):
    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="skill_profiles",
    )

    is_shared = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    skills = models.ManyToManyField("profilers.Skill", related_name="profile")

    class Meta:
        db_table = "SkillProfiles"
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.user.username}'s profile"


class Skill(models.Model):
    user_id = models.IntegerField(default=0)
    isot_path_addr = models.CharField(max_length=100)
    ratings = models.JSONField(default=list)
    tags = models.CharField(max_length=1000, default='default')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "Skills"
        ordering = ("-created_at",)

    def __str__(self):
        return f"#{self.isot_path_addr} skill for user ID {self.user_id}"


class ReviewSkills(models.Model):
    review_user = models.ForeignKey(
        "profilers.ReviewProfileUser",
        on_delete=models.CASCADE,
        related_name="review_skills",
    )
    skill = models.ForeignKey(
        "profilers.Skill",
        on_delete=models.CASCADE,
        related_name="review_skills",
    )

    ratings = models.JSONField(default=list)


REVIEW_USER_TYPES = (
    ("IS", "Indirect Seniors"),
    ("JR", "Junior"),
    ("SR", "Seniors"),
    ("PR", "Peers"),
)


class ReviewProfileUser(models.Model):
    profile = models.ForeignKey(
        "profilers.SkillProfile",
        on_delete=models.CASCADE,
        related_name="review_profile_users",
    )
    user_type = models.CharField(
        max_length=2,
        choices=REVIEW_USER_TYPES,
    )
    is_submitted = models.BooleanField(default=False)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    about = models.TextField(blank=True, null=True)
    linkedin_url = models.URLField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.email})"

    def get_generated_token(self):
        # Use profile, email, and user_type to generate token
        data = {
            "profile_id": self.profile.id,
            "email": self.email,
            "user_type": self.user_type,
        }
        data = {"data": f"{self.id},{self.profile.id},{self.email},{self.user_type}"}

        signer = Signer()
        token = signer.sign_object(data)
        return token

    def genrate_review_profile_link(self):
        token = self.get_generated_token()
        return f"{settings.FRONTEND_ENDPOINT}/request-360-feedback/review-user/{token}"

    class Meta:
        unique_together = ("profile", "email")
        ordering = ("-created_at",)


# TODO : WILL GENRATED A new token(url)  so user can acccess the profile and give review
def decode_token(token):
    signer = Signer()
    try:
        data = signer.unsign_object(token).get("data")
        id, profile_id, email, user_type = data.split(",")
        return (id, profile_id, email, user_type)
    except BadSignature:
        print("bad token here")
        return None
    


class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

class UserAssessment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    questions = models.JSONField()
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Discipline(models.Model):
    category = models.CharField(max_length=255)
    sub_category = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.category} - {self.sub_category}"
    

class LevelOfEducation(models.Model):
    name = models.CharField(max_length=500)

class Country(models.Model):
    name = models.CharField(max_length=100)
    iso3 = models.CharField(max_length=3, blank=True, null=True)
    numeric_code = models.CharField(max_length=3, blank=True, null=True)
    iso2 = models.CharField(max_length=2, blank=True, null=True)
    phonecode = models.CharField(max_length=255, blank=True, null=True)
    capital = models.CharField(max_length=255, blank=True, null=True)
    currency = models.CharField(max_length=255, blank=True, null=True)
    currency_name = models.CharField(max_length=255, blank=True, null=True)
    currency_symbol = models.CharField(max_length=255, blank=True, null=True)
    tld = models.CharField(max_length=255, blank=True, null=True)
    native = models.CharField(max_length=255, blank=True, null=True)
    region = models.CharField(max_length=255, blank=True, null=True)
    region_id = models.BigIntegerField(blank=True, null=True)
    subregion = models.CharField(max_length=255, blank=True, null=True)
    subregion_id = models.BigIntegerField(blank=True, null=True)
    nationality = models.CharField(max_length=255, blank=True, null=True)
    timezones = models.TextField(blank=True, null=True)
    translations = models.TextField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    emoji = models.CharField(max_length=191, blank=True, null=True)
    emojiU = models.CharField(max_length=191, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    flag = models.SmallIntegerField(default=1)
    wikiDataId = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name


class State(models.Model):
    name = models.CharField(max_length=255)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='states')
    country_code = models.CharField(max_length=2)
    fips_code = models.CharField(max_length=255, blank=True, null=True)
    iso2 = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=191, blank=True, null=True)
    level = models.IntegerField(blank=True, null=True)
    parent_id = models.IntegerField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    flag = models.SmallIntegerField(default=1)
    wikiDataId = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name


class City(models.Model):
    name = models.CharField(max_length=255)
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='cities')
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='cities')
    state_code = models.CharField(max_length=255)
    country_code = models.CharField(max_length=2)
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    flag = models.SmallIntegerField(default=1)
    wikiDataId = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name


class JobProfile(models.Model):
    user_id = models.IntegerField()
    user_name = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)
    user_email = models.EmailField()
    userRatedSkills = models.JSONField()
    background_details = models.JSONField(null=True, blank=True)
    # created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.job_title
    

class JobProfiles(models.Model):
    user_id = models.IntegerField(null=True, blank=True)
    individual_profile_id=models.CharField(max_length=255, null=True, blank=True)
    user_name = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)
    user_email = models.EmailField()
    userRatedSkills = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    background_details = models.JSONField(null=True, blank=True)
    short_listed = models.JSONField(null=True, blank=True)
    individual_job_id = models.CharField(blank=True, null=True, max_length=20)
    

    def __str__(self):
        return self.job_title

class Notification(models.Model):
    sender_id = models.IntegerField()
    receiver_id = models.IntegerField()
    job_id = models.IntegerField()
    job_name = models.CharField(max_length=255)
    message_type = models.CharField(max_length=50)
    message = models.TextField()
    status = models.CharField(max_length=20, default='pending')

class Notifications(models.Model):
    sender_id = models.CharField(max_length=255, null=True, blank=True)
    receiver_id = models.CharField(max_length=255, null=True, blank=True)
    job_id = models.CharField(max_length=200, null=True, blank=True)
    job_name = models.CharField(max_length=255, null=True, blank=True)
    message_type = models.CharField(max_length=50)
    message = models.TextField()
    job_profile_url = models.URLField(blank=True, null=True)
    job_background_url = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reason = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Notification from {self.sender_id} to {self.receiver_id} for job {self.job_id}"

User = get_user_model()  # Get the user model dynamically

class ChatConversations(models.Model):
    # sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE, null=True, blank=True)
    # receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE, null=True, blank=True)
    sender_id = models.CharField(max_length=250, null=True, blank=True)
    receiver_id = models.CharField(max_length=250, null=True, blank=True)
    message = models.TextField()
    send_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Message from {self.sender_id} to {self.receiver_id} at {self.send_at}"

from django.db import models

class CandidateProfile(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    job_id = models.CharField(max_length=255)  # Assuming job_id is a string
    job_name = models.CharField(max_length=255)
    candidate_skills = models.JSONField()  # Store job skills as JSON
    resume = models.FileField(upload_to='resumes/')  # Store resume files
    assessment_score = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.job_name}"
    

class UserAssessment(models.Model):
    individual_profile_id = models.CharField(null=True, blank=True, max_length=250)
    question1 = models.JSONField(null=True, blank=True)
    question2 = models.JSONField(null=True, blank=True)
    question3 = models.JSONField(null=True, blank=True)
    question4 = models.JSONField(null=True, blank=True)
    question5 = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)

class AssessmentResult(models.Model):
    individual_profile_id = models.CharField(max_length=255)  # Store the individual profile ID
    assessment_id = models.IntegerField()  # Store the assessment ID
    remarks = models.TextField()  # Store remarks
    overall_score = models.CharField(max_length=50)  # Store the overall score
    skills_assessed = models.IntegerField()  # Number of skills assessed
    questions_answered = models.IntegerField()  # Number of questions answered
    total_questions = models.IntegerField()  # Total number of questions
    data = models.JSONField()  # Store the answers as JSON
    created_at = models.DateTimeField(auto_now_add=True, null=True)  # Automatically set the field to now when the object is created
    updated_at = models.DateTimeField(auto_now=True, null=True)  # Automatically set the field to now when the object is updated

    def __str__(self):
        return f"Assessment Result for {self.individual_profile_id}"
    


import string
import random
from django.db import models
from django.contrib.postgres.fields import JSONField  # If using PostgreSQL

def generate_job_id():
    """Generate a random 10-character alphanumeric string."""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

class RecruiterAssessment(models.Model):
    job_id = models.CharField(max_length=10, unique=True, editable=False, default=generate_job_id)
    job_title = models.CharField(max_length=255, null=True, blank=True)
    recruiter_id = models.CharField(max_length=255)
    job_description = models.TextField()
    token = models.CharField(max_length=255, unique=True)
    questions = models.JSONField()  # Stores GPT generated questions
    created_at = models.DateTimeField(auto_now_add=True)
    assessment_id = models.CharField(max_length=255, unique=True, editable=False, default=generate_job_id)

    def __str__(self):
        return f"Assessment {self.id} for Recruiter {self.recruiter_id} (Job ID: {self.job_id})"
    
class IntervieweeAssessment(models.Model):
    job_id=models.CharField(max_length=10)
    job_description = models.TextField()
    token = models.CharField(max_length=255)
    candidate_name = models.CharField(max_length=255, null=True, blank=True)  # New field
    candidate_email = models.EmailField(null=True, blank=True) 
    question1 = models.JSONField(null=True, blank=True)
    question2 = models.JSONField(null=True, blank=True)
    question3 = models.JSONField(null=True, blank=True)
    question4 = models.JSONField(null=True, blank=True)
    question5 = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class JobAssessmentResult(models.Model):
    job_id=models.CharField(max_length=10)
    recruiter_id = models.CharField(max_length=255)
    assessment_id = models.CharField(max_length=255)
    token = models.CharField(max_length=255)
    remarks = models.TextField()
    overall_score = models.CharField(max_length=50)
    questions_answered = models.IntegerField()
    total_questions = models.IntegerField()
    answers = models.JSONField()  # Assuming this is a JSONField
    candidate_name = models.CharField(max_length=255, null=True, blank=True)  # New field
    candidate_email = models.EmailField(null=True, blank=True)  # New field
    is_paid = models.BooleanField(default=False)  # New field
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Assessment {self.assessment_id} - Score: {self.overall_score}"

class Interviewee(models.Model):
    interviewee_id = models.BigAutoField(primary_key=True)  # BIGSERIAL equivalent
    name = models.TextField()  # TEXT equivalent
    email = models.EmailField(unique=True)  # UNIQUE NOT NULL equivalent
    created_at = models.DateTimeField(auto_now_add=True)  # TIMESTAMPTZ DEFAULT now()

    def __str__(self):
        return self.name

class RecruiterAssessmentAssignment(models.Model):
    assignment_id = models.BigAutoField(primary_key=True)  # BIGSERIAL equivalent
    assessment = models.ForeignKey('RecruiterAssessment', on_delete=models.CASCADE)  # Foreign key to RecruiterAssessment
    job_id = models.CharField(max_length=100, null=True, blank=True)  # BIGINT NOT NULL equivalent
    interviewee = models.ForeignKey(Interviewee, on_delete=models.CASCADE)  # Foreign key to Interviewee
    recruiter_id = models.CharField(max_length=100)  # BIGINT NOT NULL equivalent
    email = models.EmailField()  # NOT NULL equivalent
    language = models.CharField(max_length=255, null=True, blank=True)  # TEXT equivalentNOT NULL equivalent
    created_at = models.DateTimeField(auto_now_add=True)  # TIMESTAMPTZ DEFAULT now()
    qa_data = models.JSONField()  # JSONB NOT NULL equivalent
    initial_voice = models.BinaryField(null=True)  # BYTEA equivalent
    resume_voice = models.BinaryField(null=True)  # BYTEA equivalent
    question1_voice = models.BinaryField(null=True)  # BYTEA equivalent
    question2_voice = models.BinaryField(null=True)  # BYTEA equivalent
    question3_voice = models.BinaryField(null=True)  # BYTEA equivalent
    question4_voice = models.BinaryField(null=True)  # BYTEA equivalent
    question5_voice = models.BinaryField(null=True)  # BYTEA equivalent
    attempted = models.BooleanField(default=False)  # BOOLEAN DEFAULT FALSE equivalent
    paused = models.BooleanField(default=False)  # Field to track if the assignment is paused
    paused_at = models.DateTimeField(null=True, blank=True)  # Field to store when it was paused
    verified = models.BooleanField(default=False)  # BOOLEAN DEFAULT FALSE equivalent
    first_chance = models.BooleanField(default=False)  # BOOLEAN DEFAULT FALSE equivalent
    restricted = models.BooleanField(default=False)  # BOOLEAN DEFAULT FALSE equivalent
    started_at = models.DateTimeField(null=True)  # TIMESTAMPTZ equivalent
    expires_at = models.DateTimeField(null=True)  # TIMESTAMPTZ equivalent
    created_at = models.DateTimeField(auto_now_add=True)  # TIMESTAMPTZ DEFAULT now()
    updated_at = models.DateTimeField(auto_now=True)  # TIMESTAMPTZ DEFAULT now()
    resumed_at = models.DateTimeField(null=True)  # TIMESTAMPTZ equivalent
    job_fit_score = models.CharField(max_length=10, null=True, blank=True)  # Field to store job fit score
    remarks = models.TextField(null=True, blank=True)  # Field to store remarks
    is_paid = models.BooleanField(default=False)  # BOOLEAN DEFAULT FALSE equivalent

    class Meta:
        unique_together = (('assessment', 'email'),)  # UNIQUE (assessment_id, email)

    def __str__(self):
        return f"Assignment {self.assignment_id} for {self.interviewee.name}"

class IntervieweeVerificationSession(models.Model):
    interviewee_session_id = models.BigAutoField(primary_key=True)  # BIGSERIAL equivalent
    assignment = models.ForeignKey(RecruiterAssessmentAssignment, on_delete=models.CASCADE)  # Foreign key to RecruiterAssessmentAssignment
    email = models.EmailField()  # NOT NULL equivalent
    code = models.CharField(max_length=6)  # VARCHAR(6) NOT NULL equivalent
    expires_at = models.DateTimeField()  # TIMESTAMPTZ NOT NULL equivalent
    created_at = models.DateTimeField(auto_now_add=True)  # TIMESTAMPTZ DEFAULT now()
    is_verified = models.BooleanField(default=False)  # BOOLEAN DEFAULT FALSE equivalent

    def __str__(self):
        return f"Verification Session {self.interviewee_session_id} for {self.email}"

# profilers/serializers.py

class IndividualAssessment(models.Model):
    id = models.AutoField(primary_key=True)
    assessment_id = models.CharField(max_length=255, unique=True, editable=False, default=generate_job_id)
    individual_profile_id = models.CharField(max_length=255, null=True, blank=True)
    recruiter_id = models.CharField(max_length=255, null=True, blank=True)
    job_id = models.CharField(max_length=255, null=True, blank=True)
    job_title = models.CharField(max_length=255, null=True, blank=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    token = models.CharField(max_length=255, unique=True)
    qa_data = models.JSONField()  # requires PostgreSQL, else use TextField
    skills = models.JSONField()
    initial_voice = models.BinaryField(null=True, blank=True)
    resume_voice = models.BinaryField(null=True, blank=True)
    first_chance = models.BooleanField(default=False)
    language = models.CharField(max_length=50, null=True, blank=True)
    remarks = models.TextField(null=True, blank=True)
    credibility_score = models.CharField(max_length=50,null=True, blank=True)
    paused = models.BooleanField(default=False)
    paused_at = models.DateTimeField(null=True, blank=True)
    attempted = models.BooleanField(default=False)
    restricted = models.BooleanField(default=False)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "individual_assessments"


class RecruiterAssessmentAssignmentQuestion(models.Model):
    id = models.AutoField(primary_key=True)
    assessment = models.ForeignKey(
        IndividualAssessment, on_delete=models.CASCADE, related_name="answers"
    )
    email = models.EmailField()
    question_no = models.CharField(max_length=50)
    question = models.TextField()
    question_translated = models.TextField(null=True, blank=True)
    audio_file_path = models.TextField(null=True, blank=True)
    audio_filename = models.CharField(max_length=255, null=True, blank=True)
    transcript_original = models.TextField(null=True, blank=True)
    transcript_en = models.TextField(null=True, blank=True)
    processing_state = models.CharField(max_length=50, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)  # Use timezone.now instead of now

    # class Meta:
    #     db_table = "recruiters_assessment_assignment_question"




from django.db import models
from django.utils.timezone import now
from datetime import timedelta


class RecruiterAssessmentAssignmentQuestions(models.Model):
    assessment = models.ForeignKey(
        "RecruiterAssessment",
        on_delete=models.CASCADE,
        related_name="assignment_questions"
    )
    assignment = models.ForeignKey(
        "RecruiterAssessmentAssignment",
        on_delete=models.CASCADE,
        related_name="questions"
    )
    interviewee_id = models.IntegerField(null=True, blank=True)
    recruiter_id = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField()

    question_no = models.CharField(max_length=50)
    question = models.TextField()
    question_translated = models.TextField(blank=True, null=True)

    audio_file_path = models.TextField(blank=True, null=True)
    audio_filename = models.CharField(max_length=255, blank=True, null=True)

    transcript_original = models.TextField(blank=True, null=True)
    transcript_en = models.TextField(blank=True, null=True)

    # ---- Processing fields ----
    response_start_time = models.DateTimeField(null=True, blank=True)
    response_end_time = models.DateTimeField(null=True, blank=True)
    response_duration = models.DurationField(null=True, blank=True)

    speech_latency = models.CharField(max_length=50, null=True, blank=True)  # e.g. "1.23 seconds"
    speech_rate = models.FloatField(null=True, blank=True)  # words per minute
    pause_count = models.IntegerField(null=True, blank=True)
    avg_pause_duration = models.DurationField(null=True, blank=True)

    flat_tone_flag = models.BooleanField(default=False)
    suspicion_score = models.FloatField(null=True, blank=True)
    suspicion_flag = models.CharField(max_length=50, null=True, blank=True)

    processed_at = models.DateTimeField(null=True, blank=True)

    processing_state = models.CharField(
        max_length=50,
        default="pending",
        help_text="pending / processing / completed / failed"
    )

    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return f"Q{self.question_no} - {self.email}"
