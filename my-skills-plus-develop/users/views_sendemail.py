from django.shortcuts import render, redirect
from django.views.generic import CreateView

from users.forms import UserSignUpForm
from users.serializers import CreateUserSerializer, UserSerializer
from .models import User
from django.contrib.auth import login
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.sites.shortcuts import get_current_site
from .models import VerificationToken
from django.http import HttpResponse

def send_verification_email(user, request):
    token, created = VerificationToken.objects.get_or_create(user=user)
    current_site = get_current_site(request)
    verification_link = reverse('verify_email', kwargs={'token': token.token})
    verification_url = f"http://{current_site.domain}{verification_link}"

    send_mail(
        'Verify your email',
        f'Please click the following link to verify your email: {verification_url}',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
    )

def verify_email(request, token):
    token_obj = get_object_or_404(VerificationToken, token=token)
    user = token_obj.user
    user.verified = True
    user.save()
    token_obj.delete()
    return HttpResponse("Your email has been verified. You can now log in.")

def resend_verification_email(request):
    if request.method == 'POST':
        user = request.user
        send_verification_email(user, request)
        return HttpResponse("Verification email sent.")
    return render(request, 'account/resend_verification.html')


class UserSignUpView(CreateView):
    model = User
    form_class = UserSignUpForm
    template_name = "account/signup.html"

    def form_valid(self, form):
        user = form.save()
        login(
            self.request,
            user,
            backend="allauth.account.auth_backends.AuthenticationBackend",
        )
        return redirect("profilers:skill_playground")


def home_view(request):
    return render(request, "index.html")


class CreateUserView(generics.CreateAPIView):
    serializer_class = CreateUserSerializer
    queryset = User.objects.all()
    authentication_classes = []
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        return Response({"detail": "user is created"}, status=status.HTTP_201_CREATED)


# user info api with authicated user only
class UserView(APIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

