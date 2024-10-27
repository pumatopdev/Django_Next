from django.urls import path
from .views import register, profile, user_management, user_modify, CustomTokenRefreshView, CustomTokenObtainPairView, logout
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # User registration
    path('register/', register, name='register'),
    
    # User login (JWT token creation)
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),  # JWT Login

    # Refresh JWT token
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),

    # User profile (own profile management)
    path('profile/', profile, name='profile'),

    path('logout/', logout, name='logout'),

    # Admin-only user management
    path('admin/users/', user_management, name='user_management'),
    path('admin/users/<uuid:user_id>/', user_modify, name='user_modify'),  # Update/Delete user
]