import React from 'react'
import {
  Box, Card, CardBody, CardFooter, Heading, Text,
  Badge, Button, VStack, HStack, Flex
} from '@chakra-ui/react'
import { CalendarIcon, TimeIcon } from '@chakra-ui/icons'
import { FaMapMarkerAlt, FaMoneyBill } from 'react-icons/fa'
import { Link as RouterLink } from 'react-router-dom'

const JobCard = ( {job} ) => {
    // Helper function to get display names
    const getDisplayName = (value, choices) => {
        if(!value) return 'Not specified'

        // If choices array is provided in job object
        if (job[`${value}_choices`]) {
            const choice = job[`${value}_choices`].find(c => c[0] === value)
            return choice ? choice[1] : value
        }
        // Fallback: humanize the value
        return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    const formatCurrency = (amount) => {
        if (!amount || amount === '0.00') return 'No allowance'
        return `₱${parseFloat(amount).toLocaleString('en-PH')}/month`
    }

    const getBadgeColor = (status) => {
        switch(status) {
        case 'open': return 'green'
        case 'filled': return 'blue'
        case 'closed': return 'red'
        case 'ongoing': return 'purple'
        default: return 'gray'
        }
    }

    return (
        <Card variant="outline" height="100%" _hover={{ shadow: 'md' }}>
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <Flex justify="space-between" align="start">
            <Heading size="md" noOfLines={2}>{job.title}</Heading>
            <Badge colorScheme={getBadgeColor(job.status)}>
              {getDisplayName(job.status, [
                ['open', 'OPEN'],
                ['filled', 'FILLED'],
                ['closed', 'CLOSED'],
                ['ongoing', 'ONGOING']
              ])}
            </Badge>
          </Flex>
          
          <Text fontWeight="bold" color="blue.600">{job.company_name}</Text>
          
          <HStack spacing={4}>
            <Badge colorScheme="yellow">
              {getDisplayName(job.ojt_type)}
            </Badge>
            <Badge colorScheme="teal">{job.required_hours} hours</Badge>
          </HStack>
          
          <Box>
            <Text fontSize="sm" color="gray.600" display="flex" alignItems="center">
              <Box as={FaMapMarkerAlt} mr={2} /> {job.location}
            </Text>
            <Text fontSize="sm" color="gray.600" display="flex" alignItems="center" mt={1}>
              <CalendarIcon mr={2} /> 
              Apply before: {new Date(job.application_deadline).toLocaleDateString('en-PH')}
            </Text>
            <Text fontSize="sm" color="gray.600" display="flex" alignItems="center" mt={1}>
              <TimeIcon mr={2} /> 
              {job.duration_weeks} weeks
            </Text>
            <Text fontSize="sm" color="gray.600" display="flex" alignItems="center" mt={1}>
              <Box as={FaMoneyBill} mr={2} /> 
              {formatCurrency(job.allowance)}
            </Text>
          </Box>
          
          <Text noOfLines={3} fontSize="sm">
            {job.description}
          </Text>
          
          <Box>
            <Text fontSize="xs" color="gray.500">
              Course: {getDisplayName(job.course_requirement, [
                ['cit', 'IT'],
                ['coa', 'Accountancy'],
                ['coed', 'Education'],
                ['chm', 'Hospitality'],
                ['cba', 'Business'],
                ['all', 'All Courses']
              ])} | 
              Year: {job.year_level_requirement === 0 ? 'Any' : `Year ${job.year_level_requirement}+`}
            </Text>
            <Text fontSize="xs" color="gray.500" mt={1}>
              Slots: {job.slots_available} available
            </Text>
          </Box>
        </VStack>
      </CardBody>
      <CardFooter pt={0}>
        <Button
          as={RouterLink}
          to={`/ojt/${job.id}`}
          colorScheme="yellow"
          width="full"
          size="sm"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
    )
}
export default JobCard