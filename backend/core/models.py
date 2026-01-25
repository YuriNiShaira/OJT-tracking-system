from django.db import models
from accounts.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
# Create your models here.

class OJTListing(models.Model):
    COURSE_CHOICES = [
        ('cit', 'Information Technology (CIT)'),
        ('coa', 'Accountancy (COA)'),
        ('coed', 'Education (COED)'),
        ('chm', 'Hospitality Management (CBA)'),
        ('cba', 'Business Administration (CBA)'),
        ('all', 'All Courses'),
    ]

    YEAR_LEVEL_CHOICES = [
        (3, '3rd Year'),
        (4, '4th Year'),
        (0, 'Any Year Level'),
    ]

    OJT_TYPE_CHOICES = [
        ('required', 'Required (400-500 hours)'),
        ('elective', 'Elective/Optional'),
        ('summer', 'Summer OJT'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Open for Applications'),
        ('filled', 'Positions Filled'),
        ('closed', 'Closed'),
        ('ongoing', 'OJT Ongoing'),
    ]

    WORK_SETUP_CHOICES = [
        ('onsite', 'On-site (Face to Face)'),
        ('hybrid', 'Hybrid (Some WFH)'),
        ('wfh', 'Work From Home'),
    ]

    company = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=200, help_text="e.g., OJT Intern - IT Department")
    ojt_type = models.CharField(max_length=20, choices=OJT_TYPE_CHOICES, default='required')
    required_hours = models.IntegerField(default=500)
    duration_weeks = models.IntegerField(default=10, validators=[MinValueValidator(4), MaxValueValidator(26)])
    work_setup = models.CharField(max_length=50, choices=WORK_SETUP_CHOICES, default='onsite')
    location = models.CharField(max_length=200,)

    #OJT DETAILS
    description = models.TextField(help_text="What will the OJT intern do?")
    responsibilities = models.TextField(help_text="Specific tasks and responsibilities")
    learning_outcomes = models.TextField(help_text="What skills will the intern gain?")

    # Requirements from students
    course_requirement = models.CharField(max_length=20, choices=COURSE_CHOICES, default='all', help_text="Which course is this OJT for?")
    year_level_requirement = models.IntegerField(choices = YEAR_LEVEL_CHOICES, default=4)
    skills_required = models.TextField(blank=True, help_text="e.g., Basic programming, MS Office, Communication skills")

    slots_available = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    allowance = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    has_allowance = models.BooleanField(default=False)

    # Schedule
    start_date = models.DateField()
    end_date = models.DateField()
    application_deadline = models.DateField()

    #status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.company.company_name}"
    
    @property
    def is_active(self):
        return self.status == 'open'
    
    @property
    def company_name(self):
        return self.company.company_name
    
    @property
    def duration_months(self):
        """Calculate approximate duration in months"""
        return round(self.duration_weeks / 4.33, 1)
    
    def save(self, *args, **kwargs):
        # Auto-set has_allowance based on allowance field
        self.has_allowance = bool(self.allowance)
        super().save(*args, **kwargs)

class Application(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('under_review', 'Under Review'),
        ('for_interview', 'For Interview'),
        ('interviewed', 'Interviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    listing = models.ForeignKey(OJTListing, on_delete=models.CASCADE, related_name='applications')
    
    # Application details
    cover_letter = models.TextField()
    resume = models.FileField(upload_to='resumes/%Y/%m/%d/', null=True, blank=True)
    transcript = models.FileField(upload_to='transcripts/%Y/%m/%d/', null=True, blank=True)
    endorsement_letter = models.FileField(upload_to='endorsements/%Y/%m/%d/', null=True, blank=True)

    # Application status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Company response fields
    interview_date = models.DateTimeField(null=True, blank=True)
    interview_notes = models.TextField(blank=True)
    final_feedback = models.TextField(blank=True)

    class Meta:
        unique_together = ['student', 'listing']
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.student.username} - {self.listing.title}"
    

class Notification(models.Model):
    TYPE_CHOICES = [
        ('application_submitted', 'Application Submitted'),
        ('application_status_changed', 'Application Status Changed'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('new_application', 'New Application Received'),
        ('listing_closed', 'OJT Listing Closed'),
        ('deadline_reminder', 'Deadline Reminder'),
        ('system_announcement', 'System Announcement'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    data = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False)
    is_email_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

        def __str__(self):
            return f'{self.user.username} - {self.title}'
        
        def mark_as_read(self):
            self.is_read = True
            self.save()

        def mark_email_sent(self):
            self.is_email_sent = True
            self.save()