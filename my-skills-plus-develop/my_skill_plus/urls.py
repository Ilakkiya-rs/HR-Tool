from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from users.views import CreateUserView, UserSignUpView
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework_simplejwt.views import TokenVerifyView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/signup/", UserSignUpView.as_view(), name="signup"),
    path(
        r"api/password-reset/",
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    ),
    path("accounts/", include("allauth.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path("api/token/login", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/register/", CreateUserView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("users/", include("users.urls", namespace="users")),
    path("", include("profilers.urls", namespace="profiler"))
    #path('', include('users.urls'))
    # path("", include("users.urls", namespace='users')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
