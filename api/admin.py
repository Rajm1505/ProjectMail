from django.contrib import admin
from .models import Recipients, Departments, User
# Register your models here.

admin.site.register(User)
admin.site.register(Recipients)
admin.site.register(Departments)