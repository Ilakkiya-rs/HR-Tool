"""Import users_admin and users_partner from PostgreSQL dump into SQLite."""
import os
import re
from datetime import datetime
from pathlib import Path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my_skill_plus.settings_dev")
os.environ["DATABASE_URL"] = "sqlite:///db.sqlite3"

import django

django.setup()

from users.models import Admin, Partner

DUMP = Path(__file__).resolve().parent.parent / (
    "IYS_14mar26-20260512T080322Z-3-001/IYS_14mar26/django_db214mar26.dmp"
)


def parse_copy_block(table_name: str) -> list[list[str]]:
    text = DUMP.read_text(encoding="utf-8", errors="replace")
    pattern = rf"COPY public\.{table_name} \([^)]+\) FROM stdin;\n(.*?)\n\\\."
    match = re.search(pattern, text, re.DOTALL)
    if not match:
        return []
    rows = []
    for line in match.group(1).strip().split("\n"):
        if not line.strip():
            continue
        rows.append(line.split("\t"))
    return rows


def null(v: str):
    return None if v == r"\N" else v


def parse_bool(v: str) -> bool:
    return v == "t"


def parse_dt(v: str):
    if not v or v == r"\N":
        return None
    v = re.sub(r"\+\d{2}(:\d{2})?$", "+00:00", v.replace(" ", "T", 1))
    try:
        return datetime.fromisoformat(v)
    except ValueError:
        return datetime.strptime(v[:19], "%Y-%m-%dT%H:%M:%S")


def import_admin():
    Admin.objects.all().delete()
    for row in parse_copy_block("users_admin"):
        admin_id, username, password_hash, is_active, created_at, total_earnings = row
        Admin.objects.create(
            admin_id=null(admin_id),
            username=username,
            password_hash=password_hash,
            is_active=parse_bool(is_active),
            created_at=parse_dt(created_at),
            total_earnings=total_earnings or 0,
        )
    print(f"Admin: {Admin.objects.count()}")


def import_partners():
    from django.contrib.auth.hashers import make_password

    local_password = os.getenv("LOCAL_PARTNER_PASSWORD", "Dev@1234")
    Partner.objects.all().delete()
    for row in parse_copy_block("users_partner"):
        (
            partner_id,
            name,
            email,
            phone,
            password_hash,
            partner_type,
            other_partner_type,
            channel_name,
            website_link,
            bio,
            country,
            referred_by,
            referral_code,
            stripe_account_id,
            logo_url,
            is_active,
            email_verified,
            status,
            created_at,
            updated_at,
            paid_users,
        ) = row
        if status == "Approved" and parse_bool(email_verified):
            password_hash = make_password(local_password)
        Partner.objects.create(
            partner_id=null(partner_id),
            name=name,
            email=email,
            phone=null(phone),
            password_hash=null(password_hash),
            partner_type=partner_type,
            other_partner_type=null(other_partner_type),
            channel_name=null(channel_name),
            website_link=null(website_link),
            bio=null(bio),
            country=null(country),
            referred_by=null(referred_by),
            referral_code=null(referral_code),
            stripe_account_id=null(stripe_account_id),
            logo_url=null(logo_url),
            is_active=parse_bool(is_active),
            email_verified=parse_bool(email_verified),
            status=status,
            created_at=parse_dt(created_at),
            updated_at=parse_dt(updated_at),
            paid_users=int(paid_users or 0),
        )
    print(f"Partners: {Partner.objects.count()}")


if __name__ == "__main__":
    import_admin()
    import_partners()
