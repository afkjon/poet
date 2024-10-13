from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from django.conf import settings
# User Registration
@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            access_token = AccessToken.for_user(user)
            refresh_token = RefreshToken.for_user(user)

            response = Response({
                'user_id': user.id,
                'access': str(access_token),
                'refresh': str(refresh_token)
            }, status=status.HTTP_201_CREATED)
            response.set_cookie(
                key='access',
                value=str(access_token),
                httponly=True,
                secure=True,
                max_age=60 * 30,  # 30 minutes
                samesite='Lax'
            )
            response.set_cookie(
                key='refresh',
                value=str(refresh_token),
                httponly=True,
                secure=True,
                max_age=60 * 60 * 24 * 7,  # 7 days
                samesite='Lax'
                )
            return response
        return Response(
            data={
                'errors': serializer.errors
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )

# User Login
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            access_token = AccessToken.for_user(user)

            # Add token claims
            access_token['user_id'] = user.id
            refresh_token = RefreshToken.for_user(user)

            response = Response({
                'user_id': user.id,
                'access': str(access_token),
                'refresh': str(refresh_token)
                }, status=status.HTTP_200_OK)
            
            # Set payload cookies
            response.set_cookie(
                key='access',
                value=str(access_token),
                httponly=True,
                secure=True,
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                samesite='Lax'
            )
            response.set_cookie(
                key='refresh',
                value=str(refresh_token),
                httponly=True,
                secure=True,
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                samesite='Lax'
            )
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


# User Logout
@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        response = Response(status=status.HTTP_200_OK)
        response.delete_cookie('refresh')
        response.delete_cookie('access')
        return response

# User Profile
@method_decorator(login_required, name='dispatch')
@method_decorator(csrf_exempt, name='dispatch')
class ProfileView(APIView):
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Session Management
@method_decorator(csrf_exempt, name='dispatch')
class SessionView(APIView):
    def post(self, request):
        pass

# Blacklist Token
@method_decorator(csrf_exempt, name='dispatch')
class BlacklistTokenView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            refresh_token = RefreshToken(refresh_token)
        except TokenError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        refresh_token.blacklist()
        return Response(status=status.HTTP_200_OK)

# Get Current User
@method_decorator(csrf_exempt, name='dispatch')
class CheckAuthenticatedView(APIView):
    def get(self, request):
        token = request.COOKIES.get('access')
        
        # Check if token is valid
        if token:
            try:
                return get_token_pair(request)
            except TokenError:
                return get_token_pair(request)
        return Response(
            {"error": "No token provided"}, 
            status=status.HTTP_401_UNAUTHORIZED
        )

def get_token_pair(request):
    refresh = RefreshToken(request.COOKIES.get('refresh'))
    refresh.access_token['user_id'] = refresh.payload.get('user_id')

    response = Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    })
    response.set_cookie(
        key='refresh',
        value=str(refresh),
        httponly=True,
        secure=True,
        expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
        samesite='Lax'
    )
    return response

# Get User by ID
@method_decorator(login_required, name='dispatch')
@method_decorator(csrf_exempt, name='dispatch')
class GetUserByIdView(APIView):
    def get(self, request, user_id):
        try:
            user = UserSerializer.get_user_by_id(user_id)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)