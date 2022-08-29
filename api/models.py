from pyexpat import model
from django.db import models

# Create your models here.

class Recipients(models.Model):
    rid = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default=None)
    email = models.CharField(max_length=50, default=None)
    department = models.CharField(max_length=50, default=None)

    def __str__(self):
        return self.name



