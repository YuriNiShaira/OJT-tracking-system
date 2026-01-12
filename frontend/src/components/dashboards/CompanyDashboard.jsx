import React from 'react'
import {
  Box, Container, Heading, Text, VStack,
  SimpleGrid, Card, CardHeader, CardBody, CardFooter,
  Button, Avatar, Badge, Stat, StatLabel, StatNumber
} from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'
import { AddIcon, ViewIcon, SettingsIcon } from '@chakra-ui/icons'

const CompanyDashboard = () => {
    const { user } = useAuth()

    const stats = [
        { label: 'Active Listing', value:'0', color:'blue' },
        { label: 'Total Application', value:'0', color: 'green'},
        { label: 'Interview Schedule', value: '0', color: 'purple' },
    ]

    return(
        <Container maxW='container.xl' py={8}>
            <VStack spacing={8} align='stretch'>
                {/* Welcome Section */}
                <Box bg='white' p={6} borderRadius='xl' boxShadow='sm'>
                    <Box display='flex' alignItems='center' mb={4}>
                        <Avatar size="lg" name={user?.company_name} mr={4} />
                        <Box>
                            <Heading size="lg">{user?.company_name}</Heading>
                            <Text color="gray.600">{user?.company_address}</Text>
                            <Badge colorScheme="blue" mt={2}>Company Account</Badge>
                        </Box>
                    </Box>
                </Box>
                {/* Stats */}
                <SimpleGrid columns={{ base:1, md:3 }} spacing={6} >
                    {stats.map((stat, index)=> (
                        <Card key={index}>
                            <CardBody>
                                <Stat>
                                    <StatNumber fontSize='3x1' color={`${stat.color}.600`} >
                                        {stat.value}
                                    </StatNumber>
                                    <StatLabel>{stat.label}</StatLabel>
                                </Stat>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>
                {/* Quick Actions */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    <Card>
                        <CardHeader>
                            <Heading size="md" display="flex" alignItems="center">
                                <AddIcon mr={2} /> Post OJT Position
                            </Heading>
                        </CardHeader>
                        <CardBody>
                            <Text>Create new internship listing for students</Text>
                        </CardBody>
                        <CardFooter>
                            <Button colorScheme="yellow" width="full">Post Job</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Heading size="md" display="flex" alignItems="center">
                                <SettingsIcon mr={2} /> Company Settings
                            </Heading>
                        </CardHeader>
                        <CardBody>
                            <Text>Update company profile and preferences</Text>
                        </CardBody>
                        <CardFooter>
                            <Button colorScheme='teal' width='full'>Settings</Button>
                        </CardFooter>
                    </Card>
                    
                    {/* Recent Applications */}
                    <Card>
                        <CardHeader>
                            <Heading size="md">Recent Applications</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text color="gray.500" textAlign="center" py={4}>
                                No applications yet. Post your first OJT listing!
                            </Text>
                        </CardBody>
                    </Card>
                </SimpleGrid>

            </VStack>
        </Container>
    )
}
export default CompanyDashboard