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

    #Notif
    path('notifications/', views.NotificationList.as_view(), name='notifications-list'),
    path('notifications/<int:pk>/read/', views.mark_notification_read, name='mark-notification-read'),
    path('notifications/read-all/', views.mark_all_notifications_read, name='mark-all-notifications-read'),
    path('notifications/stats/', views.notification_stats, name='notification-stats'),
]