from django import forms

from .models import *

from django.contrib.auth.forms import UserCreationForm
from django.db import transaction


class UserSignUpForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super(UserSignUpForm, self).__init__(*args, **kwargs)
        del self.fields["password2"]
        self.fields["password1"].help_text = None

    first_name = forms.CharField(
        label="First Name",
        max_length=30,
        widget=forms.TextInput(
            attrs={"id": "first-name", "type": "text", "placeholder": "First Name"}
        ),
        required=True,
    )
    last_name = forms.CharField(
        label="Last Name",
        max_length=30,
        widget=forms.TextInput(
            attrs={"id": "last-name", "type": "text", "placeholder": "Last Name"}
        ),
        required=True,
    )
    email = forms.EmailField(
        label="Email",
        max_length=254,
        widget=forms.TextInput(
            attrs={"id": "email", "type": "email", "placeholder": "Email"}
        ),
        required=True,
    )
    password1 = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(
            attrs={"id": "password", "type": "password", "placeholder": "Password"}
        ),
        required=True,
    )

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError(
                self.error_messages["password_mismatch"],
                code="password_mismatch",
            )
        return password2

    def clean_email(self):
        email = self.cleaned_data.get("email")
        g = User.objects.filter(email=email)
        if g.exists():
            raise forms.ValidationError("Email already registered")
        return email

    class Meta(UserCreationForm.Meta):
        model = User
        exclude = [
            "password2",
        ]
        fields = [
            "first_name",
            "last_name",
            "email",
            "password1",
        ]

    @transaction.atomic
    def save(self):
        user = super().save(commit=False)

        print(self.cleaned_data)
        user.first_name = self.cleaned_data.get("first_name")
        user.last_name = self.cleaned_data.get("last_name")
        user.email = self.cleaned_data.get("email")
        user.username = self.cleaned_data.get("email")
        user.save()
        return user
