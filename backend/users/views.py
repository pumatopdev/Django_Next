from django.shortcuts import get_object_or_404, render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import UserSerializer, RegisterSerializer
from django.contrib.auth import get_user_model   # I use customized model instead of django.contrib.auth.models
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken

User = get_user_model()

def get_response(success, data):
    return {"success": success, "data": data}

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)  # Call the original post method to get the tokens
        refresh_token = response.data.get('refresh')
        access_token = response.data.get('access')
        try:
            user = User.objects.get(email = request.data['email'])
        except User.DoesNotExist:
            return Response({'success': False, 'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        role = "superuser" if user.is_superuser else ("admin" if user.is_staff else "user")
        res = Response({
            'success': True,
            'data': {
                'user_id': user.id,  # User's ID
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'role': role,  # Include user role in the response
                'is_active': user.is_active,
            }
        }, status=status.HTTP_200_OK)

        res.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=True,  # Set to True in production (HTTPS)
            samesite='Lax',
            max_age=15 * 60  # 15 minutes
        )
        res.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=True,  # Set to True in production
            samesite='Lax',
            max_age=7 * 24 * 60 * 60  # 7 days
        )
        return res

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')  # Get the refresh token from cookies

        if not refresh_token:
            return Response({'success': False, 'message': 'Refresh token missing'}, status=status.HTTP_403_FORBIDDEN)

        # Override the request data to include the refresh token from the cookie
        request.data['refresh'] = refresh_token

        try:
            response = super().post(request, *args, **kwargs)
            access_token = response.data['access']

            # Set the new access token in the cookies
            res = Response({'success': True})
            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='Lax',
                max_age=15 * 60  # 15 minutes
            )
            return res

        except InvalidToken:
            return Response({'success': False, 'message': 'Invalid refresh token'}, status=status.HTTP_403_FORBIDDEN)

# Log out by clearing the JWT tokens (access and refresh tokens)
@api_view(['POST'])
def logout(request):
    response = Response({
        'success': True,
        'message': 'Logged out successfully'
    })
    # Remove cookies by setting them with an expired age
    response.delete_cookie('access_token')  # Clear the access token
    response.delete_cookie('refresh_token')  # Clear the refresh token
    return response

# Register a new user
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(get_response(True, UserSerializer(user).data), status=status.HTTP_201_CREATED)
    return Response(get_response(False, serializer.errors), status=status.HTTP_400_BAD_REQUEST)


# Get or update user profile (logged-in user)
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    try:
        user = request.user
    except User.DoesNotExist:
        return Response(get_response(False, "User not found"), status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({
            'success': True,
            'data': {
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': 'admin' if user.is_staff else 'user',  # Check if the user is an admin
                'user_id': user.id,
            }
        })

    if request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            return Response(get_response(True, serializer.data))
        return Response(get_response(False, serializer.errors), status=status.HTTP_400_BAD_REQUEST)


# Admin-only: List users or create a new user
@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def user_management(request):
    if request.method == 'GET':
        users = User.objects.all()
        return Response(get_response(True, UserSerializer(users, many=True).data))

    if request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(get_response(True, UserSerializer(user).data), status=status.HTTP_201_CREATED)
        return Response(get_response(False, serializer.errors), status=status.HTTP_400_BAD_REQUEST)


# Admin-only: Update or delete user by ID
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAdminUser])
def user_modify(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(get_response(False, "User not found"), status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(get_response(True, serializer.data))
        return Response(get_response(False, serializer.errors), status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        user = get_object_or_404(User, id=user_id)
        user.delete()
        return Response(get_response(True, "User deleted"), status=status.HTTP_204_NO_CONTENT)
# Create your views here.
