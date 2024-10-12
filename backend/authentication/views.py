from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from django.http import JsonResponse

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
                'email': user.email,
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
        return JsonResponse(
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
            refresh_token = RefreshToken.for_user(user)

            response = JsonResponse({
                    'email': user.email,
                    'access': str(access_token),
                    'refresh': str(refresh_token)
                    }, status=status.HTTP_200_OK)
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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


# User Logout
@api_view(['POST'])
@method_decorator(csrf_exempt, name='dispatch')
def LogoutView(request):
    logout(request)
    response = Response(status=status.HTTP_200_OK)
    response.delete_cookie('refresh')
    response.delete_cookie('access')
    return response

# User Profile
@api_view(['GET'])
@login_required
@method_decorator(csrf_exempt, name='dispatch')
def ProfileView(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Session Management
@api_view(['POST'])
@method_decorator(csrf_exempt, name='dispatch')
def SessionView(request):
    pass

# Blacklist Token
@api_view(['POST'])
@method_decorator(csrf_exempt, name='dispatch')
def BlacklistTokenView(request):
    refresh_token = request.data.get('refresh')
    if not token:
        return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        refresh_token = RefreshToken(token)
    except TokenError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    refresh_token.blacklist()
    return Response(status=status.HTTP_200_OK)

# User Profile
@api_view(['GET'])
@method_decorator(csrf_exempt, name='dispatch')
@login_required
def MeView(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)
