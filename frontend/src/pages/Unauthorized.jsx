import React from 'react'
import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { WarningIcon } from '@chakra-ui/icons'

const Unauthorized = () =>{
    return(
        <Container maxW='container.md' py={20}>
            <VStack spacing={8} textAlign='center'>
                <WarningIcon boxSize={20} color='red.500' />
                <Heading>Access Denied</Heading>
                <Text fontSize='lg' color='gray.600'>
                    You don't have permission to access this page
                </Text>
                <Button as={RouterLink} to='/dashboard' colorScheme='blue'>
                    Go to Dashboard
                </Button>
            </VStack>
        </Container>
    )
}

export default Unauthorized