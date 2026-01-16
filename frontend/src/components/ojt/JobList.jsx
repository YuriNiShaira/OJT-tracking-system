import React, { useState, useEffect } from 'react'
import {
  Box, SimpleGrid, Heading, Text, Select, Input,
  InputGroup, InputLeftElement, VStack, HStack,
  Container, Skeleton, Alert, AlertIcon, Button
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { ojtService } from '../../services/ojtService'
import JobCard from './JobCard'
import Navbar from '../Navbar'

const JobList = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    course: '',
    location: '',
    ojt_type: ''
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      // Remove empty filters
      const activeFilters = {}
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          activeFilters[key] = filters[key]
        }
      })
      
      const data = await ojtService.getAllListings(activeFilters)
      setJobs(Array.isArray(data) ? data : [])
      setError('')
    } catch (err) {
      setError('Failed to load OJT listings')
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    fetchJobs()
  }

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height="300px" borderRadius="lg" />
          ))}
        </SimpleGrid>
      </Container>
    )
  }

  return (
    <>
        <Navbar />
        <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
            <Box>
            <Heading size="lg" mb={2}>Available OJT Positions</Heading>
            <Text color="gray.600">Find internship opportunities for your course</Text>
            </Box>

            {/* Filters */}
            <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
            <VStack spacing={4} align="stretch">
                <HStack spacing={4} wrap="wrap">
                <InputGroup maxW="300px">
                    <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                    placeholder="Search OJT positions..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </InputGroup>

                <Select
                    placeholder="All Courses"
                    maxW="200px"
                    value={filters.course}
                    onChange={(e) => handleFilterChange('course_requirement', e.target.value)}
                >
                    <option value="cit">Information Technology</option>
                    <option value="coa">Accountancy</option>
                    <option value="coed">Education</option>
                    <option value="chm">Hospitality Management</option>
                    <option value="cba">Business Administration</option>
                </Select>

                <Select
                    placeholder="All Locations"
                    maxW="200px"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                >
                    <option value="Cabiao">Cabiao</option>
                    <option value="Gapan City">Gapan City</option>
                    <option value="Cabanatuan">Cabanatuan</option>
                    <option value="Jaen">Jaen</option>
                    <option value="San Isidro">San Isidro</option>
                </Select>

                <Select
                    placeholder="OJT Type"
                    maxW="200px"
                    value={filters.ojt_type}
                    onChange={(e) => handleFilterChange('ojt_type', e.target.value)}
                >
                    <option value="required">Required OJT</option>
                    <option value="elective">Elective</option>
                </Select>
                </HStack>
                
                <Button 
                colorScheme="yellow" 
                onClick={handleSearch}
                alignSelf="flex-start"
                size="sm"
                >
                Apply Filters
                </Button>
            </VStack>
            </Box>

            {error && (
            <Alert status="error" borderRadius="lg">
                <AlertIcon />
                {error}
            </Alert>
            )}

            {/* Job Listings */}
            {jobs.length === 0 ? (
            <Box textAlign="center" py={10}>
                <Text fontSize="lg" color="gray.500">
                No OJT positions found. Check back later!
                </Text>
                <Button 
                colorScheme="yellow" 
                mt={4}
                onClick={fetchJobs}
                >
                Refresh Listings
                </Button>
            </Box>
            ) : (
            <>
                <Text color="gray.600" fontSize="sm">
                Showing {jobs.length} OJT position{jobs.length !== 1 ? 's' : ''}
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {jobs.map(job => (
                    <JobCard key={job.id} job={job} />
                ))}
                </SimpleGrid>
            </>
            )}
        </VStack>
        </Container>
    </>
  )
}

export default JobList