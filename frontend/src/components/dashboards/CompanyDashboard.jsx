// src/components/dashboards/CompanyDashboard.jsx - UPDATED VERSION
import React from 'react'
import {
  Box, SimpleGrid, Heading, Text, Card, CardBody, CardFooter,
  Button, Avatar, Badge, Stat, StatLabel, StatNumber,
  VStack, HStack, Icon
} from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  FiBriefcase, FiFileText, FiUsers, FiPlus,
  FiTrendingUp, FiCheckCircle, FiClock 
} from 'react-icons/fi'

const CompanyDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const stats = [
    { label: 'Active Listings', value: '0', change: '+0%', icon: FiBriefcase, color: 'blue' },
    { label: 'Total Applications', value: '0', change: '+0%', icon: FiFileText, color: 'green' },
    { label: 'Interview Scheduled', value: '0', change: '+0%', icon: FiUsers, color: 'purple' },
    { label: 'Positions Filled', value: '0', change: '+0%', icon: FiCheckCircle, color: 'teal' },
  ]

  const quickActions = [
    { 
      title: 'Post New OJT', 
      description: 'Create internship listing',
      icon: FiPlus,
      color: 'yellow',
      path: '/ojt/create'
    },
    { 
      title: 'Manage Listings', 
      description: 'Edit or remove OJT positions',
      icon: FiBriefcase,
      color: 'blue',
      path: '/company/listings'
    },
    { 
      title: 'Review Applications', 
      description: 'View and process applications',
      icon: FiFileText,
      color: 'green',
      path: '/company/applications'
    },
    { 
      title: 'Company Profile', 
      description: 'Update company information',
      icon: FiUsers,
      color: 'purple',
      path: '/company/profile'
    },
  ]

  return (
    <Box>
        {/* Welcome Banner */}
        <Card mb={6} bgGradient="linear(to-r, blue.50, teal.50)">
            <CardBody>
                <HStack spacing={6} align="center">
                    <Avatar size='xl' name={user?.company_name} bg='blue.500' />
                    <Box flex="1">
                        <Heading size="lg" mb={2}>
                            Welcome, {user?.company_name}!
                        </Heading>
                        <Text color='gray.600' mb={2}>
                            {user?.company_address || 'Add company address to complete profile'}
                        </Text>
                        <Badge colorScheme='blue' fontSize='sm' px={3} py={1} borderRadius='full'>
                            Company Account
                        </Badge>
                    </Box>
                    <Button
                        colorScheme='blue'
                        size='lg'
                        leftIcon={<FiPlus />}
                        onClick={() => navigate('/ojt/create')}
                    >
                        Post New OJT
                    </Button>
                </HStack>
            </CardBody>
        </Card>

        {/* Stats Grid */}
        <SimpleGrid columns = {{ base:1, md:2, lg:4 }} spacing={6} mb={8} >
            {stats.map((stat, index) => (
                <Card key={index} variant="outline">
                    <CardBody>
                        <HStack justify="space-between">
                            <Box
                                p={3}
                                borderRadius="lg"
                                bg={`${stat.color}.100`}
                                color={`${stat.color}.600`}
                            >
                                <Icon as={stat.icon} boxSize={6} />
                            </Box>
                            <Stat textAlign='right'>
                                <StatNumber fontSize="2xl">{stat.value}</StatNumber>
                                <StatLabel color="gray.600">{stat.label}</StatLabel>
                                <Text fontSize="xs" color={stat.change.startsWith('+') ? 'green.500' : 'red.500'}>
                                    {stat.change} this month
                                </Text>
                            </Stat>
                        </HStack>
                    </CardBody>
                </Card>
            ))}
        </SimpleGrid>

        {/* Quick Actions */}
        <Heading size="md" mb={4}>Quick Actions</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
            {quickActions.map((action, index) => (
                <Card
                key={index} 
                variant="outline" 
                _hover={{ transform: 'translateY(-4px)', shadow: 'md' }}
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => navigate(action.path)}
                >
                    <CardBody>
                        <VStack align="center" spacing={4}>
                            <Box
                            p={3}
                            borderRadius="lg"
                            bg={`${action.color}.100`}
                            color={`${action.color}.600`}
                                >
                                <Icon as={action.icon} boxSize={6} />
                            </Box>
                            <Box textAlign="center">
                                <Heading size="sm" mb={1}>{action.title}</Heading>
                                <Text fontSize="sm" color="gray.600">{action.description}</Text>
                            </Box>
                        </VStack>
                    </CardBody>
                    <CardFooter pt={8}>
                        <Button 
                            colorScheme={action.color} 
                            variant="ghost" 
                            size="sm" 
                            width="full"
                        >
                            Go to {action.title}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </SimpleGrid>
        
        {/* Recent Activity */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Card variant="outline">
                <CardBody>
                    <Heading size="sm" mb={4}>Recent Applications</Heading>
                    <VStack align="stretch" spacing={3}>
                        <HStack>
                            <Icon as={FiClock} color="gray.400" />
                            <Text fontSize="sm">No recent applications</Text>
                        </HStack>
                        <Button 
                            colorScheme="blue" 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate('/company/applications')}
                        >
                            View All Applications
                        </Button>
                    </VStack>
                </CardBody>
            </Card>

            <Card variant="outline">
                <CardBody>
                    <Heading size="sm" mb={4}>Tips for Companies</Heading>
                    <VStack align="stretch" spacing={3}>
                        <HStack>
                            <Icon as={FiTrendingUp} color="gray.400" />
                            <Text fontSize="sm">Detailed OJT descriptions get 50% more applications</Text>
                        </HStack>
                        <Button 
                            colorScheme="green" 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate('/ojt/create')}
                        >
                            Improve Your Listings
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        </SimpleGrid>       
    </Box>
  )
}

export default CompanyDashboard