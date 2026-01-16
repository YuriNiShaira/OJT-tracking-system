from rest_framework import serializers
from .models import OJTListing, Application
from accounts.serializers import UserProfileSerializer
from datetime import date

class OJTListingSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.company_name', read_only = True)
    company_details = UserProfileSerializer(source='company', read_only= True)
    duration_months = serializers.FloatField(read_only = True)
    is_expired = serializers.SerializerMethodField()

    class Meta:
        model = OJTListing
        fields = [
            'id', 'title', 'ojt_type', 'required_hours', 'duration_weeks', 'duration_months',
            'work_setup', 'location', 'description', 'responsibilities', 'learning_outcomes',
            'course_requirement', 'year_level_requirement', 'skills_required',
            'slots_available', 'allowance', 'has_allowance', 'start_date', 'end_date',
            'application_deadline', 'status', 'created_at', 'company', 'company_name',
            'company_details', 'is_expired'
        ]
        read_only_fields = ['company', 'status', 'created_at', 'updated_at', 'has_allowance']
    
    def get_is_expired(self, obj):
        return obj.application_deadline < date.today()
    
    def validate(self, data):
        # Company validation
        if 'company' in self.context and self.context['company'].role != 'company':
            raise serializers.ValidationError("Only companies can create OJT listings.")
        
        # Date validation
        if data.get('start_date') and data.get('end_date'):
            if data['start_date'] >= data['end_date']:
                raise serializers.ValidationError({"end_date": "End date must be after start date."})
        
        if data.get('application_deadline'):
            if data['application_deadline'] > data.get('start_date', date.today()):
                raise serializers.ValidationError({"application_deadline": "Deadline must be before start date."})
            
            if data['application_deadline'] < date.today():
                raise serializers.ValidationError({"application_deadline": "Deadline must be in the future."})
        
        # Hours validation
        if data.get('required_hours'):
            if data['required_hours'] < 400 or data['required_hours'] > 600:
                raise serializers.ValidationError({
                    "required_hours": "OJT hours typically range from 400 to 500 hours."
                })
        
        return data
    
class ApplicationSerializer(serializers.ModelSerializer):
    student_details = UserProfileSerializer(source='student', read_only=True)
    listing_details = OJTListingSerializer(source='listing', read_only=True)
    can_withdraw = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            'id', 'student', 'listing', 'cover_letter', 'resume', 'transcript',
            'endorsement_letter', 'status', 'applied_at', 'interview_date',
            'interview_notes', 'final_feedback', 'student_details', 'listing_details',
            'can_withdraw'
        ]
        read_only_fields = ['student', 'applied_at', 'interview_date', 'interview_notes', 'final_feedback']
    
    def get_can_withdraw(self, obj):
        return obj.status in ['applied', 'under_review', 'for_interview']
    
    def validate(self, data):
        request = self.context['request']
        user = request.user

        # Only students can apply or withdraw
        if user.role != 'student':
            raise serializers.ValidationError('Only students can apply for OJT positions.')

        # ✅ If PATCH, skip apply validations
        if request.method in ['PATCH', 'PUT']:
            return data

        # ===== APPLY VALIDATIONS (POST only) =====
        listing = data.get('listing')

        if not listing:
            raise serializers.ValidationError({'listing': 'OJT position is required.'})

        if Application.objects.filter(
            student=user,
            listing=listing,
            status__in=['applied', 'under_review', 'for_interview']
        ).exists():
            raise serializers.ValidationError(
                {'detail': 'You already have an active application for this position.'}
            )

        if listing.course_requirement != 'all' and listing.course_requirement != user.course:
            raise serializers.ValidationError(
                {'course': f'This OJT is for {listing.get_course_requirement_display()} students only.'}
            )

        if listing.year_level_requirement > 0 and user.year_level < listing.year_level_requirement:
            raise serializers.ValidationError(
                {'year_level': f'Minimum year level required: {listing.get_year_level_requirement_display()}'}
            )

        if listing.application_deadline < date.today():
            raise serializers.ValidationError(
                {'deadline': 'Application deadline has passed.'}
            )

        return data

    
    def create(self, validated_data):
        user = self.context['request'].user
        listing = validated_data['listing']

        # Check for withdrawn/rejected application
        existing = Application.objects.filter(
            student=user,
            listing=listing,
            status__in=['withdrawn', 'rejected']
        ).first()

        if existing:
            # Re-activate application
            existing.status = 'applied'
            existing.cover_letter = validated_data.get('cover_letter', existing.cover_letter)
            existing.resume = validated_data.get('resume', existing.resume)
            existing.save()
            return existing

        # Normal create
        validated_data['student'] = user
        return super().create(validated_data)

class ApplicationStatusSerializer(serializers.ModelSerializer):
    """Serializer for companies to update application status"""
    class Meta:
        model = Application
        fields = ['status', 'interview_date', 'interview_notes', 'final_feedback']