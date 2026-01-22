from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserProfileSerializer

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()

    refresh = RefreshToken.for_user(user)

    response = Response({
        'success': True,
        'user': UserProfileSerializer(user).data
    }, status=status.HTTP_201_CREATED)

    response.set_cookie(
        key='access_token',
        value=str(refresh.access_token),
        httponly=True,
        secure=False,
        samesite='Lax',
        max_age=3600
    )

    response.set_cookie(
        key='refresh_token',
        value=str(refresh),
        httponly=True,
        secure=False,
        samesite='Lax',
        max_age=604800
    )

    return response


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        response = Response({
            'success': True,
            'user': UserProfileSerializer(user).data
        })
        
        # Set cookies
        response.set_cookie(
            key='access_token',
            value=str(refresh.access_token),
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=3600
        )
        
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=604800
        )
        
        return response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    response = Response({'success': True})
    
    # Delete cookies
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    
    return response

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def refresh_token(request):
    refresh_token = request.COOKIES.get('refresh_token')
    
    if not refresh_token:
        return Response({'error': 'Refresh token not found'}, status=400)
    
    try:
        refresh = RefreshToken(refresh_token)
        new_access_token = str(refresh.access_token)
        
        response = Response({'success': True})
        response.set_cookie(
            key='access_token',
            value=new_access_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=3600
        )
        
        return response
    except Exception as e:
        return Response({'error': 'Invalid refresh token'}, status=400)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def check_auth(request):
    return Response({
        'success': True,
        'user': UserProfileSerializer(request.user).data
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_profile(request):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profile(request):
    user = request.user

    if request.method == 'GET':
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    elif request.method == 'PATCH':
        serializer = UserProfileSerializer(user, data = request.data, partial=True)
        if serializer.is_valid():
            if 'profile_image' in request.FILES:
                user.profile_image = request.FILES['profile_image']

            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
