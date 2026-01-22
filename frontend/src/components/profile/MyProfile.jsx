import React, { useState, useEffect } from 'react'
import {
  Box, Container, Heading, VStack, Text, Card, CardBody,
  Button, Avatar, HStack, Divider, Badge, SimpleGrid,
  Progress, Stat, StatLabel, StatNumber, StatHelpText,
  Tag, Alert, AlertIcon, useToast, Spinner
} from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  FiUser, FiMail, FiPhone, FiBook, FiCalendar,
  FiEdit, FiMapPin, FiBriefcase, FiCheckCircle,
  FiClock
} from 'react-icons/fi'

const MyProfile = () => {
    const {user,checkAuth} = useAuth()
    const navigate = useNavigate()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [profileData, setProfileData] = useState(null)
    const [profileCompletion, setProfileCompletion] = useState(0)

    useEffect(()=> {
        fetchProfileData()
    }, [])

    const fetchProfileData = async() => {
        try{
            setLoading(true)
            const response = await fetch('http://localhost:8000/api/auth/profile/',{
                credentials:'include',
            })
            const data = await response.json()
            setProfileData(data)
            calculateProfileCompletion(data)
        }catch(error){
            console.error('Error fetching profile:',error)
            toast({
                title: 'Error',
                description: 'Failed to load profile data',
                status: 'error',
                duration: 3000,
            })
        }finally{
            setLoading(false)
        }
    }
    // Calculates profile completion and based on filled required fields
    const calculateProfileCompletion = (profile) => {
        const requiredFields = {
            student: ['first_name', 'last_name', 'email', 'student_id', 'course', 'year_level'],
            company: ['first_name', 'last_name', 'email', 'company_name', 'company_address'],
        }

        const fields = requiredFields[profile.role] || []
        const completed = fields.filter(field =>
            profile[field] && profile[field].toString().trim() !== ''
        ).length

        const percentage = Math.round((completed / fields.length) * 100)
        setProfileCompletion(percentage)
    }

    const getCourseName = (courseCode) => {
        const courses ={
            'cit': 'Information Technology (CIT)',
            'coa': 'Accountancy (COA)',
            'coed': 'Education (COED)',
            'chm': 'Hospitality Management (CHM)',
            'cba': 'Business Administration (CBA)',
            'all': 'All Courses'
        }
        return courses[courseCode] || courseCode
    }

    const getRoleBadgeColor = (role) => {
        switch(role){
            case 'student': return 'green'
            case 'company': return 'blue'
            case 'admin': return 'orange'
            default: return 'gray'
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
  }

    const handleEditProfile = () => {
        navigate('/profile/edit')
    }

    if(loading) {
        return(
            <Container maxW="container.lg" py={8}>
                <VStack spacing={8} align="center" justify="center" minH="50vh">
                    <Spinner size='xl' color='yellow.500'/>
                    <Text color="gray.600">Loading Profile</Text>
                </VStack>
            </Container>
        )
    }

    if(!profileData){
        return(
            <Container maxW='container.lg' py={8}>
                <Alert status="error">
                    <AlertIcon />
                    Failed to load profile
                </Alert>
            </Container>
        )
    }

    return(
        <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>My Profile</Heading>
          <Text color="gray.600">
            View your personal information and account details
          </Text>
        </Box>

        {/* Profile Completion */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Box>
                  <Heading size="md">Profile Completion</Heading>
                  <Text color="gray.600">
                    Complete your profile for better experience
                  </Text>
                </Box>
                <Badge 
                  colorScheme={profileCompletion >= 80 ? 'green' : profileCompletion >= 50 ? 'yellow' : 'red'}
                  fontSize="lg"
                  px={4}
                  py={2}
                >
                  {profileCompletion}%
                </Badge>
              </HStack>
              
              <Progress 
                value={profileCompletion} 
                colorScheme={profileCompletion >= 80 ? 'green' : profileCompletion >= 50 ? 'yellow' : 'red'}
                size="lg"
                borderRadius="full"
              />
              
              {profileCompletion < 100 && (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Complete your profile to unlock all features and improve your OJT applications.
                  </Text>
                </Alert>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Profile Card */}
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              {/* Header with Avatar */}
              <HStack spacing={6}>
                <Avatar
                  size="2xl"
                  name={`${profileData.first_name} ${profileData.last_name}`}
                  src={profileData.profile_image ? `http://localhost:8000${profileData.profile_image}` : undefined}
                  border="4px"
                  borderColor="yellow.400"
                />
                
                <Box flex="1">
                  <HStack justify="space-between" align="flex-start" mb={2}>
                    <Box>
                      <Heading size="xl">
                        {profileData.first_name} {profileData.last_name}
                      </Heading>
                      <Text color="gray.600" fontSize="lg">
                        @{profileData.username}
                      </Text>
                    </Box>
                    
                    <Badge 
                      colorScheme={getRoleBadgeColor(profileData.role)}
                      fontSize="lg"
                      px={4}
                      py={2}
                    >
                      {profileData.role.toUpperCase()}
                    </Badge>
                  </HStack>
                  
                  <HStack spacing={4} mt={4}>
                    <Button
                      colorScheme="yellow"
                      leftIcon={<FiEdit />}
                      onClick={handleEditProfile}
                    >
                      Edit Profile
                    </Button>
                  </HStack>
                </Box>
              </HStack>

              <Divider />

              {/* Personal Information */}
              <Box>
                <Heading size="md" mb={4}>Personal Information</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <HStack>
                    <Box color="gray.500">
                      <FiMail />
                    </Box>
                    <Box>
                      <Text fontWeight="medium">Email</Text>
                      <Text color="gray.600">{profileData.email}</Text>
                    </Box>
                  </HStack>
                  
                  <HStack>
                    <Box color="gray.500">
                      <FiPhone />
                    </Box>
                    <Box>
                      <Text fontWeight="medium">Phone</Text>
                      <Text color="gray.600">{profileData.phone || 'Not provided'}</Text>
                    </Box>
                  </HStack>
                  
                  <HStack>
                    <Box color="gray.500">
                      <FiCalendar />
                    </Box>
                    <Box>
                      <Text fontWeight="medium">Member Since</Text>
                      <Text color="gray.600">{formatDate(profileData.date_joined)}</Text>
                    </Box>
                  </HStack>
                  
                  <HStack>
                    <Box color="gray.500">
                      <FiCheckCircle />
                    </Box>
                    <Box>
                      <Text fontWeight="medium">Account Status</Text>
                      <Badge colorScheme={profileData.is_verified ? 'green' : 'yellow'}>
                        {profileData.is_verified ? 'Verified' : 'Pending Verification'}
                      </Badge>
                    </Box>
                  </HStack>
                </SimpleGrid>
              </Box>

              {/* Bio */}
              {profileData.bio && (
                <>
                  <Divider />
                  <Box>
                    <Heading size="md" mb={3}>About Me</Heading>
                    <Text whiteSpace="pre-line">{profileData.bio}</Text>
                  </Box>
                </>
              )}

              {/* Student Information */}
              {profileData.role === 'student' && (
                <>
                  <Divider />
                  <Box>
                    <Heading size="md" mb={4}>Student Information</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <HStack>
                        <Box color="gray.500">
                          <FiBook />
                        </Box>
                        <Box>
                          <Text fontWeight="medium">Student ID</Text>
                          <Text color="gray.600">{profileData.student_id || 'Not set'}</Text>
                        </Box>
                      </HStack>
                      
                      <HStack>
                        <Box color="gray.500">
                          <FiBook />
                        </Box>
                        <Box>
                          <Text fontWeight="medium">Course</Text>
                          <Text color="gray.600">{getCourseName(profileData.course)}</Text>
                        </Box>
                      </HStack>
                      
                      <HStack>
                        <Box color="gray.500">
                          <FiBook />
                        </Box>
                        <Box>
                          <Text fontWeight="medium">Year Level</Text>
                          <Text color="gray.600">
                            {profileData.year_level ? `Year ${profileData.year_level}` : 'Not set'}
                          </Text>
                        </Box>
                      </HStack>
                    </SimpleGrid>
                  </Box>
                </>
              )}

              {/* Company Information */}
              {profileData.role === 'company' && (
                <>
                  <Divider />
                  <Box>
                    <Heading size="md" mb={4}>Company Information</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <HStack align="flex-start">
                        <Box color="gray.500" mt={1}>
                          <FiBriefcase />
                        </Box>
                        <Box>
                          <Text fontWeight="medium">Company Name</Text>
                          <Text color="gray.600">{profileData.company_name}</Text>
                        </Box>
                      </HStack>
                      
                      <HStack align="flex-start">
                        <Box color="gray.500" mt={1}>
                          <FiMapPin />
                        </Box>
                        <Box>
                          <Text fontWeight="medium">Company Address</Text>
                          <Text color="gray.600">{profileData.company_address || 'Not provided'}</Text>
                        </Box>
                      </HStack>
                      
                      {(profileData.company_description) && (
                        <HStack align="flex-start" gridColumn="span 2">
                          <Box color="gray.500" mt={1}>
                            <FiBook />
                          </Box>
                          <Box>
                            <Text fontWeight="medium">Company Description</Text>
                            <Text color="gray.600" whiteSpace="pre-line">
                              {profileData.company_description}
                            </Text>
                          </Box>
                        </HStack>
                      )}
                    </SimpleGrid>
                  </Box>
                </>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Account Stats */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Account Type</StatLabel>
                <StatNumber fontSize="2xl">
                  {profileData.role === 'student' ? 'Student' : 
                   profileData.role === 'company' ? 'Company' : 'Admin'}
                </StatNumber>
                <StatHelpText>
                  {profileData.is_verified ? 'Verified Account' : 'Verification Pending'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Member Since</StatLabel>
                <StatNumber fontSize="xl">
                  {new Date(profileData.date_joined).getFullYear()}
                </StatNumber>
                <StatHelpText>
                  {formatDate(profileData.date_joined)}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Profile Strength</StatLabel>
                <StatNumber fontSize="2xl">{profileCompletion}%</StatNumber>
                <StatHelpText>
                  {profileCompletion === 100 ? 'Complete!' : 'Needs improvement'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Container>
  )
}
export default MyProfile