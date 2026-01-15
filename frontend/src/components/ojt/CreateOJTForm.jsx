import React, { useState } from 'react'
import {
  Box, Container, Heading, VStack, HStack, Text,
  FormControl, FormLabel, Input, Textarea, Select,
  NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper,
  Button, useToast, Card, CardBody, SimpleGrid,
  Switch, Divider, Badge, Alert, AlertIcon,
  Grid, GridItem
} from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ojtService } from '../../services/ojtService'
import { FiSave, FiX, FiCalendar, FiClock, FiMapPin, FiDollarSign } from 'react-icons/fi'
import Navbar from '../Navbar'
import SideBar from '../Layout/Sidebar'


const CreateOJTForm = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const toast = useToast()

    const [loading, setLoading] = useState(false)
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
    })

    const ojtTypes = [
        { value: 'required', label: 'Required OJT (400-500 hours)' },
        { value: 'elective', label: 'Elective/Optional OJT' },
    ]

    const workSetups = [
        { value: 'onsite', label: 'On-site (Face to Face)' },
        { value: 'hybrid', label: 'Hybrid (Some Work From Home)' },
        { value: 'wfh', label: 'Work From Home' },
    ]  

    const courses = [
        { value: 'all', label: 'All Courses' },
        { value: 'cit', label: 'Information Technology (CIT)' },
        { value: 'coa', label: 'Accountancy (COA)' },
        { value: 'coed', label: 'Education (COED)' },
        { value: 'chm', label: 'Hospitality Management (CHM)' },
        { value: 'cba', label: 'Business Administration (CBA)' },
    ]

    const yearLevels = [
        { value: 0, label: 'Any Year Level' },
        { value: 3, label: '3rd Year or Higher' },
        { value: 4, label: '4th Year Only' },
    ]

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if(errors[name]){
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

        if(!formData.title.trim()) newErrors.title = 'Title is required'
        if(!formData.description.trim()) newErrors.description = 'Description is required'
        if(!formData.description.trim()) newErrors.location = 'Location is required'
        if(!formData.start_date) newErrors.start_date = 'Start date is required'
        if(!formData.end_date) newErrors.end_date = 'End date is required'
        if(!formData.application_deadline) newErrors.application_deadline = 'Application deadline is required'
        
        if(formData.start_date && formData.end_date) {
            if(new Date(formData.start_date) >= new Date(formData.end_date)) {
                newErrors.end_date = 'End date must be after date'
            }
        }

        if(formData.application_deadline){
            if(new Date(formData.application_deadline) < new Date(today)){
                newErrors.application_deadline = 'Deadline must be in the future'
            }
            if(formData.start_date && new Date(formData.application_deadline) > new Date(formData.start_date)){
                newErrors.application_deadline = 'Deadline must be before start date'
            }
        }

        if(formData.required_hours < 400 || formData.required_hours > 600) {
            newErrors.required_hours = 'OJT hours must be between 400-500 hours'
        }

        if(formData.duration_weeks < 4 || formData.duration_weeks > 26){
            newErrors.duration_weeks = 'Duration should be 4-26weeks'
        }

        if(formData.slots_available < 1){
            newErrors.slots_available = 'At least 1 slot required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }


    const handleSubmit = async(e) => {
        e.preventDefault()

        if(!validateForm()){
            toast({
                title: 'Please fix errors',
                status: 'error',
                duration: 3000
            })
            return
        }
        setLoading(true)

        try{
            // Prepare data for API
            const submissionData = {
                ...formData,
                allowance: formData.allowance ? parseFloat(formData.allowance): null,
            }
            
            await ojtService.createListing(submissionData)

            toast({
                title: 'OJT Position Created!',
                description: 'Your OJT listing has been posted successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            
            navigate('/company/listings')

        }catch(error){
            console.error('Error creating OJT:', error)

            let errorMessage = 'Failed to create OJT listing'
            if(error.response?.data){
                // Handle backend validation errors
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
                title: 'error message',
                status: 'error',
                duration: 3000
            })
        }finally{
            setLoading(false)
        }
    }

    const handleCancel = () => {
        if(window.confirm('Are you sure? Any unsaved changes will be lost.')){
            navigate('/dashboard')
        }
    }

    const calculateEndDate = () => {
    if (formData.start_date && formData.duration_weeks) {
        const start = new Date(formData.start_date)
        const end = new Date(start.getTime() + (formData.duration_weeks * 7 * 24 * 60 * 60 * 1000))
        return end.toISOString().split('T')[0]
    }
    return ''
    }

    const updateEndDate = () => {
        const calculatedEnd = calculateEndDate()
        if(calculatedEnd){
            setFormData(prev => ({ ...prev, end_date: calculatedEnd }))
        }
    }

    return (
        <>
        <Navbar />
        <Container maxW='container.lg' py={8}>
            <VStack spacing={8} align = 'stretch'>
                {/* Header */}
                <Box>
                    <Heading size='lg' mb={2}>Create OJT Position</Heading>
                    <Text color='gray.600'>
                        Post a new internship opportunity for students. Fill in all required fields.
                    </Text>
                    <Badge colorScheme='blue' mt={2} px={3} py={1} borderRadius='full'>
                        Company: {user?.company_name}
                    </Badge>
                </Box>

                <form onSubmit={handleSubmit}>
                    <VStack spacing={8} align='stretch'>
                        <Card>
                            <CardBody>
                                <Heading size='md' mb={6} color='blue.600'>
                                    <FiCalendar style = {{ display:'inline', marginRight:'8px' }}/>
                                    Information
                                </Heading>

                                <VStack spacing={6}>
                                    <FormControl isRequired isInvalid = {errors.title}>
                                        <FormLabel>Position Title</FormLabel>
                                        <Input 
                                            name='title'
                                            placeholder="OJT Position"
                                            value={formData.title}
                                            onChange={handleChange}
                                            size="lg"
                                        />
                                        {errors.title && <Text color="red.500" fontSize="sm">{ errors.title }</Text>}
                                    </FormControl>

                                    <FormControl isRequired isInvalid={errors.description}>
                                        <FormLabel>Job Description</FormLabel>
                                            <Textarea
                                                name="description"
                                                placeholder="Describe the OJT position, what the intern will do, team they'll work with"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={4}
                                            />
                                        <Text fontSize="sm" color="gray.500" mt={2}>
                                            Be specific about tasks and learning opportunities
                                        </Text>
                                        {errors.description && <Text color="red.500" fontSize="sm">{errors.description}</Text>}
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Responsibilities & Tasks</FormLabel>
                                            <Textarea
                                                name="responsibilities"
                                                placeholder="List expected task and responsibilites"
                                                value={formData.responsibilities}
                                                onChange={handleChange}
                                                rows={3}
                                            />
                                        <Text fontSize="sm" color="gray.500" mt={2}>
                                            Example: • Assist in web development • Fix bugs • Write documentation
                                        </Text>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Learning Outcomes</FormLabel>
                                            <Textarea
                                                name="learning_outcomes"
                                                placeholder="What skills and knowledge will the intern gain?"
                                                value={formData.learning_outcomes}
                                                onChange={handleChange}
                                                rows={3}
                                            />
                                        <Text fontSize="sm" color="gray.500" mt={2}>
                                            Example: To communicate properly, Real world job experience
                                        </Text>
                                    </FormControl>
                                </VStack>
                            </CardBody>
                        </Card>

                        {/* Section 2: OJT Requirements */}
                        <Card>
                            <CardBody>
                                <Heading size="md" mb={6} color="green.600">
                                    <FiClock style={{ display: 'inline', marginRight: '8px' }} />
                                    OJT Requirements
                                </Heading>

                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                    <FormControl isRequired>
                                        <FormLabel>OJT Type</FormLabel>
                                        <Select
                                            name="ojt_type"
                                            value={formData.ojt_type}
                                            onChange={handleChange}
                                        >
                                            {ojtTypes.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
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
                                            <Text fontSize="sm" color="gray.500" mt={2}>
                                            Typically 400-500 hours for required OJT
                                            </Text>{errors.required_hours && <Text color="red.500" fontSize="sm">{errors.required_hours}</Text>}
                                    </FormControl>

                                    <FormControl isRequired isInvalid={errors.duration_weeks}>
                                        <FormLabel>Duration (Weeks)</FormLabel>
                                        <NumberInput
                                            min={4}
                                            max={26}
                                            value={formData.duration_weeks}
                                            onChange={(value) => handleNumberChange('duration_weeks', value)}
                                            onBlur={updateEndDate}
                                            >
                                        <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                        {errors.duration_weeks && <Text color="red.500" fontSize="sm">{errors.duration_weeks}</Text>}
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Work Setup</FormLabel>
                                        <Select
                                        name="work_setup"
                                        value={formData.work_setup}
                                        onChange={handleChange}
                                        >
                                        {workSetups.map(setup => (
                                            <option key={setup.value} value={setup.value}>
                                            {setup.label}
                                            </option>
                                        ))}
                                        </Select>
                                    </FormControl>

                                    <GridItem colSpan={{ base: 1, md: 2 }}>
                                        <FormControl isRequired isInvalid={errors.location}>
                                        <FormLabel>Location</FormLabel>
                                        <Input
                                            name="location"
                                            placeholder="Complete office address"
                                            value={formData.location}
                                            onChange={handleChange}
                                        />
                                        {errors.location && <Text color="red.500" fontSize="sm">{errors.location}</Text>}
                                        </FormControl>
                                    </GridItem>                                   
                                </SimpleGrid>
                            </CardBody>
                        </Card>

                        {/* Section 3: Student Requirements */}
                        <Card>
                            <CardBody>
                                <Heading size="md" mb={6} color="purple.600">
                                Student Requirements
                                </Heading>
                                
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                <FormControl>
                                    <FormLabel>Course Requirement</FormLabel>
                                    <Select
                                    name="course_requirement"
                                    value={formData.course_requirement}
                                    onChange={handleChange}
                                    >
                                    {courses.map(course => (
                                        <option key={course.value} value={course.value}>
                                        {course.label}
                                        </option>
                                    ))}
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Year Level Requirement</FormLabel>
                                    <Select
                                    name="year_level_requirement"
                                    value={formData.year_level_requirement}
                                    onChange={handleChange}
                                    >
                                    {yearLevels.map(level => (
                                        <option key={level.value} value={level.value}>
                                        {level.label}
                                        </option>
                                    ))}
                                    </Select>
                                </FormControl>
                                    <GridItem colSpan={{ base: 1, md: 2 }}>
                                        <FormControl>
                                            <FormLabel>Skills Required (Optional)</FormLabel>
                                            <Textarea
                                                name="skills_required"
                                                placeholder="List any specific skills or knowledge required"
                                                value={formData.skills_required}
                                                onChange={handleChange}
                                                rows={2}
                                            />
                                            <Text fontSize="sm" color="gray.500" mt={2}>
                                                Example: Basic programming, MS Office, Communication skills, Teamwork
                                            </Text>
                                        </FormControl>
                                    </GridItem>
                                </SimpleGrid>
                            </CardBody>
                        </Card>
                        
                        {/* Section 4: Logistics */}
                        <Card>
                            <CardBody>
                                <Heading size="md" mb={6} color="orange.600">
                                    <FiDollarSign style={{ display: 'inline', marginRight: '8px' }} />
                                    Logistics & Schedule
                                </Heading>
                                
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                    <FormControl isRequired isInvalid={errors.slots_available}>
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
                                        <Text fontSize="sm" color="gray.500" mt={2}>
                                            How many interns can you accept?
                                        </Text>
                                        {errors.slots_available && <Text color="red.500" fontSize="sm">{errors.slots_available}</Text>}
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
                                        <Text fontSize="sm" color="gray.500" mt={2}>
                                            Enter 0 or leave empty if no allowance
                                        </Text>
                                    </FormControl>

                                    <FormControl isRequired isInvalid={errors.start_date}>
                                        <FormLabel>Start Date</FormLabel>
                                        <Input
                                            name="start_date"
                                            type="date"
                                            value={formData.start_date}
                                            onChange={handleChange}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                        {errors.start_date && <Text color="red.500" fontSize="sm">{errors.start_date}</Text>}
                                    </FormControl>

                                    <FormControl isRequired isInvalid={errors.end_date}>
                                        <FormLabel>End Date</FormLabel>
                                        <Input
                                            name="end_date"
                                            type="date"
                                            value={formData.end_date}
                                            onChange={handleChange}
                                            min={formData.start_date || new Date().toISOString().split('T')[0]}
                                            readOnly={!!formData.start_date && !!formData.duration_weeks}
                                            bg={formData.start_date && formData.duration_weeks ? 'gray.50' : 'white'}
                                        />
                                        <Text fontSize="sm" color="gray.500" mt={2}>
                                            {formData.start_date && formData.duration_weeks 
                                                ? 'Calculated from start date and duration' 
                                                : 'Select end date'}
                                        </Text>
                                        {errors.end_date && <Text color="red.500" fontSize="sm">{errors.end_date}</Text>}
                                    </FormControl>

                                    <GridItem colSpan={{ base: 1, md: 2 }}>
                                        <FormControl isRequired isInvalid={errors.application_deadline}>
                                            <FormLabel>Application Deadline</FormLabel>
                                            <Input
                                                name="application_deadline"
                                                type="date"
                                                value={formData.application_deadline}
                                                onChange={handleChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                max={formData.start_date}
                                            />
                                            <Text fontSize="sm" color="gray.500" mt={2}>
                                                Last day students can apply (must be before start date)
                                            </Text>
                                            {errors.application_deadline && <Text color="red.500" fontSize="sm">{errors.application_deadline}</Text>}
                                        </FormControl>
                                    </GridItem>
                                </SimpleGrid>
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
                                    isLoading={loading}
                                    loadingText="Creating..."
                                >
                                    Create OJT Position
                                </Button>
                                </HStack>
                                
                                <Alert status="info" mt={6} borderRadius="md">
                                <AlertIcon />
                                Your OJT listing will be reviewed and visible to students immediately after creation.
                                </Alert>
                            </CardBody>
                        </Card>
                    </VStack>
                </form>
            </VStack>
        </Container>
    </>
    )

}
export default CreateOJTForm