from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    uid = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    username = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.name

class Departments(models.Model):
    did = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default=None)
    
    def __str__(self):
        return self.name


class Recipients(models.Model):
    rid = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default=None)
    email = models.CharField(max_length=50, default=None)
    did = models.ForeignKey(Departments, default=None, on_delete = models.CASCADE)

    def __str__(self):
        return self.name



