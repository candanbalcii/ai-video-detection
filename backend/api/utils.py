from django.core.mail import send_mail, BadHeaderError
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from django.conf import settings
import logging

# Set up logging
logger = logging.getLogger(__name__)

def send_verification_email(user, request):
    try:
        # Generate token and UID
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(user.pk.encode())

        # Get domain name for the current site
        domain = get_current_site(request).domain
        link = f"http://{domain}/verify-email/{uid}/{token}/"

        # Email content
        subject = "Email Verification"
        message = render_to_string(
            'email/verification_email.html',
            {'link': link, 'user': user}
        )

        # Send the email
        send_mail(subject, message, 'detectaiteam@gmail.com', [user.email])

        # Optionally log a success message
        logger.info(f"Verification email sent to {user.email}")

    except BadHeaderError:
        # Custom error handling for BadHeaderError (invalid email header)
        logger.error(f"Failed to send email to {user.email}: Invalid header.")
        raise ValueError("Invalid header found.")
    except Exception as e:
        # Log the error and raise it with a custom message
        logger.error(f"Failed to send email to {user.email}: {str(e)}")
        raise ValueError("An error occurred while sending the email. Please try again later.")

