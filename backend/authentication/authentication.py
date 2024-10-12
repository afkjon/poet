from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)

        if header is None:
            return None
        
        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None
        
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token

    def refresh_token(self, request):
        refresh = request.COOKIES.get('refresh')
        if not refresh:
            raise AuthenticationFailed('No refresh token found')
        
        validated_token = self.get_validated_token(refresh)
        return self.get_user(validated_token), validated_token

