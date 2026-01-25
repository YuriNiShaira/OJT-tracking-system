from rest_framework import generics, permissions, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from .models import OJTListing, Application, Notification
from .serializers import OJTListingSerializer, ApplicationSerializer, ApplicationStatusSerializer, NotificationSerializer
from datetime import date
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser

# Create your views here.

class IsCompanyUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'company'
    
class IsStudentUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'
    
class OJTListingListCreate(generics.ListCreateAPIView):
    serializer_class = OJTListingSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['ojt_type', 'location', 'course_requirement', 'work_setup', 'status']
    search_fields = ['title', 'description', 'company__company_name', 'skills_required']
    ordering_fields = ['created_at', 'application_deadline', 'start_date', 'allowance']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsCompanyUser()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        queryset = OJTListing.objects.all()

        user = self.request.user

        if user.is_authenticated and user.role == 'company':
            queryset = queryset.filter(company=user)
        else:
            queryset = queryset.filter(status='open')

        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(company = self.request.user)


class CompanyListingsList(generics.ListAPIView):
    serializer_class = OJTListingSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status']
    search_fields = ['title', 'description']

    def get_queryset(self):
        return OJTListing.objects.filter(company=self.request.user).order_by('-created_at')


class OJTListingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = OJTListing.objects.all()
    serializer_class = OJTListingSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated, IsCompanyUser()]
        return [permissions.AllowAny()]
    
    def get_object(self):
        obj = super().get_object()

        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            if obj.company != self.request.user:
                raise permissions.PermissionDenied("You can only edit your own listings.")
            
        return obj
    
    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()


class ApplicationListCreate(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated, IsStudentUser]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user

        if user.role == 'student':
            return Application.objects.filter(student = user).order_by('-applied_at')
        elif user.role == 'company':
            return Application.objects.filter(listing__company=user).order_by('-applied_at')
        return Application.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(student = self.request.user)

class ApplicationDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == 'student':
            return Application.objects.filter(student = user)
        elif user.role == 'company':
            return Application.objects.filter(listing__company = user)
        return Application.objects.none()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            if self.request.user.role == 'company':
                return ApplicationStatusSerializer
            return ApplicationSerializer
        

@api_view(['GET'])
@permission_classes([IsCompanyUser])
def company_dashboard_stats(request):
    company = request.user

    total_listings = OJTListing.objects.filter(company=company).count()
    active_listings = OJTListing.objects.filter(company=company, status='open').count()
    total_applications = Application.objects.filter(listing__company=company).count()
    pending_applications = Application.objects.filter(listing__company=company, status='applied').count()

    return Response({
        'total_listings': total_listings,
        'active_listings': active_listings,
        'total_applications': total_applications,
        'pending_applications': pending_applications,
    })

@api_view(['GET'])
@permission_classes([IsStudentUser])
def student_dashboard_stats(request):
    student = request.user

    total_applications = Application.objects.filter(student=student).count()
    pending_applications = Application.objects.filter(student=student, status='applied').count()
    accepted_applications = Application.objects.filter(student=student, status='accepted').count()

    return Response({
        'total_applications': total_applications,
        'pending_applications': pending_applications,
        'accepted_applications': accepted_applications,
    })


class NotificationList(generics.ListAPIView):
    """Get user's notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_notification_read(request, pk):
    """Mark a notification as read"""
    try:
        notification = Notification.objects.get(pk=pk, user=request.user)
        notification.mark_as_read()
        return Response({'success': True})
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=404)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_all_notifications_read(request):
    """Mark all notifications as read"""
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({'success': True})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def notification_stats(request):
    """Get notification statistics"""
    notifications = Notification.objects.filter(user=request.user)
    unread_count = notifications.filter(is_read=False).count()
    total_count = notifications.count()
    
    return Response({
        'unread_count': unread_count,
        'total_count': total_count,
    })
