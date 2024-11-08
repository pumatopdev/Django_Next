# serializers module provides tools to convert complex data types (like Django models) into JSON format
#  also handle incoming JSON data, validating and transforming it back into Django
from rest_framework import serializers
from .models import User

# serializers.ModelSerializer: This is a shortcut for creating serializers based on Django models.
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Defines which fields will appear in the serialized output and expected input
        fields = ['id', 'email', 'first_name', 'last_name', 'is_active']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password']

    # The create method is called when a new instance is created through the serializer. 
    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )