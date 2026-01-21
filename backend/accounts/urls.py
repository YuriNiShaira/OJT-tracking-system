from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('refresh/', views.refresh_token, name='refresh_token'),
    path('check-auth/', views.check_auth, name='check_auth'),
    path('profile/', views.get_profile, name='get_profile'),
    path('profile/', views.update_profile, name='update_profile'),
]