#This admin.py is used to register and configure models for the Django admin interface.
#This code customizes the Django admin interface for the User model by defining a CustomUserAdmin class,
#which extends Django’s built-in UserAdmin class. 
#It changes the way the User model is displayed and managed within the admin interface by customizing what fields and filters are shown.

from django.contrib import admin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# This is the function that add some fields to "UserAdmin" Class of Python template library.
class CustomUserAdmin(UserAdmin):
    #This tells Django that CustomUserAdmin will be used to manage the User model.
    model = User
    list_display = ('id','email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'is_active')
    #Adds filters to the right side of the admin list view, allowing you to filter users based on their is_staff, is_superuser, and is_active status.
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    #Defines which fields can be searched in the admin panel’s user search box.
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    #Defines the layout of fields when viewing or editing a user in the admin panel.
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login',)}),
    )

admin.site.register(User, CustomUserAdmin)

# Register your models here.
