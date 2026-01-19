import React, { useState, useEffect } from 'react'
import {
  Box, Container, Heading, VStack, Text, Card, CardBody,
  FormControl, FormLabel, Input, Textarea, Select,
  NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper,
  Button, useToast, HStack, Alert, AlertIcon,
  Progress, Badge, Divider
} from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ojtService } from '../../services/ojtService'
import { FiSave, FiX, FiCalendar, FiClock } from 'react-icons/fi'

const EditListing = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsibilities: '',
    learning_outcomes: '',
    ojt_type: 'required',
    required_hours: 400,
    duration_weeks: 10,
    work_setup: 'onsite',
    location: '',
    course_requirement: 'all',
    year_level_requirement: 0,
    skills_required: '',
    slots_available: 1,
    allowance: '',
    start_date: '',
    end_date: '',
    application_deadline: '',
    status: 'open',
  })

  useEffect(() => {
    fetchListingDetails()
  }, [id])

  const fetchListingDetails = async () => {
    try {
      setLoading(true)
      const data = await ojtService.getListing(id)
      
      // Check if user owns this listing
      if (data.company !== user.id) {
        toast({
          title: 'Access Denied',
          description: 'You can only edit your own listings.',
          status: 'error',
          duration: 3000,
        })
        navigate('/company/listings')
        return
      }
      
      setFormData({
        title: data.title || '',
        description: data.description || '',
        responsibilities: data.responsibilities || '',
        learning_outcomes: data.learning_outcomes || '',
        ojt_type: data.ojt_type || 'required',
        required_hours: data.required_hours || 400,
        duration_weeks: data.duration_weeks || 10,
        work_setup: data.work_setup || 'onsite',
        location: data.location || '',
        course_requirement: data.course_requirement || 'all',
        year_level_requirement: data.year_level_requirement || 0,
        skills_required: data.skills_required || '',
        slots_available: data.slots_available || 1,
        allowance: data.allowance || '',
        start_date: data.start_date ? data.start_date.split('T')[0] : '',
        end_date: data.end_date ? data.end_date.split('T')[0] : '',
        application_deadline: data.application_deadline ? data.application_deadline.split('T')[0] : '',
        status: data.status || 'open',
      })
    } catch (error) {
      console.error('Error fetching listing:', error)
      toast({
        title: 'Error',
        description: 'Failed to load OJT listing',
        status: 'error',
        duration: 3000,
      })
      navigate('/company/listings')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleNumberChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    const today = new Date().toISOString().split('T')[0]
    
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.application_deadline) newErrors.application_deadline = 'Application deadline is required'
    
    if (formData.application_deadline) {
      if (new Date(formData.application_deadline) < new Date(today)) {
        newErrors.application_deadline = 'Deadline must be in the future'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: 'Please fix the errors',
        status: 'error',
        duration: 3000,
      })
      return
    }
    
    setSaving(true)
    
    try {
      // Prepare data for API
      const submissionData = {
        ...formData,
        allowance: formData.allowance ? parseFloat(formData.allowance) : null,
      }
      
      await ojtService.updateListing(id, submissionData)
      
      toast({
        title: 'Listing Updated!',
        description: 'Your OJT listing has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      navigate('/company/listings')
      
    } catch (error) {
      console.error('Error updating listing:', error)
      
      let errorMessage = 'Failed to update listing'
      if (error.response?.data) {
        const backendErrors = error.response.data
        const fieldErrors = {}
        
        Object.keys(backendErrors).forEach(key => {
          fieldErrors[key] = Array.isArray(backendErrors[key]) 
            ? backendErrors[key].join(' ') 
            : backendErrors[key]
        })
        
        setErrors(fieldErrors)
        errorMessage = 'Please check the form for errors'
      }
      
      toast({
        title: errorMessage,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/company/listings')
  }

  if (loading) {
    return (
      <Container maxW="container.lg" py={8}>
        <Progress size="xs" isIndeterminate colorScheme="yellow" />
      </Container>
    )
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Edit OJT Listing</Heading>
          <Text color="gray.600">
            Update your OJT position details
          </Text>
          <Badge colorScheme="blue" mt={2} px={3} py={1} borderRadius="full">
            Current Status: {formData.status.toUpperCase()}
          </Badge>
        </Box>

        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            {/* Basic Information */}
            <Card>
              <CardBody>
                <Heading size="md" mb={6}>Basic Information</Heading>
                
                <VStack spacing={4}>
                  <FormControl isRequired isInvalid={errors.title}>
                    <FormLabel>Position Title</FormLabel>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      size="lg"
                    />
                    {errors.title && <Text color="red.500" fontSize="sm">{errors.title}</Text>}
                  </FormControl>

                  <FormControl isRequired isInvalid={errors.description}>
                    <FormLabel>Job Description</FormLabel>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                    />
                    {errors.description && <Text color="red.500" fontSize="sm">{errors.description}</Text>}
                  </FormControl>

                  <FormControl>
                    <FormLabel>Responsibilities & Tasks</FormLabel>
                    <Textarea
                      name="responsibilities"
                      value={formData.responsibilities}
                      onChange={handleChange}
                      rows={3}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Learning Outcomes</FormLabel>
                    <Textarea
                      name="learning_outcomes"
                      value={formData.learning_outcomes}
                      onChange={handleChange}
                      rows={3}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* OJT Requirements */}
            <Card>
              <CardBody>
                <Heading size="md" mb={6}>
                  <FiClock style={{ display: 'inline', marginRight: '8px' }} />
                  OJT Requirements
                </Heading>
                
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>OJT Type</FormLabel>
                    <Select
                      name="ojt_type"
                      value={formData.ojt_type}
                      onChange={handleChange}
                    >
                      <option value="required">Required OJT (400-500 hours)</option>
                      <option value="elective">Elective/Optional OJT</option>
                      <option value="summer">Summer OJT</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Required Hours</FormLabel>
                    <NumberInput
                      min={400}
                      max={600}
                      value={formData.required_hours}
                      onChange={(value) => handleNumberChange('required_hours', value)}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Duration (Weeks)</FormLabel>
                    <NumberInput
                      min={4}
                      max={26}
                      value={formData.duration_weeks}
                      onChange={(value) => handleNumberChange('duration_weeks', value)}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Work Setup</FormLabel>
                    <Select
                      name="work_setup"
                      value={formData.work_setup}
                      onChange={handleChange}
                    >
                      <option value="onsite">On-site (Face to Face)</option>
                      <option value="hybrid">Hybrid (Some WFH)</option>
                      <option value="wfh">Work From Home</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired isInvalid={errors.location}>
                    <FormLabel>Location</FormLabel>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                    {errors.location && <Text color="red.500" fontSize="sm">{errors.location}</Text>}
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Student Requirements */}
            <Card>
              <CardBody>
                <Heading size="md" mb={6}>Student Requirements</Heading>
                
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Course Requirement</FormLabel>
                    <Select
                      name="course_requirement"
                      value={formData.course_requirement}
                      onChange={handleChange}
                    >
                      <option value="all">All Courses</option>
                      <option value="cit">Information Technology (CIT)</option>
                      <option value="coa">Accountancy (COA)</option>
                      <option value="coed">Education (COED)</option>
                      <option value="chm">Hospitality Management (CHM)</option>
                      <option value="cba">Business Administration (CBA)</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Year Level Requirement</FormLabel>
                    <Select
                      name="year_level_requirement"
                      value={formData.year_level_requirement}
                      onChange={handleChange}
                    >
                      <option value="0">Any Year Level</option>
                      <option value="3">3rd Year or Higher</option>
                      <option value="4">4th Year Only</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Skills Required (Optional)</FormLabel>
                    <Input
                      name="skills_required"
                      value={formData.skills_required}
                      onChange={handleChange}
                      placeholder="Comma separated skills"
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Logistics & Schedule */}
            <Card>
              <CardBody>
                <Heading size="md" mb={6}>
                  <FiCalendar style={{ display: 'inline', marginRight: '8px' }} />
                  Logistics & Schedule
                </Heading>
                
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Available Slots</FormLabel>
                    <NumberInput
                      min={1}
                      max={50}
                      value={formData.slots_available}
                      onChange={(value) => handleNumberChange('slots_available', value)}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Monthly Allowance (Optional)</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.allowance}
                      onChange={(value) => handleNumberChange('allowance', value)}
                    >
                      <NumberInputField placeholder="0.00" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl isRequired isInvalid={errors.application_deadline}>
                    <FormLabel>Application Deadline</FormLabel>
                    <Input
                      name="application_deadline"
                      type="date"
                      value={formData.application_deadline}
                      onChange={handleChange}
                    />
                    {errors.application_deadline && (
                      <Text color="red.500" fontSize="sm">{errors.application_deadline}</Text>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel>Listing Status</FormLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="open">Open for Applications</option>
                      <option value="closed">Closed</option>
                      <option value="filled">Positions Filled</option>
                      <option value="ongoing">OJT Ongoing</option>
                    </Select>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Form Actions */}
            <Card>
              <CardBody>
                <HStack spacing={4} justify="flex-end">
                  <Button
                    leftIcon={<FiX />}
                    onClick={handleCancel}
                    variant="outline"
                    size="lg"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    leftIcon={<FiSave />}
                    colorScheme="yellow"
                    size="lg"
                    isLoading={saving}
                    loadingText="Saving..."
                  >
                    Update Listing
                  </Button>
                </HStack>
                
                <Alert status="info" mt={6} borderRadius="md">
                  <AlertIcon />
                  Changes will be reflected immediately. Students will see the updated information.
                </Alert>
              </CardBody>
            </Card>
          </VStack>
        </form>
      </VStack>
    </Container>
  )
}

export default EditListing