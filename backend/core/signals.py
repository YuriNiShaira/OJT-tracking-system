from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Application, OJTListing, Notification

@receiver(post_save, sender=Application)
def create_application_notifications(sender, instance, created, **kwargs):
    """Create notifications when application is created or updated"""
    if created:
        # Notification for student
        Notification.objects.create(
            user=instance.student,
            notification_type='application_submitted',
            title='Application Submitted',
            message=f'Your application for "{instance.listing.title}" has been submitted successfully.',
            data={'listing_id': instance.listing.id, 'application_id': instance.id}
        )
        
        # Notification for company
        Notification.objects.create(
            user=instance.listing.company,
            notification_type='new_application',
            title='New Application Received',
            message=f'New application received for "{instance.listing.title}" from {instance.student.first_name} {instance.student.last_name}.',
            data={'listing_id': instance.listing.id, 'application_id': instance.id, 'student_id': instance.student.id}
        )
    
    # Notification for status changes
    elif 'status' in instance.get_dirty_fields():
        if instance.status in ['accepted', 'rejected']:
            # Notification for student
            Notification.objects.create(
                user=instance.student,
                notification_type='application_status_changed',
                title=f'Application {instance.status.capitalize()}',
                message=f'Your application for "{instance.listing.title}" has been {instance.status}.',
                data={'listing_id': instance.listing.id, 'application_id': instance.id, 'status': instance.status}
            )
        
        elif instance.status == 'for_interview':
            Notification.objects.create(
                user=instance.student,
                notification_type='interview_scheduled',
                title='Interview Scheduled',
                message=f'You have been scheduled for an interview for "{instance.listing.title}".',
                data={'listing_id': instance.listing.id, 'application_id': instance.id}
            )

@receiver(post_save, sender=OJTListing)
def create_listing_notifications(sender, instance, **kwargs):
    """Create notifications when listing status changes"""
    if 'status' in instance.get_dirty_fields():
        if instance.status == 'closed':
            # Notify applicants
            applications = Application.objects.filter(listing=instance, status='applied')
            for application in applications:
                Notification.objects.create(
                    user=application.student,
                    notification_type='listing_closed',
                    title='OJT Position Closed',
                    message=f'The OJT position "{instance.title}" has been closed. Your application will no longer be considered.',
                    data={'listing_id': instance.id}
                )