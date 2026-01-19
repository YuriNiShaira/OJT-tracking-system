from django.urls import path
from . import views

urlpatterns = [
    # Public listings (anyone can view active listings)
    path('listings/', views.OJTListingListCreate.as_view(), name='listings-list'),
    path('listings/<int:pk>/', views.OJTListingDetail.as_view(), name='listings-detail'),
    
    # Company's own listings (protected)
    path('company/listings/', views.CompanyListingsList.as_view(), name='company-listings'),
    
    # Applications
    path('applications/', views.ApplicationListCreate.as_view(), name='applications-list'),
    path('applications/<int:pk>/', views.ApplicationDetail.as_view(), name='applications-detail'),
    
    # Dashboard Stats
    path('dashboard/company-stats/', views.company_dashboard_stats, name='company-stats'),
    path('dashboard/student-stats/', views.student_dashboard_stats, name='student-stats'),
]