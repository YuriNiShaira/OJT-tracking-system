from django.contrib import admin
from .models import OJTListing, Application
# Register your models here.

@admin.register(OJTListing)
class OJTListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'company_name', 'ojt_type', 'location', 'status', 'application_deadline')
    list_filter = ('status', 'ojt_type', 'course_requirement', 'work_setup')
    search_fields = ('title', 'company__company_name', 'description')
    readonly_fields = ('created_at', 'updated_at', 'duration_months')
    fieldsets = (
        ('Basic Information', {
            'fields': ('company', 'title', 'description', 'responsibilities', 'learning_outcomes')
        }),
        ('Requirements', {
            'fields': ('ojt_type', 'required_hours', 'duration_weeks', 'work_setup', 'location')
        }),
        ('Student Requirements', {
            'fields': ('course_requirement', 'year_level_requirement', 'skills_required')
        }),
        ('Logistics', {
            'fields': ('slots_available', 'allowance', 'has_allowance', 'start_date', 'end_date', 'application_deadline')
        }),
        ('Status', {
            'fields': ('status', 'created_at', 'updated_at')
        }),
    )

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('student', 'listing_title', 'status', 'applied_at')
    list_filter = ('status', 'listing__company', 'applied_at')
    search_fields = ('student__username', 'student__first_name', 'listing__title')
    readonly_fields = ('applied_at', 'updated_at')
    fieldsets = (
        ('Application Details', {
            'fields': ('student', 'listing', 'cover_letter', 'resume', 'transcript', 'endorsement_letter')
        }),
        ('Status & Review', {
            'fields': ('status', 'interview_date', 'interview_notes', 'final_feedback')
        }),
        ('Timestamps', {
            'fields': ('applied_at', 'updated_at')
        }),
    )
    
    def listing_title(self, obj):
        return obj.listing.title
    listing_title.short_description = 'OJT Position'
