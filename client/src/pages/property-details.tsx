import { Typography, Stack, Box, capitalize } from "@mui/material";
import { useDelete, useGetIdentity, useShow } from "@refinedev/core";
import { useParams, useNavigate } from "react-router";
import { ChatBubble, Delete, Edit, Phone, Place, Star } from "@mui/icons-material";
import { CustomButton } from "../components";
import {User} from '../components/common/datas'


const PropertyDetails = () => {
  const navigate = useNavigate();
  const {data:userData}=useGetIdentity();
  const user=userData as User;
  const {id}=useParams();
  const {mutate}=useDelete();
  const {queryResult}=useShow();
  const {data, isLoading, isError}=queryResult;
  const propertyDetails = data?.data??{};

  if(isLoading) return <div>Loading...</div>
  if(isError) return <div>Error</div>

  const isCurrentUser = user.email === propertyDetails.creator.email;

  const handleDeleteProperty=()=>{
    const response = confirm('are you sure you want to delete this property?');
    if(response){
      mutate({
        resource:'api/v1/properties',
        id: id as string,
      });
      navigate('/properties');
    }
  }

  return (
    <Box borderRadius='15px' padding='20px' bgcolor='#fcfcfc' width='fit-content'>
      <Typography fontSize={25} fontWeight={700} color="#11142d">Details</Typography>
      <Box mt='20px' display='flex' flexDirection={{xs:"column",lg:'row'}} gap={4}>

        <Box flex={1} maxWidth={764}>
          <img
            src={propertyDetails.photo}
            alt={propertyDetails.title}
            height={546}
            style={{objectFit:'cover', borderRadius:'10px'}}
            className="property_details-img"
          />
          <Box mt='15px'>
            <Stack direction='row' justifyContent='space-between' alignItems='center' flexWrap='wrap'>
              <Typography fontSize={18} fontWeight={500} color="#11142d" textTransform="capitalize">
                {propertyDetails.propertyType}
              </Typography>
              <Box>
                {[1,2,3,4,5].map((star)=><Star key={star} sx={{color:'#f2c94c'}}/>)}
              </Box>
            </Stack>
            <Stack direction='row' justifyContent='space-between' alignItems='center' flexWrap='wrap'>
              <Typography fontSize={22} fontWeight={600} color="#11142d" textTransform="capitalize">
                {propertyDetails.title}
              </Typography>
              <Stack mt={0.5} direction='row' alignItems='center' gap={0.5}>
                <Place sx={{color:'#808191'}}/>
                <Typography fontSize={14} color="#808191" textTransform="capitalize">
                {propertyDetails.location}
                </Typography>
              </Stack>
            </Stack>
            <CustomButton
              title='delete'
              handleClick={handleDeleteProperty}
              backgroundColor='#475be8'
              color='#fcfcfc'
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default PropertyDetails