import React from 'react'
import {
  Box, Container, Heading, Text, VStack,
  SimpleGrid, Card, CardHeader, CardBody, CardFooter,
  Button, Badge, Stat, StatLabel, StatNumber,
} from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'
import { FiUsers, FiBarChart2, FiSettings } from 'react-icons/fi'
import Navbar from '../Navbar'

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '1', color: 'blue' },
    { label: 'Companies', value: '0', color: 'green' },
    { label: 'Students', value: '1', color: 'purple' },
    { label: 'Active Listings', value: '0', color: 'orange' },
  ]

  return (
     <>
      <Navbar />
        <Container maxW='container.xl' py={8}>
          <VStack spacing={8} align='stretch'>
            {/* Welcome Section */}
            <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
              <Heading size="lg" mb={2}>System Administration</Heading>
              <Text color="gray.600">Manage the OJT portal and monitor system activity</Text>
              <Badge colorScheme="orange" mt={2}>Administrator</Badge>
            </Box>

            {/* Stats */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardBody>
                    <Stat>
                      <StatNumber fontSize="2xl" color={`${stat.color}.600`}>
                        {stat.value}
                      </StatNumber>
                      <StatLabel>{stat.label}</StatLabel>
                    </Stat>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>

            {/* Management Tools */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              <Card>
                <CardHeader>
                  <Heading size="md" display="flex" alignItems="center">
                    <FiUsers mr={2} />  User Management
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Text>View, edit, and manage all user accounts</Text>
                </CardBody>
                <CardFooter>
                  <Button colorScheme="yellow" width="full">Manage Users</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <Heading size="md" display="flex" alignItems="center">
                    <FiBarChart2 mr={2} />  System Reports
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Text>Generate reports and analytics</Text>
                </CardBody>
                <CardFooter>
                  <Button colorScheme="green" width="full">View Reports</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <Heading size="md" display="flex" alignItems="center">
                    <FiSettings mr={2} />  System Settings
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Text>Configure system preferences and options</Text>
                </CardBody>
                <CardFooter>
                  <Button colorScheme="teal" width="full">Settings</Button>
                </CardFooter>
              </Card>
            </SimpleGrid>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <Heading size="md">Recent System Activity</Heading>
              </CardHeader>
              <CardBody>
                <Text color="gray.500" textAlign="center" py={4}>
                  No recent system activity
                </Text>
              </CardBody>
            </Card>
          </VStack>
        </Container>
     </>
  )
}

export default AdminDashboard