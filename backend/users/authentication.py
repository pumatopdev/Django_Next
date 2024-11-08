#This file is imported into settings.py as DEFAULT_AUTHENTICATION_CLASSES

from rest_framework_simplejwt.authentication import JWTAuthentication

class CustomJWTAuthentication(JWTAuthentication):
    #Overriding the authenticate Method:
    #it checks for an access_token stored in the request cookies instead of the typical Authorization header.
    def authenticate(self, request):
        # if an access_token exists in request.COOKIES
        if access_token := request.COOKIES.get('access_token'):
            # Manually set the access token as if it's in the Authorization header
            #request.META: META is a dictionary containing all HTTP headers and other metadata for the request.
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {access_token}'

        # Call the parent class's authenticate method to process the token
        #If the token is valid, this method returns an authenticated user and token information
        return super().authenticate(request)