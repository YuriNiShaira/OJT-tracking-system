from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import exceptions

# accounts/authentication.py
class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Try to get token from cookie
        access_token = request.COOKIES.get('access_token')
        
        # If no token, just return None (allow request to proceed)
        if not access_token:
            return None  # ✅ This allows unauthenticated requests
        
        # Validate token only if present
        try:
            validated_token = self.get_validated_token(access_token)
            user = self.get_user(validated_token)
            return (user, validated_token)
        except:
            # If token is invalid, still return None for registration
            return None  # ✅ Don't raise exception for registration