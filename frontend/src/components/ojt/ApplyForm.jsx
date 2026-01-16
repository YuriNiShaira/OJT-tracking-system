import React, { useState, useEffect } from 'react'
import {
  Box, Container, Heading, VStack, Text, FormControl,
  FormLabel, Textarea, Button, useToast, Card, CardBody,
  Alert, AlertIcon, Badge, HStack, Divider, Input, SimpleGrid
} from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ojtService } from '../../services/ojtService'
import { FiChevronLeft, FiFileText, FiUpload, FiCheck } from 'react-icons/fi'

const ApplyForm = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const toast = useToast()

    const [loading, setLoading] = useState(false)
    const [job, setJob] = useState(null)
    const [formData, setFormData] = useState({
        cover_letter: '',
        resume: null,
        transcript: null,
        endorsement_letter: null
    })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        fetchJobDetails()
    }, [id])

    const fetchJobDetails = async() => {
        try{
            const data = await ojtService.getListing(id)
            setJob(data)
            // check if student has requirements
            if(user){
                if(data.course_requirement !== 'all' && data.course_requirement !== user.course){
                    toast({
                        title: 'Course mismatch',
                        description:`This OJT is for ${getCourseName(data.course_requirement)} students only.`,
                        status: 'warning',
                        duration: 3000,
                    })
                }

                if(data.year_level_requirement > 0 && user.year_level < data.year_level_requirement){
                    toast({
                        title: 'Year Level Requirement',
                        description: `Minimum year level required: Year ${data.year_level_requirement}`,
                        status: 'warning',
                        duration: 5000,
                    })
                }
            }
        }catch(error){
            console.error('Error fetching job:', error)
            toast({
                title: 'Error',
                description: 'Failed to load OJT details',
                status: 'error',
                duration: 3000,
            })
            navigate('/ojt')
        }
    }

    const getCourseName = (courseCode) => {
        const courses = {
            'cit': 'Information Technology',
            'coa': 'Accountancy',
            'coed': 'Education',
            'chm': 'Hospitality Management',
            'cba': 'Business Administration',
            'all': 'All Courses'
        }
        return courses[courseCode] || courseCode
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if(errors[name]){
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleFileChange = (e) => {
        const { name, files } = e.target
        setFormData(prev => ({ ...prev, [name]: files[0] }))
        if(errors[name]){
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if(!formData.cover_letter.trim()){
            newErrors.cover_letter = 'Cover letter is required'
        }else if (formData.cover_letter.trim().length < 50){
            newErrors.cover_letter = 'Cover letter should be at least 50 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Simple validation
    if (!formData.cover_letter || formData.cover_letter.trim().length < 50) {
        toast({
        title: 'Cover letter too short',
        description: 'Please write at least 50 characters for your cover letter.',
        status: 'error',
        duration: 3000,
        })
        setErrors({ cover_letter: 'Minimum 50 characters required' })
        return
    }
    
    setLoading(true)
    
    try {
        // Send as JSON (no FormData, no files for now)
        const applicationData = {
        cover_letter: formData.cover_letter.trim(),
        listing: parseInt(id),  // Convert to number
        }
        
        console.log('Sending application (JSON only):', applicationData)
        
        // Use direct fetch with JSON
        const response = await fetch('http://localhost:8000/api/applications/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(applicationData),
        credentials: 'include',
        })
        
        const data = await response.json()
        console.log('Response status:', response.status)
        console.log('Response data:', data)
        
        if (!response.ok) {
        throw { response: { data, status: response.status } }
        }
        
        toast({
        title: 'Application Submitted!',
        description: 'Your application has been sent successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        })
        
        navigate('/student/applications')
        
    } catch (error) {
        console.error('Application error:', error.response?.data || error.message)
        
        let errorMessage = 'Failed to submit application'
        
        if (error.response?.data) {
        console.log('Backend error:', JSON.stringify(error.response.data, null, 2))
        
        if (error.response.data.cover_letter) {
            errorMessage = `Cover letter: ${error.response.data.cover_letter}`
            setErrors({ cover_letter: error.response.data.cover_letter })
        } else if (error.response.data.detail) {
            errorMessage = error.response.data.detail
        }
        }
        
        toast({
        title: errorMessage,
        status: 'error',
        duration: 5000,
        })
    } finally {
        setLoading(false)
    }
    }

    const handleCancel = () => {
        navigate(`/ojt/${id}`)
    }

    if(!job){
        return(
            <Container maxW="container.lg" py={8}>
                <Text>Loading...</Text>
            </Container>
        )
    }

    return(
        <Container maxW="container.lg" py={8}>
            <VStack spacing={8} align="stretch">
                {/* Header */}
                <Box>
                <Button
                    leftIcon={<FiChevronLeft />}
                    onClick={() => navigate(`/ojt/${id}`)}
                    variant="ghost"
                    mb={4}
                >
                    Back to OJT Details
                </Button>
                
                <Heading size="lg" mb={2}>Apply for OJT Position</Heading>
                <Text color="gray.600">
                    Submit your application for: <strong>{job.title}</strong>
                </Text>
                <Badge colorScheme="blue" mt={2} px={3} py={1} borderRadius="full">
                    {job.company_name}
                </Badge>
                </Box>

                {/* OJT Requirements Summary */}
                <Card>
                <CardBody>
                    <Heading size="md" mb={4}>Position Requirements</Heading>
                    <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between">
                        <Text fontWeight="medium">Course:</Text>
                        <Text>{getCourseName(job.course_requirement)}</Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text fontWeight="medium">Year Level:</Text>
                        <Text>
                        {job.year_level_requirement === 0 
                            ? 'Any year level' 
                            : `Year ${job.year_level_requirement} or higher`}
                        </Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text fontWeight="medium">Duration:</Text>
                        <Text>{job.duration_weeks} weeks ({job.required_hours} hours)</Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text fontWeight="medium">Location:</Text>
                        <Text>{job.location}</Text>
                    </HStack>
                    {job.skills_required && (
                        <Box>
                        <Text fontWeight="medium">Skills Required:</Text>
                        <Text color="gray.600">{job.skills_required}</Text>
                        </Box>
                    )}
                    </VStack>
                </CardBody>
                </Card>

                {/* Application Form */}
                <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                    <Card>
                    <CardBody>
                        <Heading size="md" mb={6} display="flex" alignItems="center">
                        <FiFileText style={{ marginRight: '8px' }} />
                        Application Details
                        </Heading>
                        
                        <VStack spacing={6}>
                        <FormControl isRequired isInvalid={errors.cover_letter}>
                            <FormLabel>Cover Letter</FormLabel>
                            <Textarea
                            name="cover_letter"
                            placeholder="Tell us why you're interested in this OJT position, what skills you have, and what you hope to learn..."
                            value={formData.cover_letter}
                            onChange={handleChange}
                            rows={8}
                            />
                            <Text fontSize="sm" color="gray.500" mt={2}>
                            Minimum 50 characters. Explain your interest and qualifications.
                            </Text>
                            {errors.cover_letter && (
                            <Text color="red.500" fontSize="sm">{errors.cover_letter}</Text>
                            )}
                        </FormControl>

                        <Divider />

                        <FormControl>
                            <FormLabel>Resume (Optional)</FormLabel>
                            <Box
                            border="2px dashed"
                            borderColor="gray.300"
                            borderRadius="md"
                            p={6}
                            textAlign="center"
                            cursor="pointer"
                            _hover={{ borderColor: 'blue.300' }}
                            onClick={() => document.getElementById('resume').click()}
                            >
                            <FiUpload size={24} style={{ margin: '0 auto 10px', color: '#718096' }} />
                            <Text>
                                {formData.resume 
                                ? `Selected: ${formData.resume.name}` 
                                : 'Click to upload resume (PDF/DOC/DOCX)'}
                            </Text>
                            <Text fontSize="sm" color="gray.500" mt={2}>
                                Max file size: 5MB
                            </Text>
                            </Box>
                            <Input
                            id="resume"
                            type="file"
                            name="resume"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                            display="none"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Transcript of Records (Optional)</FormLabel>
                            <Box
                            border="2px dashed"
                            borderColor="gray.300"
                            borderRadius="md"
                            p={6}
                            textAlign="center"
                            cursor="pointer"
                            _hover={{ borderColor: 'green.300' }}
                            onClick={() => document.getElementById('transcript').click()}
                            >
                            <FiUpload size={24} style={{ margin: '0 auto 10px', color: '#718096' }} />
                            <Text>
                                {formData.transcript 
                                ? `Selected: ${formData.transcript.name}` 
                                : 'Click to upload transcript (PDF)'}
                            </Text>
                            <Text fontSize="sm" color="gray.500" mt={2}>
                                Max file size: 5MB
                            </Text>
                            </Box>
                            <Input
                            id="transcript"
                            type="file"
                            name="transcript"
                            onChange={handleFileChange}
                            accept=".pdf"
                            display="none"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>School Endorsement Letter (Optional)</FormLabel>
                            <Box
                            border="2px dashed"
                            borderColor="gray.300"
                            borderRadius="md"
                            p={6}
                            textAlign="center"
                            cursor="pointer"
                            _hover={{ borderColor: 'purple.300' }}
                            onClick={() => document.getElementById('endorsement_letter').click()}
                            >
                            <FiUpload size={24} style={{ margin: '0 auto 10px', color: '#718096' }} />
                            <Text>
                                {formData.endorsement_letter 
                                ? `Selected: ${formData.endorsement_letter.name}` 
                                : 'Click to upload endorsement letter (PDF)'}
                            </Text>
                            <Text fontSize="sm" color="gray.500" mt={2}>
                                Required by some companies
                            </Text>
                            </Box>
                            <Input
                            id="endorsement_letter"
                            type="file"
                            name="endorsement_letter"
                            onChange={handleFileChange}
                            accept=".pdf"
                            display="none"
                            />
                        </FormControl>
                        </VStack>
                    </CardBody>
                    </Card>

                    {/* Application Tips */}
                    <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                        <Text fontWeight="bold">Tips for a successful application:</Text>
                        <Text fontSize="sm">
                        1. Customize your cover letter for this specific OJT position<br />
                        2. Highlight relevant skills and coursework<br />
                        3. Mention what you hope to learn from the experience<br />
                        4. Proofread before submitting
                        </Text>
                    </Box>
                    </Alert>

                    {/* Student Info */}
                    {user && (
                    <Card>
                        <CardBody>
                        <Heading size="md" mb={4}>Your Information</Heading>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <Box>
                            <Text fontWeight="medium">Name</Text>
                            <Text>{user.first_name} {user.last_name}</Text>
                            </Box>
                            <Box>
                            <Text fontWeight="medium">Student ID</Text>
                            <Text>{user.student_id || 'Not provided'}</Text>
                            </Box>
                            <Box>
                            <Text fontWeight="medium">Course</Text>
                            <Text>{getCourseName(user.course)}</Text>
                            </Box>
                            <Box>
                            <Text fontWeight="medium">Year Level</Text>
                            <Text>Year {user.year_level}</Text>
                            </Box>
                        </SimpleGrid>
                        </CardBody>
                    </Card>
                    )}

                    {/* Form Actions */}
                    <Card>
                    <CardBody>
                        <HStack spacing={4} justify="flex-end">
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                            size="lg"
                        >
                            Cancel
                        </Button>
                        
                        <Button
                            type="submit"
                            colorScheme="yellow"
                            size="lg"
                            isLoading={loading}
                            loadingText="Submitting..."
                            leftIcon={<FiCheck />}
                        >
                            Submit Application
                        </Button>
                        </HStack>
                        
                        <Text fontSize="sm" color="gray.500" mt={4} textAlign="center">
                        By submitting, you agree that your information will be shared with {job.company_name}
                        </Text>
                    </CardBody>
                    </Card>
                </VStack>
                </form>
            </VStack>
            </Container>
    )

}
export default ApplyForm