from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('company', 'Company'),
        ('admin', 'Admin'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    phone = models.IntegerField(max_length=15, blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    #student field
    COURSE_CHOICES = (
        ('cit', 'CIT'),
        ('coa', 'COA'),
        ('coed', 'COED'),
        ('chm', 'CHM'),
        ('cba', 'CBA'),
    )
    student_id = models.CharField(max_length=20, blank=True, null=True)
    course = models.CharField(max_length=10, choices=COURSE_CHOICES, blank=True, null=True)
    year_level = models.IntegerField(blank=True, null=True)

    #company field
    company_name = models.CharField(max_length=100, blank=True, null=True)
    company_address = models.TextField(blank=True, null=True)
    company_description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"