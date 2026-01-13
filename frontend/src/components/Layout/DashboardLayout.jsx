import React, { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import Navbar from '../Navbar'
import Sidebar from './Sidebar'

const DashboardLayout = ({children}) => {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    return(
        <Box>
            <Navbar onToggleSidebar={toggleSidebar} />
            
            <Flex>
                {/* Side */}
                <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
                
                {/* Main */}
                <Box
                    flex="1"
                    ml={{ base: '70px', md: sidebarOpen ? '250px' : '70px' }}
                    transition="margin-left 0.3s ease"
                    p={{ base: 4, md: 6 }}
                    pt="80px" // Account for navbar height
                    minH="calc(100vh - 64px)"
                    >
                {children}
                </Box>
            </Flex>
        </Box>
    )
}
export default DashboardLayout