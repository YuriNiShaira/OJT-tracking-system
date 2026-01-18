// src/components/company/CompanyApplications.jsx
import React, { useState, useEffect } from 'react'
import {
  Box, Container, Heading, VStack, Text, Card, CardBody,
  Badge, Button, HStack, SimpleGrid, Alert, AlertIcon,
  Table, Thead, Tbody, Tr, Th, Td, Progress,
  Menu, MenuButton, MenuList, MenuItem, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton,
  Textarea, Select, useDisclosure, useToast,
  Avatar, Tag, Divider
} from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'
import { ojtService } from '../../services/ojtService'
import { useNavigate } from 'react-router-dom'
import {
  FiEye, FiCheck, FiX, FiCalendar, FiMoreVertical,
  FiFilter, FiDownload, FiMessageSquare, FiUser
} from 'react-icons/fi'

const CompanyApplications = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedApplication, setSelectedApplication] = useState(null)
  
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    interviewed: 0,
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
      pending: apps.filter(app => app.status === 'applied' || app.status === 'under_review').length,
      interviewed: apps.filter(app => app.status === 'interviewed').length,
      accepted: apps.filter(app => app.status === 'accepted').length,
      rejected: apps.filter(app => app.status === 'rejected').length,
    }
    setStats(stats)
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'applied':
        return { color: 'blue', label: 'Applied' }
      case 'under_review':
        return { color: 'yellow', label: 'Under Review' }
      case 'for_interview':
        return { color: 'purple', label: 'For Interview' }
      case 'interviewed':
        return { color: 'orange', label: 'Interviewed' }
      case 'accepted':
        return { color: 'green', label: 'Accepted' }
      case 'rejected':
        return { color: 'red', label: 'Rejected' }
      case 'withdrawn':
        return { color: 'gray', label: 'Withdrawn' }
      default:
        return { color: 'gray', label: status }
    }
  }

  const getFilteredApplications = () => {
    if (filter === 'all') return applications
    
    if (filter === 'pending') {
      return applications.filter(app => 
        app.status === 'applied' || 
        app.status === 'under_review' || 
        app.status === 'for_interview'
      )
    }
    
    return applications.filter(app => app.status === filter)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleViewDetails = (application) => {
    setSelectedApplication(application)
    onOpen()
  }

  const handleStatusUpdate = async (applicationId, newStatus, notes = '') => {
    try {
      const updateData = { status: newStatus }
      if (notes) {
        updateData.final_feedback = notes
      }
      
      await ojtService.updateApplicationStatus(applicationId, updateData)
      
      toast({
        title: 'Status Updated',
        description: `Application status changed to ${newStatus}`,
        status: 'success',
        duration: 3000,
      })
      
      fetchApplications() // Refresh list
      onClose() // Close modal
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update application status',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleScheduleInterview = async (applicationId, date) => {
    try {
      await ojtService.updateApplicationStatus(applicationId, {
        status: 'for_interview',
        interview_date: date
      })
      
      toast({
        title: 'Interview Scheduled',
        description: 'Student has been notified',
        status: 'success',
        duration: 3000,
      })
      
      fetchApplications()
    } catch (error) {
      console.error('Error scheduling interview:', error)
    }
  }

  const handleDownloadResume = (resumeUrl) => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank')
    } else {
      toast({
        title: 'No Resume',
        description: 'Student did not upload a resume',
        status: 'info',
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

  const filteredApplications = getFilteredApplications()

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Applications Management</Heading>
          <Text color="gray.600">
            Review and manage student applications for your OJT listings
          </Text>
        </Box>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4}>
          <Card bg="blue.50">
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {stats.total}
              </Text>
              <Text fontSize="sm" color="blue.600">Total</Text>
            </CardBody>
          </Card>
          
          <Card bg="yellow.50">
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="yellow.600">
                {stats.pending}
              </Text>
              <Text fontSize="sm" color="yellow.600">Pending</Text>
            </CardBody>
          </Card>
          
          <Card bg="orange.50">
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                {stats.interviewed}
              </Text>
              <Text fontSize="sm" color="orange.600">Interviewed</Text>
            </CardBody>
          </Card>
          
          <Card bg="green.50">
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                {stats.accepted}
              </Text>
              <Text fontSize="sm" color="green.600">Accepted</Text>
            </CardBody>
          </Card>
          
          <Card bg="red.50">
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="red.600">
                {stats.rejected}
              </Text>
              <Text fontSize="sm" color="red.600">Rejected</Text>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Filters */}
        <Card>
          <CardBody>
            <HStack justify="space-between" wrap="wrap">
              <HStack spacing={4}>
                <Tag colorScheme="blue" size="lg">
                  <FiFilter style={{ marginRight: '4px' }} />
                  Filter by:
                </Tag>
                
                <Button
                  size="sm"
                  variant={filter === 'all' ? 'solid' : 'outline'}
                  colorScheme={filter === 'all' ? 'yellow' : 'gray'}
                  onClick={() => setFilter('all')}
                >
                  All ({stats.total})
                </Button>
                
                <Button
                  size="sm"
                  variant={filter === 'pending' ? 'solid' : 'outline'}
                  colorScheme={filter === 'pending' ? 'yellow' : 'gray'}
                  onClick={() => setFilter('pending')}
                >
                  Pending ({stats.pending})
                </Button>
                
                <Button
                  size="sm"
                  variant={filter === 'for_interview' ? 'solid' : 'outline'}
                  colorScheme={filter === 'for_interview' ? 'yellow' : 'gray'}
                  onClick={() => setFilter('for_interview')}
                >
                  For Interview
                </Button>
                
                <Button
                  size="sm"
                  variant={filter === 'accepted' ? 'solid' : 'outline'}
                  colorScheme={filter === 'accepted' ? 'yellow' : 'gray'}
                  onClick={() => setFilter('accepted')}
                >
                  Accepted ({stats.accepted})
                </Button>
              </HStack>
              
              <Button
                colorScheme="blue"
                variant="outline"
                size="sm"
                onClick={() => navigate('/company/listings')}
              >
                View My Listings
              </Button>
            </HStack>
          </CardBody>
        </Card>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card>
            <CardBody textAlign="center" py={10}>
              <Alert status="info" variant="subtle" borderRadius="md" maxW="500px" mx="auto">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">No applications found</Text>
                  <Text fontSize="sm">
                    {filter === 'all' 
                      ? "You haven't received any applications yet." 
                      : `No applications with status: ${filter}`}
                  </Text>
                </Box>
              </Alert>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Applicant</Th>
                    <Th>Position</Th>
                    <Th>Status</Th>
                    <Th>Applied Date</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredApplications.map((app) => {
                    const statusInfo = getStatusBadge(app.status)
                    const student = app.student_details
                    
                    return (
                      <Tr key={app.id} _hover={{ bg: 'gray.50' }}>
                        <Td>
                          <HStack>
                            <Avatar
                              size="sm"
                              name={`${student?.first_name} ${student?.last_name}`}
                              src={student?.profile_image}
                            />
                            <Box>
                              <Text fontWeight="medium">
                                {student?.first_name} {student?.last_name}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                {student?.course} • Year {student?.year_level}
                              </Text>
                            </Box>
                          </HStack>
                        </Td>
                        <Td>
                          <Text fontWeight="medium">{app.listing_details?.title}</Text>
                          <Text fontSize="sm" color="gray.600" noOfLines={1}>
                            {app.listing_details?.location}
                          </Text>
                        </Td>
                        <Td>
                          <Badge colorScheme={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                          {app.interview_date && (
                            <Text fontSize="xs" color="gray.600" mt={1}>
                              <FiCalendar style={{ display: 'inline', marginRight: '4px' }} />
                              {formatDate(app.interview_date)}
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
                              onClick={() => handleViewDetails(app)}
                            >
                              View
                            </Button>
                            
                            {app.resume && (
                              <IconButton
                                icon={<FiDownload />}
                                size="sm"
                                variant="ghost"
                                aria-label="Download Resume"
                                onClick={() => handleDownloadResume(app.resume)}
                              />
                            )}
                            
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<FiMoreVertical />}
                                size="sm"
                                variant="ghost"
                              />
                              <MenuList>
                                {app.status === 'applied' && (
                                  <>
                                    <MenuItem
                                      icon={<FiMessageSquare />}
                                      onClick={() => handleStatusUpdate(app.id, 'under_review')}
                                    >
                                      Mark as Under Review
                                    </MenuItem>
                                    <MenuItem
                                      icon={<FiCalendar />}
                                      onClick={() => handleScheduleInterview(app.id, new Date().toISOString())}
                                    >
                                      Schedule Interview
                                    </MenuItem>
                                  </>
                                )}
                                
                                {app.status === 'under_review' && (
                                  <MenuItem
                                    icon={<FiCalendar />}
                                    onClick={() => handleScheduleInterview(app.id, new Date().toISOString())}
                                  >
                                    Schedule Interview
                                  </MenuItem>
                                )}
                                
                                {app.status === 'for_interview' && (
                                  <MenuItem
                                    icon={<FiCheck />}
                                    onClick={() => handleStatusUpdate(app.id, 'interviewed')}
                                  >
                                    Mark as Interviewed
                                  </MenuItem>
                                )}
                                
                                {app.status === 'interviewed' && (
                                  <>
                                    <MenuItem
                                      icon={<FiCheck />}
                                      onClick={() => handleStatusUpdate(app.id, 'accepted')}
                                    >
                                      Accept Application
                                    </MenuItem>
                                    <MenuItem
                                      icon={<FiX />}
                                      onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                    >
                                      Reject Application
                                    </MenuItem>
                                  </>
                                )}
                              </MenuList>
                            </Menu>
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

        {/* Application Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            {selectedApplication && (
              <>
                <ModalHeader>
                  Application Details
                </ModalHeader>
                <ModalCloseButton />
                
                <ModalBody>
                  <VStack spacing={6} align="stretch">
                    {/* Applicant Info */}
                    <Card>
                      <CardBody>
                        <HStack spacing={4}>
                          <Avatar
                            size="lg"
                            name={`${selectedApplication.student_details?.first_name} ${selectedApplication.student_details?.last_name}`}
                            src={selectedApplication.student_details?.profile_image}
                          />
                          <Box>
                            <Heading size="md">
                              {selectedApplication.student_details?.first_name} {selectedApplication.student_details?.last_name}
                            </Heading>
                            <Text color="gray.600">
                              {selectedApplication.student_details?.course} • Year {selectedApplication.student_details?.year_level}
                            </Text>
                            <Text fontSize="sm">
                              Student ID: {selectedApplication.student_details?.student_id}
                            </Text>
                            <Text fontSize="sm">
                              Email: {selectedApplication.student_details?.email}
                            </Text>
                          </Box>
                        </HStack>
                      </CardBody>
                    </Card>

                    {/* Position Info */}
                    <Card>
                      <CardBody>
                        <Heading size="sm" mb={3}>Applied Position</Heading>
                        <Text fontWeight="medium">{selectedApplication.listing_details?.title}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {selectedApplication.listing_details?.company_name} • {selectedApplication.listing_details?.location}
                        </Text>
                      </CardBody>
                    </Card>

                    {/* Cover Letter */}
                    <Card>
                      <CardBody>
                        <Heading size="sm" mb={3}>Cover Letter</Heading>
                        <Text whiteSpace="pre-line">{selectedApplication.cover_letter}</Text>
                      </CardBody>
                    </Card>

                    {/* Documents */}
                    <Card>
                      <CardBody>
                        <Heading size="sm" mb={3}>Documents</Heading>
                        <VStack align="stretch" spacing={2}>
                          {selectedApplication.resume && (
                            <Button
                              leftIcon={<FiDownload />}
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(selectedApplication.resume, '_blank')}
                            >
                              Download Resume
                            </Button>
                          )}
                          
                          {selectedApplication.transcript && (
                            <Button
                              leftIcon={<FiDownload />}
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(selectedApplication.transcript, '_blank')}
                            >
                              Download Transcript
                            </Button>
                          )}
                          
                          {selectedApplication.endorsement_letter && (
                            <Button
                              leftIcon={<FiDownload />}
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(selectedApplication.endorsement_letter, '_blank')}
                            >
                              Download Endorsement Letter
                            </Button>
                          )}
                          
                          {!selectedApplication.resume && !selectedApplication.transcript && !selectedApplication.endorsement_letter && (
                            <Text color="gray.500" fontSize="sm">No documents uploaded</Text>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Status Update */}
                    <Card>
                      <CardBody>
                        <Heading size="sm" mb={3}>Update Status</Heading>
                        <HStack spacing={3} wrap="wrap">
                          <Button
                            colorScheme="green"
                            size="sm"
                            onClick={() => handleStatusUpdate(selectedApplication.id, 'accepted')}
                          >
                            Accept
                          </Button>
                          
                          <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                          >
                            Reject
                          </Button>
                          
                          <Button
                            colorScheme="purple"
                            size="sm"
                            onClick={() => handleStatusUpdate(selectedApplication.id, 'for_interview')}
                          >
                            Schedule Interview
                          </Button>
                          
                          <Button
                            colorScheme="yellow"
                            size="sm"
                            onClick={() => handleStatusUpdate(selectedApplication.id, 'under_review')}
                          >
                            Under Review
                          </Button>
                        </HStack>
                      </CardBody>
                    </Card>
                  </VStack>
                </ModalBody>
                
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  )
}

export default CompanyApplications