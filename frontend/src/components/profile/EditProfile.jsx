import React, { useState, useEffect } from 'react'
import {
  Box, Container, Heading, VStack, Text, Card, CardBody,
  FormControl, FormLabel, Input, Select, Button, useToast,
  Avatar, HStack, Divider, Alert, AlertIcon, Progress,
  NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper,
  Textarea, Switch, Badge
} from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FiSave, FiX, FiUpload, FiUser, FiMail, FiPhone } from 'react-icons/fi'

const EditProfile = () => {
  const { user, checkAuth } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    student_id: '',
    course: '',
    year_level: '',
    bio: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        student_id: user.student_id || '',
        course: user.course || '',
        year_level: user.year_level || '',
        bio: user.bio || '',
      })
      
      if (user.profile_image) {
        setImagePreview(`http://localhost:8000${user.profile_image}`)
      }
    }
  }, [user])

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if(errors[name]){
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleNumberChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || '' }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if(file){
      setProfileImage(file)

      const reader = new FileReader()
      reader.onloadend = () =>{
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if(!formData.first_name.trim()) newErrors.first_name = 'First name is required'
    if(!formData.last_name.trim()) newErrors.last_name = 'Last name is required'
    if(!formData.email.trim()) newErrors.email = 'Email is required'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if(formData.phone && !/^[0-9+\-\s()]*$/.test(formData.phone)){
      newErrors.phone ='Enter a valid phone number'
    }

    if(user?.role === 'student' && !formData.student_id.trim()){
      newErrors.student_id = 'Student Id is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async(e) => {
    e.preventDefault()

    if(!validateForm()){
      toast({
        title: 'Please fix Errors',
        status: 'error',
        duration: 3000
      })
      return 
    }
    setSaving(true)

    try{
      const formDataToSend = new FormData()


      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key])
        }
      })

      if (profileImage) {
        formDataToSend.append('profile_image', profileImage)
      }
      
      const response = await fetch('http://localhost:8000/api/auth/profile/update/', {
        method: 'PATCH',
        body: formDataToSend,
        credentials: 'include',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw { response: { data } }
      }

      await checkAuth()
      
      toast({
        title: 'Profile Updated!',
        description: 'Your profile has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      navigate('/profile')
    }catch (error) {
      console.error('Error updating profile:', error)
      
      let errorMessage = 'Failed to update profile'
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
    navigate('/dashboard')
  }

  const getCourseName = (courseCode) => {
    const courses = {
      'cit': 'Information Technology',
      'coa': 'Accountancy',
      'coed': 'Education',
      'chm': 'Hospitality Management',
      'cba': 'Business Administration'
    }
    return courses[courseCode] || courseCode
  }

  if (!user) {
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
          <Heading size="lg" mb={2}>Edit Profile</Heading>
          <Text color="gray.600">
            Update your personal information and preferences
          </Text>
          <Badge colorScheme={user.role === 'student' ? 'green' : 'blue'} mt={2} px={3} py={1} borderRadius="full">
            {user.role === 'student' ? 'Student Account' : 'Company Account'}
          </Badge>
        </Box>

        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            {/* Profile Picture */}
            <Card>
              <CardBody>
                <Heading size="md" mb={6}>Profile Picture</Heading>
                
                <VStack spacing={4} align="center">
                  <Avatar
                    size="2xl"
                    name={`${formData.first_name} ${formData.last_name}`}
                    src={imagePreview}
                    border="4px"
                    borderColor="yellow.400"
                  />
                  
                  <Box textAlign="center">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      display="none"
                      id="profile-image-upload"
                    />
                    <Button
                      as="label"
                      htmlFor="profile-image-upload"
                      leftIcon={<FiUpload />}
                      colorScheme="yellow"
                      variant="outline"
                      cursor="pointer"
                    >
                      Upload New Photo
                    </Button>
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      Recommended: Square image, max 2MB
                    </Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardBody>
                <Heading size="md" mb={6}>
                  <FiUser style={{ display: 'inline', marginRight: '8px' }} />
                  Personal Information
                </Heading>
                
                <VStack spacing={4}>
                  <HStack spacing={4} width="100%">
                    <FormControl isRequired isInvalid={errors.first_name}>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                      {errors.first_name && <Text color="red.500" fontSize="sm">{errors.first_name}</Text>}
                    </FormControl>
                    
                    <FormControl isRequired isInvalid={errors.last_name}>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                      {errors.last_name && <Text color="red.500" fontSize="sm">{errors.last_name}</Text>}
                    </FormControl>
                  </HStack>

                  <FormControl isRequired isInvalid={errors.email}>
                    <FormLabel>
                      <FiMail style={{ display: 'inline', marginRight: '8px' }} />
                      Email Address
                    </FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
                  </FormControl>

                  <FormControl isInvalid={errors.phone}>
                    <FormLabel>
                      <FiPhone style={{ display: 'inline', marginRight: '8px' }} />
                      Phone Number
                    </FormLabel>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+63 XXX XXX XXXX"
                    />
                    {errors.phone && <Text color="red.500" fontSize="sm">{errors.phone}</Text>}
                  </FormControl>

                  <FormControl>
                    <FormLabel>Bio/Introduction</FormLabel>
                    <Textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself, your skills, and interests..."
                      rows={4}
                    />
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      This will be visible to companies when you apply for OJT positions.
                    </Text>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Student Information (only for students) */}
            {user.role === 'student' && (
              <Card>
                <CardBody>
                  <Heading size="md" mb={6}>Student Information</Heading>
                  
                  <VStack spacing={4}>
                    <FormControl isRequired isInvalid={errors.student_id}>
                      <FormLabel>Student ID</FormLabel>
                      <Input
                        name="student_id"
                        value={formData.student_id}
                        onChange={handleChange}
                        placeholder="e.g., 2023-00123"
                      />
                      {errors.student_id && <Text color="red.500" fontSize="sm">{errors.student_id}</Text>}
                    </FormControl>

                    <HStack spacing={4} width="100%">
                      <FormControl isRequired>
                        <FormLabel>Course</FormLabel>
                        <Select
                          name="course"
                          value={formData.course}
                          onChange={handleChange}
                          placeholder="Select course"
                        >
                          <option value="cit">Information Technology (CIT)</option>
                          <option value="coa">Accountancy (COA)</option>
                          <option value="coed">Education (COED)</option>
                          <option value="chm">Hospitality Management (CHM)</option>
                          <option value="cba">Business Administration (CBA)</option>
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Year Level</FormLabel>
                        <Select
                          name="year_level"
                          value={formData.year_level}
                          onChange={handleChange}
                          placeholder="Select year level"
                        >
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </Select>
                      </FormControl>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Company Information (only for companies) */}
            {user.role === 'company' && (
              <Card>
                <CardBody>
                  <Heading size="md" mb={6}>Company Information</Heading>
                  
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel>Company Name</FormLabel>
                      <Input
                        value={user.company_name || ''}
                        isReadOnly
                        bg="gray.50"
                      />
                      <Text fontSize="sm" color="gray.500" mt={2}>
                        Company name cannot be changed. Contact support if needed.
                      </Text>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Company Address</FormLabel>
                      <Textarea
                        name="company_address"
                        value={formData.company_address || user.company_address || ''}
                        onChange={handleChange}
                        placeholder="Enter your company address"
                        rows={3}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Company Description</FormLabel>
                      <Textarea
                        name="company_description"
                        value={formData.company_description || user.company_description || ''}
                        onChange={handleChange}
                        placeholder="Describe your company..."
                        rows={4}
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Account Security */}
            <Card>
              <CardBody>
                <Heading size="md" mb={6}>Account Security</Heading>
                
                <Alert status="info" borderRadius="md" mb={4}>
                  <AlertIcon />
                  <Text fontSize="sm">
                    To change your password, please use the "Forgot Password" feature on the login page.
                  </Text>
                </Alert>
                
                <VStack spacing={3} align="stretch">
                  <HStack justify="space-between">
                    <Box>
                      <Text fontWeight="medium">Account Status</Text>
                      <Text fontSize="sm" color="gray.600">
                        {user.is_verified ? 'Verified' : 'Not Verified'}
                      </Text>
                    </Box>
                    <Badge colorScheme={user.is_verified ? 'green' : 'yellow'}>
                      {user.is_verified ? 'VERIFIED' : 'PENDING'}
                    </Badge>
                  </HStack>
                  
                  <HStack justify="space-between">
                    <Box>
                      <Text fontWeight="medium">Member Since</Text>
                      <Text fontSize="sm" color="gray.600">
                        {new Date(user.date_joined).toLocaleDateString('en-PH')}
                      </Text>
                    </Box>
                  </HStack>
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
                    Save Changes
                  </Button>
                </HStack>
                
                <Alert status="warning" mt={6} borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Changes to your profile may affect your OJT applications. Ensure information is accurate.
                  </Text>
                </Alert>
              </CardBody>
            </Card>
          </VStack>
        </form>
      </VStack>
    </Container>
  )
}

export default EditProfile