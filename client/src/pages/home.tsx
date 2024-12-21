import React from 'react'
import { useList } from '@refinedev/core'
import {
Typography,
Box,
Stack,
} from '@mui/material'
import {
 PieChart,
 PropertyReferrals,
 TotalRevenue,
 PropertyCard,
 TopAgent,
} from '../components'
import { grey } from '@mui/material/colors'

const home = () => {
  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color='#11142D'>
        Dashboard
      </Typography>
      <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
        <PieChart
          title="Property for sale"
          value={684}
          series={[75,25]}
          colors={['#475BE8','#E4E8EF']}
        />
        <PieChart
          title="Property for rent"
          value={550}
          series={[60,40]}
          colors={['#FD8539','#F2F6FC']}
        />
        <PieChart
          title="Total customers"
          value={5684}
          series={[75,25]}
          colors={['#2ED480','#F2F6FC']}
        />
        <PieChart
          title="Total cities"
          value={555}
          series={[75,25]}
          colors={['#FE6D8E','#F2F6FC']}
        />
      </Box>
      <Stack mt="25" width="100%"
      direction={{xs:'column', lg:'row'}} gap={4}>
        <TotalRevenue/>
        <PropertyReferrals/>
      </Stack>
    </Box>
  )
}

export default home