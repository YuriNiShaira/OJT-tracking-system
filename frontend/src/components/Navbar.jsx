import React from 'react'
import {
  Box, Flex, Heading, Button, Avatar, Menu, MenuButton,
  MenuList, MenuItem, Text, IconButton, HStack
} from '@chakra-ui/react'
import { FiBell, FiMenu, FiChevronDown } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import NotificationsDropdown from './notifications/NotificationsDropdown'

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const getUserName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    return user?.username || 'User'
  }

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'student': return 'Student'
      case 'company': return 'Company'
      case 'admin': return 'Admin'
      default: return ''
    }
  }

  return (
    <Box
      position="sticky"
      top={0}
      left={0}
      right={0}
      bg="white"
      boxShadow="sm"
      borderBottom="1px"
      borderColor="gray.200"
      zIndex={20}
      px={{ base: 4, md: 6 }}
      py={3}
    >
      <Flex justifyContent="space-between" alignItems="center">
        {/* Left side - Logo and toggle */}
        <HStack spacing={4}>
          <IconButton
            icon={<FiMenu />}
            onClick={onToggleSidebar}
            variant="ghost"
            aria-label="Toggle sidebar"
            display={{ base: 'flex', md: 'none' }}
          />
          
          <Heading
            color="brand.yellow"
            cursor="pointer"
            onClick={() => navigate('/dashboard')}
            size="lg"
            fontSize={{ base: 'xl', md: '2xl' }}
          >
            OJT Finder
          </Heading>
          
          <Text
            display={{ base: 'none', md: 'block' }}
            color="gray.600"
            fontSize="sm"
            fontWeight="medium"
          >
            {getRoleLabel()} Portal
          </Text>
        </HStack>

        {/* Right side - User menu and notifications */}
        <HStack spacing={4}>
          <NotificationsDropdown />
          
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<FiChevronDown />}
              variant="ghost"
              leftIcon={
                <Avatar
                  size="sm"
                  name={getUserName()}
                  bg="yellow.500"
                  color="white"
                />
              }
            >
              <Box display={{ base: 'none', md: 'block' }}>
                <Text fontSize="sm" fontWeight="medium">
                  {getUserName()}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {getRoleLabel()}
                </Text>
              </Box>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate('/profile')}>
                My Profile
              </MenuItem>
              <MenuItem onClick={() => navigate('/settings')}>
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout} color="red.500">
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  )
}

export default Navbar