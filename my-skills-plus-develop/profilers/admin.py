from django.contrib import admin

from profilers.models import Skill, SkillProfile, ReviewSkills, ReviewProfileUser


admin.site.register(Skill)
admin.site.register(SkillProfile)
admin.site.register(ReviewSkills)
admin.site.register(ReviewProfileUser)
# Register your models here.
