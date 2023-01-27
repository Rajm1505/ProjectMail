from pyexpat import model
from django.db import models

# Create your models here.



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



