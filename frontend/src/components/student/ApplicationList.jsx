
import React, { useState, useEffect } from 'react'
import {
  Box, Container, Heading, VStack, Text, Card, CardBody,
  Badge, Button, HStack, SimpleGrid, Alert, AlertIcon,
  Table, Thead, Tbody, Tr, Th, Td, Progress,
  Menu, MenuButton, MenuList, MenuItem, IconButton,
  useToast
} from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'
import { ojtService } from '../../services/ojtService'
import { useNavigate } from 'react-router-dom'
import {
  FiChevronRight, FiClock, FiCheckCircle, FiXCircle,
  FiEye, FiFileText, FiCalendar, FiMoreVertical
} from 'react-icons/fi'

const ApplicationsList = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  })

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const data = await ojtService.getMyApplications()
      setApplications(data)
      calculateStats(data)
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast({
        title: 'Error',
        description: 'Failed to load applications',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (apps) => {
    const stats = {
      total: apps.length,
      pending: apps.filter(app => app.status === 'applied' || app.status === 'under_review' || app.status === 'for_interview').length,
      accepted: apps.filter(app => app.status === 'accepted').length,
      rejected: apps.filter(app => app.status === 'rejected').length,
    }
    setStats(stats)
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'applied':
        return { color: 'blue', label: 'Applied', icon: FiClock }
      case 'under_review':
        return { color: 'yellow', label: 'Under Review', icon: FiClock }
      case 'for_interview':
        return { color: 'purple', label: 'For Interview', icon: FiCalendar }
      case 'interviewed':
        return { color: 'orange', label: 'Interviewed', icon: FiCalendar }
      case 'accepted':
        return { color: 'green', label: 'Accepted', icon: FiCheckCircle }
      case 'rejected':
        return { color: 'red', label: 'Rejected', icon: FiXCircle }
      case 'withdrawn':
        return { color: 'gray', label: 'Withdrawn', icon: FiXCircle }
      default:
        return { color: 'gray', label: status, icon: FiClock }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return
    }

    try {
      await ojtService.updateApplicationStatus(applicationId, { status: 'withdrawn' })
      toast({
        title: 'Application Withdrawn',
        status: 'info',
        duration: 3000,
      })
      fetchApplications() // Refresh list
    } catch (error) {
      console.error('Error withdrawing:', error)
      toast({
        title: 'Error',
        description: 'Failed to withdraw application',
        status: 'error',
        duration: 3000,
      })
    }
  }

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Progress size="xs" isIndeterminate colorScheme="yellow" />
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>My Applications</Heading>
          <Text color="gray.600">
            Track your OJT application status and history
          </Text>
        </Box>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
          <Card>
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {stats.total}
              </Text>
              <Text color="gray.600">Total Applications</Text>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="yellow.600">
                {stats.pending}
              </Text>
              <Text color="gray.600">Pending</Text>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                {stats.accepted}
              </Text>
              <Text color="gray.600">Accepted</Text>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="red.600">
                {stats.rejected}
              </Text>
              <Text color="gray.600">Rejected</Text>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Applications List */}
        {applications.length === 0 ? (
          <Card>
            <CardBody textAlign="center" py={10}>
              <FiFileText size={48} style={{ margin: '0 auto 20px', color: '#CBD5E0' }} />
              <Heading size="md" mb={2}>No Applications Yet</Heading>
              <Text color="gray.600" mb={6}>
                You haven't applied for any OJT positions yet.
              </Text>
              <Button
                colorScheme="yellow"
                onClick={() => navigate('/ojt')}
                leftIcon={<FiChevronRight />}
              >
                Browse OJT Positions
              </Button>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Position</Th>
                    <Th>Company</Th>
                    <Th>Status</Th>
                    <Th>Applied Date</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {applications.map((app) => {
                    const statusInfo = getStatusBadge(app.status)
                    const StatusIcon = statusInfo.icon
                    
                    return (
                      <Tr key={app.id} _hover={{ bg: 'gray.50' }}>
                        <Td>
                          <Text fontWeight="medium">{app.listing_details?.title}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {app.listing_details?.location}
                          </Text>
                        </Td>
                        <Td>
                          <Text>{app.listing_details?.company_name}</Text>
                        </Td>
                        <Td>
                          <Badge colorScheme={statusInfo.color} display="flex" alignItems="center" width="fit-content">
                            <StatusIcon style={{ marginRight: '4px' }} />
                            {statusInfo.label}
                          </Badge>
                          {app.interview_date && (
                            <Text fontSize="xs" color="gray.600" mt={1}>
                              Interview: {formatDate(app.interview_date)}
                            </Text>
                          )}
                        </Td>
                        <Td>
                          <Text>{formatDate(app.applied_at)}</Text>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button
                              size="sm"
                              variant="ghost"
                              leftIcon={<FiEye />}
                              onClick={() => navigate(`/ojt/${app.listing}`)}
                            >
                              View
                            </Button>
                            
                            {(app.status === 'applied' || app.status === 'under_review') && (
                              <Menu>
                                <MenuButton
                                  as={IconButton}
                                  icon={<FiMoreVertical />}
                                  size="sm"
                                  variant="ghost"
                                />
                                <MenuList>
                                  <MenuItem
                                    color="red.500"
                                    onClick={() => handleWithdraw(app.id)}
                                  >
                                    Withdraw Application
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            )}
                          </HStack>
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        )}

        {/* Application Tips */}
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Application Status Guide:</Text>
            <Text fontSize="sm">
              • <Badge colorScheme="blue">Applied</Badge> - Your application has been submitted<br />
              • <Badge colorScheme="yellow">Under Review</Badge> - Company is reviewing your application<br />
              • <Badge colorScheme="purple">For Interview</Badge> - You've been shortlisted for an interview<br />
              • <Badge colorScheme="green">Accepted</Badge> - Congratulations! You've been accepted<br />
              • <Badge colorScheme="red">Rejected</Badge> - Unfortunately, you were not selected
            </Text>
          </Box>
        </Alert>
      </VStack>
    </Container>
  )
}

export default ApplicationsList