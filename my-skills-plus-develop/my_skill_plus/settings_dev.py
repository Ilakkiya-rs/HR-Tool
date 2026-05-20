from pathlib import Path

from dotenv import load_dotenv

from .settings import *  # noqa: F403

# Local dev: always use project SQLite (ignore machine-level DATABASE_URL/postgres)
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env.test", override=True)

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# Partner-only routes, or full app including vani/profilers (assessment APIs)
import os as _os

ROOT_URLCONF = (
    "my_skill_plus.urls"
    if _os.getenv("ENABLE_PROFILERS", "").lower() in ("1", "true", "yes")
    else "my_skill_plus.urls_admin"
)
