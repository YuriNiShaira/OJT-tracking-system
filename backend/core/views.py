from rest_framework import generics, permissions, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from .models import OJTListing, Application
from .serializers import OJTListingSerializer, ApplicationSerializer, ApplicationStatusSerializer
from datetime import date
# Create your views here.

class IsCompanyUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'company'
    
class IsStudentUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'
    
# OJT Listing Views
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

        # For non-authenticated or non-company users, show only active listings
        if not self.request.user.is_authenticated or self.request.user.role != 'company':
            queryset = queryset.filter(status='open')

        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(company=self.request.user)

class OJTListingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = OJTListing.objects.all()
    serializer_class = OJTListingSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsCompanyUser()]
        return [permissions.AllowAny()]
    
    def perform_update(self, serializer):
        if self.request.user != serializer.instance.company:
            raise permissions.PermissionDenied("You can only edit your own listings.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.company:
            raise permissions.PermissionDenied("You can only delete your own listings.")
        instance.delete()


# Application Views
class ApplicationListCreate(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsStudentUser()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user

        if user.role == 'student':
            return Application.objects.filter(student=user).order_by('-applied_at')
        elif user.role == 'company':
            return Application.objects.filter(listing__company = user).order_by('-applied_at')
        return Application.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

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
        
# Dashboard Stats Views
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

    total_applications = OJTListing.objects.filter(student=student).count()
    pending_applications = OJTListing.objects.filter(student = student, status='applied').count()
    accepted_applications = OJTListing.objects.filter(student=student, status='accepted').count()

    return Response({
        'total_applications': total_applications,
        'pending_applications': pending_applications,
        'accepted_applications': accepted_applications,
    })