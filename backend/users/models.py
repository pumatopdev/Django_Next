# import os
# import django
# import sys

# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# # Set the default settings module for Django
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # Replace 'backend.settings' with your settings file

# # Initialize Django
# # django.setup()

#The uuid module provides a way to generate universally unique identifiers (UUIDs), which are 128-bit values used for unique identification. 
#The models module provides tools for defining database models in Django, like CharField, EmailField, BooleanField, and so on.
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

#BaseUserManager: is responsible for managing user objects, such as creating users and superusers.
class CustomUserManager(BaseUserManager):
    # create_user & create_superuser are default function of BaseUserManager
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields) # Create new user instance
        user.set_password(password) # hash password
        user.save(using=self._db)
        return user
 
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True) # Sets is_staff to True if it hasn’t been specified in extra_fields.
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


#AbstractBaseUser:A Django class that provides the core implementation for a custom user model. It includes essential fields like password and last_login
# but it does not include fields like username or email by default.
# PermissionsMixin:Provides fields and methods to support Django’s built-in permission system, like is_staff, is_superuser, and user groups.

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)  # Superuser flag
    objects = CustomUserManager() # Set CustomUserManager as the manager

    USERNAME_FIELD = 'email' # Specifies that the email field should be used for authentication instead of a username.
    REQUIRED_FIELDS = ['first_name', 'last_name']

    # This method defines the string representation of a user instance. 
    def __str__(self):
        return self.email
    
# This User model is added into Settings.py / AUTH_USER_MODEL = 'app_name.User' as  'user.User'