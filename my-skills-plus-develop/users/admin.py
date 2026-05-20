from django.contrib import admin

from users.models import User

admin.site.site_header = "My Skill Plus Admin"
admin.site.site_title = "My Skill Plus Admin Portal"
admin.site.index_title = "Welcome to My Skill Plus Portal"

admin.site.register(User)
