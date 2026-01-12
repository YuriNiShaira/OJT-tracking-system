import React from 'react'
import {
  Box, Container, Heading, Text, VStack,
  SimpleGrid, Card, CardHeader, CardBody, CardFooter,
  Button, Avatar, Badge, Stat, StatLabel, StatNumber, StatHelpText
} from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'
import { CalendarIcon, SearchIcon, CheckCircleIcon } from '@chakra-ui/icons'
import Navbar from '../Navbar'

const StudentDashboard = () => {
  const { user } = useAuth()

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
    { label: 'Applied Positions', value: '0', icon: CheckCircleIcon, color: 'green' },
    { label: 'Interviews', value: '0', icon: CalendarIcon, color: 'blue' },
    { label: 'Accepted Offers', value: '0', icon: CheckCircleIcon, color: 'teal' },
  ]

    return(
        <>
            <Navbar />
            <Container maxW='container.xl' py={8}>
                <VStack spacing={8} align='stretch'>
                    {/* Welcome Section */}
                    <Box>
                        <Box>
                            <Avatar name={user?.first_name + ' ' + user?.last_name} />
                            <Box>
                                <Heading>
                                    Welcome back {user?.first_name || 'Student'}
                                </Heading>
                                <Text>
                                    { getCourseName(user?.course)} • Year {user?.year_level}
                                </Text>
                                <Badge colorScheme="green" mt={2}>Student</Badge>
                            </Box>
                        </Box>
                    </Box>

                    {/* stats */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                        {stats.map((stat, index) => (
                            <Card key={index}>
                            <CardBody>
                                <VStack align="center">
                                <Box
                                    p={3}
                                    borderRadius="full"
                                    bg={`${stat.color}.100`}
                                    color={`${stat.color}.600`}
                                >
                                    <stat.icon boxSize={6} />
                                </Box>
                                <Stat textAlign="center" mt={4}>
                                    <StatNumber fontSize="2xl">{stat.value}</StatNumber>
                                    <StatLabel>{stat.label}</StatLabel>
                                </Stat>
                                </VStack>
                            </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>

                    {/* Quick Actions */}
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        <Card>
                            <CardHeader>
                            <Heading size="md" display="flex" alignItems="center">
                                <SearchIcon mr={2} /> Browse OJT Positions
                            </Heading>
                            </CardHeader>
                            <CardBody>
                                <Text>Find internship opportunities matching your skills</Text>
                            </CardBody>
                            <CardFooter>
                                <Button colorScheme="yellow" width="full">Browse Jobs</Button>
                            </CardFooter>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <Heading size='md' >Update Profile</Heading>
                            </CardHeader>
                            <CardBody>
                                <Text>Complete your profile to get better matches</Text>
                            </CardBody>
                            <CardFooter>
                                <Button colorScheme='teal' width='full'>Edit Profile</Button>
                            </CardFooter>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                        <CardHeader>
                            <Heading size="md">Recent Activity</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text color="gray.500" textAlign="center" py={4}>
                                No recent activity. Start applying for OJT positions!
                            </Text>
                        </CardBody>
                        </Card>
                    </SimpleGrid>

                </VStack>
            </Container>
        </>
    )
}

export default StudentDashboard