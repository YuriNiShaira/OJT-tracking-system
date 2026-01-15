// src/components/ojt/OJTDetail.jsx
import React, { useState, useEffect } from 'react'
import {
  Box, Container, Heading, Text, VStack, HStack,
  Badge, Button, Card, CardBody, Divider,
  SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
  Alert, AlertIcon, Skeleton, useToast
} from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ojtService } from '../../services/ojtService'
import { 
  FiCalendar, FiClock, FiMapPin, FiDollarSign,
  FiBook, FiUsers, FiChevronLeft
} from 'react-icons/fi'

const OJTDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  
  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchJobDetails()
  }, [id])

  const fetchJobDetails = async () => {
    try {
      setLoading(true)
      const data = await ojtService.getListing(id)
      setJob(data)
    } catch (err) {
      setError('Failed to load OJT details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    if (!user) {
      navigate('/login', { state: { from: `/ojt/${id}` } })
      return
    }
    
    if (user.role !== 'student') {
      toast({
        title: 'Only students can apply',
        status: 'warning',
        duration: 3000,
      })
      return
    }
    
    navigate(`/ojt/${id}/apply`)
  }

  const getBadgeColor = (status) => {
    switch(status) {
      case 'open': return 'green'
      case 'filled': return 'blue'
      case 'closed': return 'red'
      case 'ongoing': return 'purple'
      default: return 'gray'
    }
  }

  const formatCurrency = (amount) => {
    if (!amount || amount === '0.00') return 'No allowance'
    return `₱${parseFloat(amount).toLocaleString('en-PH')}/month`
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

  if (loading) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={8} align="stretch">
          <Skeleton height="40px" />
          <Skeleton height="300px" />
        </VStack>
      </Container>
    )
  }

  if (error || !job) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          {error || 'OJT position not found'}
        </Alert>
        <Button
          leftIcon={<FiChevronLeft />}
          onClick={() => navigate('/ojt')}
          mt={4}
        >
          Back to Listings
        </Button>
      </Container>
    )
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Back button */}
        <Button
          leftIcon={<FiChevronLeft />}
          onClick={() => navigate('/ojt')}
          variant="ghost"
          alignSelf="flex-start"
        >
          Back to Listings
        </Button>

        {/* Header */}
        <Box>
          <HStack justify="space-between" align="flex-start" mb={4}>
            <Box flex="1">
              <Heading size="xl" mb={2}>{job.title}</Heading>
              <Text fontSize="xl" color="blue.600" fontWeight="medium">
                {job.company_name}
              </Text>
            </Box>
            <Badge 
              colorScheme={getBadgeColor(job.status)} 
              fontSize="lg" 
              px={4} 
              py={2}
              borderRadius="full"
            >
              {job.status.toUpperCase()}
            </Badge>
          </HStack>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mt={6}>
            <Stat>
              <StatLabel color="gray.600">Location</StatLabel>
              <StatNumber fontSize="md">
                <HStack>
                  <FiMapPin />
                  <Text>{job.location}</Text>
                </HStack>
              </StatNumber>
            </Stat>
            
            <Stat>
              <StatLabel color="gray.600">Duration</StatLabel>
              <StatNumber fontSize="md">
                <HStack>
                  <FiClock />
                  <Text>{job.duration_weeks} weeks</Text>
                </HStack>
              </StatNumber>
              <StatHelpText>{job.required_hours} hours required</StatHelpText>
            </Stat>
            
            <Stat>
              <StatLabel color="gray.600">Start Date</StatLabel>
              <StatNumber fontSize="md">
                <HStack>
                  <FiCalendar />
                  <Text>{new Date(job.start_date).toLocaleDateString()}</Text>
                </HStack>
              </StatNumber>
              <StatHelpText>
                Apply by: {new Date(job.application_deadline).toLocaleDateString()}
              </StatHelpText>
            </Stat>
            
            <Stat>
              <StatLabel color="gray.600">Allowance</StatLabel>
              <StatNumber fontSize="md">
                <HStack>
                  <FiDollarSign />
                  <Text>{formatCurrency(job.allowance)}</Text>
                </HStack>
              </StatNumber>
              <StatHelpText>{job.slots_available} slot(s) available</StatHelpText>
            </Stat>
          </SimpleGrid>
        </Box>

        <Divider />

        {/* Description Section */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Description</Heading>
            <Text whiteSpace="pre-line">{job.description}</Text>
          </CardBody>
        </Card>

        {/* Requirements Section */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card>
            <CardBody>
              <Heading size="md" mb={4} display="flex" alignItems="center">
                <FiBook style={{ marginRight: '8px' }} />
                Responsibilities
              </Heading>
              <Text whiteSpace="pre-line">{job.responsibilities || 'Not specified'}</Text>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Requirements</Heading>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="medium">Course:</Text>
                  <Text>{getCourseName(job.course_requirement)}</Text>
                </Box>
                <Box>
                  <Text fontWeight="medium">Year Level:</Text>
                  <Text>
                    {job.year_level_requirement === 0 
                      ? 'Any year level' 
                      : `Year ${job.year_level_requirement} or higher`}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="medium">Work Setup:</Text>
                  <Text>{job.work_setup === 'onsite' ? 'On-site' : 
                         job.work_setup === 'hybrid' ? 'Hybrid' : 'Work From Home'}</Text>
                </Box>
                {job.skills_required && (
                  <Box>
                    <Text fontWeight="medium">Skills Required:</Text>
                    <Text>{job.skills_required}</Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Learning Outcomes */}
        {job.learning_outcomes && (
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Learning Outcomes</Heading>
              <Text whiteSpace="pre-line">{job.learning_outcomes}</Text>
            </CardBody>
          </Card>
        )}

        {/* Action Buttons */}
        <Card>
          <CardBody>
            <HStack justify="space-between">
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Posted on {new Date(job.created_at).toLocaleDateString()}
                </Text>
                {job.is_expired && (
                  <Alert status="warning" size="sm" mt={2} width="fit-content">
                    <AlertIcon />
                    Application deadline has passed
                  </Alert>
                )}
              </Box>
              
              <HStack>
                {user?.role === 'company' && user?.id === job.company && (
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => navigate(`/company/listings/${job.id}/edit`)}
                  >
                    Edit Listing
                  </Button>
                )}
                
                {user?.role === 'student' && (
                  <Button
                    colorScheme="yellow"
                    size="lg"
                    onClick={handleApply}
                    isDisabled={job.status !== 'open' || job.is_expired}
                  >
                    Apply Now
                  </Button>
                )}
                
                {!user && (
                  <Button
                    colorScheme="yellow"
                    size="lg"
                    onClick={() => navigate('/login', { state: { from: `/ojt/${id}` } })}
                  >
                    Login to Apply
                  </Button>
                )}
              </HStack>
            </HStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  )
}

export default OJTDetail