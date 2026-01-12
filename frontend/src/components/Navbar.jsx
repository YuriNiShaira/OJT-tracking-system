import React from 'react'
import {
  Box, Flex, Heading, Button, Avatar, Menu, MenuButton,
  MenuList, MenuItem, Text, useToast
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate()
    const toast = useToast()

    const handleLogout = async () => {
        await logout()
        toast({
            title: 'Logged out successfully',
            status: 'info',
            duration: 3000
        })
        navigate('/login')
    }
    
    const getRoleBadgeColor = (role) => {
        switch(role){
            case 'student': return 'green'
            case 'company': return 'blue'
            case 'admin': return 'orange'
            default: return 'gray'
        }
    }

    return (
        <Box bg='white' px={6} py={4} boxShadow='sm' borderBottom='1px' borderColor='gray.200'>
            <Flex justifyContent='space-between' alignItems='center'>
                <Flex alignItems="center">
                    <Heading color='brand.yellow' cursor='pointer' onClick={() => navigate('/dashboard')}>
                        OJTrack
                    </Heading>
                    <Text ml={4} color="gray.600" fontSize="sm">
                        {user?.role === 'student' && 'Student Portal'}
                        {user?.role === 'company' && 'Company Portal'}
                        {user?.role === 'admin' && 'Admin Portal'}
                    </Text>
                </Flex>

                <Flex alignItems="center">
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronRightIcon />} variant='ghost'>
                            <Flex alignItems='center'>
                                <Avatar size='sm' name={user?.first_name + ' ' + user?.last_name} mr={2} />
                                <Text>{user?.first_name || user?.username}</Text>
                            </Flex>
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
                            <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout} color="red.500">Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
        </Box>
    )

}

export default Navbar