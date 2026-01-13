import React from 'react'
import {
  Box, SimpleGrid, Heading, Text, Card, CardBody, CardFooter,
  Button, Avatar, Badge, Stat, StatLabel, StatNumber, StatHelpText,
  VStack, HStack, Progress, Icon
} from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  FiBriefcase, FiFileText, FiUser, FiCalendar,
  FiCheckCircle, FiClock, FiTrendingUp 
} from 'react-icons/fi'

const StudentDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

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

  const stats = [
    { label: 'Applied', value: '0', total: '5', icon: FiBriefcase, color: 'blue', progress: 0 },
    { label: 'Interviews', value: '0', total: '2', icon: FiCalendar, color: 'green', progress: 0 },
    { label: 'Accepted', value: '0', total: '1', icon: FiCheckCircle, color: 'teal', progress: 0 },
  ]

  const quickActions = [
    { 
      title: 'Find OJT Positions', 
      description: 'Browse available internships',
      icon: FiBriefcase,
      color: 'yellow',
      path: '/ojt'
    },
    { 
      title: 'My Applications', 
      description: 'Track your application status',
      icon: FiFileText,
      color: 'green',
      path: '/student/applications'
    },
    { 
      title: 'Profile Completion', 
      description: 'Complete your profile for better matches',
      icon: FiUser,
      color: 'blue',
      path: '/profile',
      progress: 60
    },
    { 
      title: 'Upcoming Schedule', 
      description: 'View interviews and deadlines',
      icon: FiCalendar,
      color: 'purple',
      path: '/student/schedule'
    },
  ]

  return (
    <Box>
      {/* Welcome Banner */}
      <Card mb={6} bgGradient="linear(to-r, yellow.50, green.50)">
        <CardBody>
          <HStack spacing={6} align="center">
            <Avatar size="xl" name={user?.first_name + ' ' + user?.last_name} />
            <Box flex="1">
              <Heading size="lg" mb={2}>
                Welcome back, {user?.first_name || 'Student'}! 👋
              </Heading>
              <Text color="gray.600" mb={2}>
                {getCourseName(user?.course)} • Year {user?.year_level} • Student ID: {user?.student_id}
              </Text>
              <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
                Ready for OJT
              </Badge>
            </Box>
            <Button 
              colorScheme="yellow" 
              size="lg"
              onClick={() => navigate('/ojt')}
            >
              Find OJT Now
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        {stats.map((stat, index) => (
          <Card key={index} variant="outline">
            <CardBody>
              <HStack justify="space-between" mb={4}>
                <Box
                  p={3}
                  borderRadius="lg"
                  bg={`${stat.color}.100`}
                  color={`${stat.color}.600`}
                >
                  <Icon as={stat.icon} boxSize={6} />
                </Box>
                <Stat textAlign="right">
                  <StatNumber fontSize="2xl">{stat.value}</StatNumber>
                  <StatLabel color="gray.600">{stat.label}</StatLabel>
                  <StatHelpText>of {stat.total} target</StatHelpText>
                </Stat>
              </HStack>
              <Progress value={stat.progress} size="sm" colorScheme={stat.color} borderRadius="full" />
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
                {action.progress && (
                  <Progress 
                    value={action.progress} 
                    size="sm" 
                    width="100%" 
                    colorScheme={action.color}
                    borderRadius="full"
                  />
                )}
              </VStack>
            </CardBody>
            <CardFooter pt={0}>
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

      {/* Recent Activity & Recommendations */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Recent Activity */}
        <Card variant="outline">
          <CardBody>
            <Heading size="sm" mb={4}>Recent Activity</Heading>
            <VStack align="stretch" spacing={3}>
              <HStack>
                <Icon as={FiClock} color="gray.400" />
                <Text fontSize="sm">No recent activity</Text>
              </HStack>
              <Button 
                colorScheme="yellow" 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/ojt')}
              >
                Start Applying
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Recommendations */}
        <Card variant="outline">
          <CardBody>
            <Heading size="sm" mb={4}>Recommendations</Heading>
            <VStack align="stretch" spacing={3}>
              <HStack>
                <Icon as={FiTrendingUp} color="gray.400" />
                <Text fontSize="sm">Complete your profile for personalized OJT matches</Text>
              </HStack>
              <Button 
                colorScheme="green" 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/profile')}
              >
                Update Profile
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  )
}

export default StudentDashboard