"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

# This is a configuration file used in Python to set up the application for asynchronous communication with the server.
# ASGI serves as the entry point for asynchronous features like real-time data and websockets.
# ASGI stands for Asynchronous Server Gateway Interface 

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_asgi_application()
