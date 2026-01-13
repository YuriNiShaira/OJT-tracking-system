import React, { useState } from 'react'
import {
  Box, VStack, HStack, Text, IconButton, Divider,
  Button, useColorModeValue, Collapse
} from '@chakra-ui/react'
import {
  FiHome, FiBriefcase, FiUsers, FiFileText, FiSettings,
  FiCalendar, FiUser, FiDollarSign, FiMenu, FiChevronLeft,
  FiChevronRight, FiLayers
} from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

const SideBar = ({ isOpen, onToggle }) => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const bgColor = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')

    const studentNavitems = [
        { label: 'Dashboard', icon: FiHome, path:'/dashboard' },
        { label: 'Browse OJT', icon: FiBriefcase, path: '/ojt' },
        { label: 'My Applications', icon: FiFileText, path: '/student/applications' },
        { label: 'Schedule', icon: FiCalendar, path: '/student/schedule' },
        { label: 'Profile', icon: FiUser, path: '/profile' },
    ]


    const companyNavItems = [
        { label: 'Dashboard', icon: FiHome, path: '/dashboard' },
        { label: 'Post OJT', icon: FiBriefcase, path: '/ojt/create' },
        { label: 'My Listings', icon: FiLayers, path: '/company/listings' },
        { label: 'Applications', icon: FiFileText, path: '/company/applications' },
        { label: 'Schedule', icon: FiCalendar, path: '/company/schedule' },
        { label: 'Company Profile', icon: FiUsers, path: '/company/profile' },
    ]


    const adminNavItems = [
        { label: 'Dashboard', icon: FiHome, path: '/dashboard' },
        { label: 'Users', icon: FiUsers, path: '/admin/users' },
        { label: 'Listings', icon: FiBriefcase, path: '/admin/listings' },
        { label: 'Applications', icon: FiFileText, path: '/admin/applications' },
        { label: 'Reports', icon: FiDollarSign, path: '/admin/reports' },
        { label: 'Settings', icon: FiSettings, path: '/admin/settings' },
    ]

    const getNavItems = () => {
        switch(user?.role){
            case 'student' : return studentNavitems
            case 'company' : return companyNavItems
            case 'admin' : return adminNavItems
            default: return[]
        }
    }

    const navItems = getNavItems()

    const handleLogout = async() => {
        await logout()
        navigate('/login')
    }

    return (
        <Box
            position="fixed"
            left={0}
            top="64px" // Below navbar
            h="calc(100vh - 64px)"
            w={isOpen ? "250px" : "70px"}
            bg={bgColor}
            borderRight="1px"
            borderColor={borderColor}
            transition="all 0.3s ease"
            zIndex={10}
            overflowY="auto"
            overflowX="hidden"
            >
            {/* Toggle Button */}
            <Box p={4} display='flex' justifyContent={isOpen ? 'flex-end': 'center'}>
                <IconButton
                    icon={isOpen ? <FiChevronLeft /> : <FiChevronRight />}
                    onClick={onToggle}
                    size="sm"
                    variant="ghost"
                    aria-label="Toggle sidebar"
                />
            </Box>

            <Divider />

            {/* Navigation Items */}
            <VStack spacing={1} p={4} align='stretch' >
                {navItems.map((item)=> {
                    const isActive = location.pathname === item.path
                    return(
                        <Button
                            key={item.label}
                            leftIcon={<item.icon />}
                            justifyContent={isOpen ? "flex-start" : "center"}
                            variant={isActive ? "solid" : "ghost"}
                            colorScheme={isActive ? "yellow" : "gray"}
                            onClick={() => navigate(item.path)}
                            size="lg"
                            px={isOpen ? 4 : 2}
                            width="100%"
                            mb={1}
                        >
                            {isOpen && (
                                <Text ml={2} fontSize='md'>
                                    {item.label}
                                </Text>
                            )}
                        </Button>
                    )
                })}
            </VStack>

            {/* User Info (only shown when sidebar is open) */}
            <Collapse in={isOpen}>
                <Box p={4} mt="auto" borderTop="1px" borderColor={borderColor}>
                    <VStack spacing={2} align="stretch">
                        <Text fontSize="sm" fontWeight="bold" color="gray.600">
                            {user?.role === 'student' && 'Student Account'}
                            {user?.role === 'company' && 'Company Account'}
                            {user?.role === 'admin' && 'Administrator'}
                        </Text>

                        <Text fontSize="xs" color="gray.500" noOfLines={1}>
                            {user?.email}
                        </Text>

                        <Button
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            onClick={handleLogout}
                            mt={2}
                            >
                        Logout
                        </Button>
                    </VStack>
                </Box>
            </Collapse>
        </Box>
    )
}
export default SideBar