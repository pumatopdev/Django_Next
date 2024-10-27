from rest_framework_simplejwt.authentication import JWTAuthentication

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        if access_token := request.COOKIES.get('access_token'):
            # Manually set the access token as if it's in the Authorization header
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {access_token}'

        # Call the parent class's authenticate method to process the token
        return super().authenticate(request)