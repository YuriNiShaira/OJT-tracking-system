// src/components/company/CompanyListings.jsx
import React, { useState, useEffect } from 'react'
import {
  Box, Container, Heading, VStack, Text, Card, CardBody,
  Badge, Button, HStack, SimpleGrid, Alert, AlertIcon,
  Table, Thead, Tbody, Tr, Th, Td, Progress,
  Menu, MenuButton, MenuList, MenuItem, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton,
  useDisclosure, useToast, Tag, Stat, StatLabel,
  StatNumber, StatHelpText, Divider
} from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'
import { ojtService } from '../../services/ojtService'
import { useNavigate } from 'react-router-dom'
import {
  FiEdit, FiTrash2, FiEye, FiPlus, FiFilter,
  FiCheckCircle, FiXCircle, FiClock, FiBarChart2
} from 'react-icons/fi'

const CompanyListings = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [listingToDelete, setListingToDelete] = useState(null)
  
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    closed: 0,
    filled: 0,
  })
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      setLoading(true)
      const data = await ojtService.getMyListings()
      setListings(data)
      calculateStats(data)
    } catch (error) {
      console.error('Error fetching listings:', error)
      toast({
        title: 'Error',
        description: 'Failed to load your OJT listings',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (listingsData) => {
    const stats = {
      total: listingsData.length,
      active: listingsData.filter(listing => listing.status === 'open').length,
      closed: listingsData.filter(listing => listing.status === 'closed').length,
      filled: listingsData.filter(listing => listing.status === 'filled').length,
    }
    setStats(stats)
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'open':
        return { color: 'green', label: 'Open', icon: FiCheckCircle }
      case 'closed':
        return { color: 'red', label: 'Closed', icon: FiXCircle }
      case 'filled':
        return { color: 'blue', label: 'Filled', icon: FiCheckCircle }
      case 'ongoing':
        return { color: 'purple', label: 'Ongoing', icon: FiClock }
      default:
        return { color: 'gray', label: status }
    }
  }

  const getFilteredListings = () => {
    if (filter === 'all') return listings
    return listings.filter(listing => listing.status === filter)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleDeleteClick = (listing) => {
    setListingToDelete(listing)
    onOpen()
  }

  const handleDeleteConfirm = async () => {
    if (!listingToDelete) return

    try {
      await ojtService.deleteListing(listingToDelete.id)
      
      toast({
        title: 'Listing Deleted',
        description: 'OJT position has been removed',
        status: 'success',
        duration: 3000,
      })
      
      fetchListings() // Refresh list
      onClose() // Close modal
      setListingToDelete(null)
    } catch (error) {
      console.error('Error deleting listing:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete listing',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleEdit = (listing) => {
    navigate(`/company/listings/${listing.id}/edit`)
  }

  const handleViewApplications = (listingId) => {
    navigate(`/company/applications?listing=${listingId}`)
  }

  const handleCloseListing = async (listingId) => {
    try {
      await ojtService.updateListing(listingId, { status: 'closed' })
      
      toast({
        title: 'Listing Closed',
        description: 'This OJT position is now closed for applications',
        status: 'info',
        duration: 3000,
      })
      
      fetchListings()
    } catch (error) {
      console.error('Error closing listing:', error)
    }
  }

  const handleReopenListing = async (listingId) => {
    try {
      await ojtService.updateListing(listingId, { status: 'open' })
      
      toast({
        title: 'Listing Reopened',
        description: 'This OJT position is now open for applications',
        status: 'success',
        duration: 3000,
      })
      
      fetchListings()
    } catch (error) {
      console.error('Error reopening listing:', error)
    }
  }

  const handleMarkAsFilled = async (listingId) => {
    try {
      await ojtService.updateListing(listingId, { status: 'filled' })
      
      toast({
        title: 'Position Filled',
        description: 'Marked as filled. No more applications will be accepted.',
        status: 'success',
        duration: 3000,
      })
      
      fetchListings()
    } catch (error) {
      console.error('Error marking as filled:', error)
    }
  }

  const getDaysRemaining = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: 'Deadline passed', color: 'red' }
    if (diffDays === 0) return { text: 'Today', color: 'orange' }
    if (diffDays === 1) return { text: 'Tomorrow', color: 'orange' }
    if (diffDays <= 7) return { text: `${diffDays} days left`, color: 'yellow' }
    return { text: `${diffDays} days left`, color: 'green' }
  }

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Progress size="xs" isIndeterminate colorScheme="yellow" />
      </Container>
    )
  }

  const filteredListings = getFilteredListings()

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>My OJT Listings</Heading>
          <Text color="gray.600">
            Manage your OJT positions and track applications
          </Text>
        </Box>

        {/* Stats and Actions */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* Stats */}
          <Card>
            <CardBody>
              <Heading size="sm" mb={4}>Listing Statistics</Heading>
              <SimpleGrid columns={2} spacing={4}>
                <Stat>
                  <StatLabel>Total Listings</StatLabel>
                  <StatNumber>{stats.total}</StatNumber>
                </Stat>
                
                <Stat>
                  <StatLabel>Active</StatLabel>
                  <StatNumber color="green.600">{stats.active}</StatNumber>
                  <StatHelpText>Open for applications</StatHelpText>
                </Stat>
                
                <Stat>
                  <StatLabel>Closed</StatLabel>
                  <StatNumber color="red.600">{stats.closed}</StatNumber>
                  <StatHelpText>Not accepting applications</StatHelpText>
                </Stat>
                
                <Stat>
                  <StatLabel>Filled</StatLabel>
                  <StatNumber color="blue.600">{stats.filled}</StatNumber>
                  <StatHelpText>Positions filled</StatHelpText>
                </Stat>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardBody>
              <Heading size="sm" mb={4}>Quick Actions</Heading>
              <VStack spacing={3} align="stretch">
                <Button
                  colorScheme="yellow"
                  leftIcon={<FiPlus />}
                  onClick={() => navigate('/ojt/create')}
                  size="lg"
                >
                  Create New OJT Listing
                </Button>
                
                <Button
                  colorScheme="blue"
                  variant="outline"
                  leftIcon={<FiBarChart2 />}
                  onClick={() => navigate('/company/applications')}
                >
                  View All Applications
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Filters */}
        <Card>
          <CardBody>
            <HStack justify="space-between" wrap="wrap">
              <HStack spacing={3}>
                <Tag colorScheme="blue" size="lg">
                  <FiFilter style={{ marginRight: '4px' }} />
                  Filter:
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
                  variant={filter === 'open' ? 'solid' : 'outline'}
                  colorScheme={filter === 'open' ? 'yellow' : 'gray'}
                  onClick={() => setFilter('open')}
                >
                  Active ({stats.active})
                </Button>
                
                <Button
                  size="sm"
                  variant={filter === 'closed' ? 'solid' : 'outline'}
                  colorScheme={filter === 'closed' ? 'yellow' : 'gray'}
                  onClick={() => setFilter('closed')}
                >
                  Closed ({stats.closed})
                </Button>
                
                <Button
                  size="sm"
                  variant={filter === 'filled' ? 'solid' : 'outline'}
                  colorScheme={filter === 'filled' ? 'yellow' : 'gray'}
                  onClick={() => setFilter('filled')}
                >
                  Filled ({stats.filled})
                </Button>
              </HStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <Card>
            <CardBody textAlign="center" py={10}>
              {filter === 'all' ? (
                <>
                  <Heading size="md" mb={4}>No OJT Listings Yet</Heading>
                  <Text color="gray.600" mb={6}>
                    Create your first OJT listing to start receiving applications from students.
                  </Text>
                  <Button
                    colorScheme="yellow"
                    leftIcon={<FiPlus />}
                    onClick={() => navigate('/ojt/create')}
                    size="lg"
                  >
                    Create First Listing
                  </Button>
                </>
              ) : (
                <Alert status="info" variant="subtle" borderRadius="md" maxW="500px" mx="auto">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="bold">No listings found</Text>
                    <Text fontSize="sm">
                      You don't have any listings with status: <strong>{filter}</strong>
                    </Text>
                  </Box>
                </Alert>
              )}
            </CardBody>
          </Card>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredListings.map((listing) => {
              const statusInfo = getStatusBadge(listing.status)
              const daysRemaining = getDaysRemaining(listing.application_deadline)
              const StatusIcon = statusInfo.icon
              
              return (
                <Card key={listing.id} _hover={{ shadow: 'md' }}>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {/* Header */}
                      <Box>
                        <HStack justify="space-between" align="start">
                          <Heading size="md" noOfLines={2}>{listing.title}</Heading>
                          <Badge colorScheme={statusInfo.color} display="flex" alignItems="center">
                            <StatusIcon style={{ marginRight: '4px' }} />
                            {statusInfo.label}
                          </Badge>
                        </HStack>
                        
                        <Text color="gray.600" fontSize="sm" mt={1}>
                          {listing.location}
                        </Text>
                      </Box>

                      {/* Details */}
                      <VStack spacing={2} align="stretch">
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.600">Duration:</Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {listing.duration_weeks} weeks ({listing.required_hours} hours)
                          </Text>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.600">Slots:</Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {listing.slots_available} available
                          </Text>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.600">Deadline:</Text>
                          <Tag size="sm" colorScheme={daysRemaining.color}>
                            {daysRemaining.text}
                          </Tag>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.600">Allowance:</Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {listing.allowance ? `₱${parseFloat(listing.allowance).toLocaleString()}/month` : 'None'}
                          </Text>
                        </HStack>
                      </VStack>

                      <Divider />

                      {/* Actions */}
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          variant="outline"
                          flex="1"
                          leftIcon={<FiEye />}
                          onClick={() => navigate(`/ojt/${listing.id}`)}
                        >
                          View
                        </Button>
                        
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<FiEdit />}
                            size="sm"
                            variant="outline"
                          />
                          <MenuList>
                            <MenuItem
                              icon={<FiEdit />}
                              onClick={() => handleEdit(listing)}
                            >
                              Edit Listing
                            </MenuItem>
                            
                            <MenuItem
                              icon={<FiBarChart2 />}
                              onClick={() => handleViewApplications(listing.id)}
                            >
                              View Applications
                            </MenuItem>
                            
                            {listing.status === 'open' && (
                              <MenuItem
                                icon={<FiXCircle />}
                                onClick={() => handleCloseListing(listing.id)}
                              >
                                Close Listing
                              </MenuItem>
                            )}
                            
                            {listing.status === 'closed' && (
                              <MenuItem
                                icon={<FiCheckCircle />}
                                onClick={() => handleReopenListing(listing.id)}
                              >
                                Reopen Listing
                              </MenuItem>
                            )}
                            
                            {listing.status === 'open' && (
                              <MenuItem
                                icon={<FiCheckCircle />}
                                onClick={() => handleMarkAsFilled(listing.id)}
                              >
                                Mark as Filled
                              </MenuItem>
                            )}
                            
                            <Divider />
                            
                            <MenuItem
                              icon={<FiTrash2 />}
                              color="red.500"
                              onClick={() => handleDeleteClick(listing)}
                            >
                              Delete Listing
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                      
                      {/* Dates */}
                      <Text fontSize="xs" color="gray.500" textAlign="center">
                        Created: {formatDate(listing.created_at)}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              )
            })}
          </SimpleGrid>
        )}

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete OJT Listing</ModalHeader>
            <ModalCloseButton />
            
            <ModalBody>
              {listingToDelete && (
                <>
                  <Alert status="warning" mb={4}>
                    <AlertIcon />
                    Are you sure you want to delete this OJT listing?
                  </Alert>
                  
                  <Box p={3} bg="gray.50" borderRadius="md">
                    <Text fontWeight="bold">{listingToDelete.title}</Text>
                    <Text fontSize="sm" color="gray.600">
                      Location: {listingToDelete.location}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Status: <Badge colorScheme={getStatusBadge(listingToDelete.status).color}>
                        {getStatusBadge(listingToDelete.status).label}
                      </Badge>
                    </Text>
                  </Box>
                  
                  <Text mt={4} color="red.600" fontSize="sm">
                    This action cannot be undone. All applications for this listing will also be removed.
                  </Text>
                </>
              )}
            </ModalBody>
            
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm}>
                Delete Listing
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  )
}

export default CompanyListings