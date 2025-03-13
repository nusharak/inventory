import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Tooltip } from '@mui/material';
import { BASE_URL } from '../constants/DefaultValues';
import sampleImg from '../public/images/istockphoto-1327592506-612x612.jpg'
const CustomerCard = ({ customer, onEdit, onDelete, onViewOrders, onViewProducts }) => {
  return (
    <Card sx={{ maxWidth: 300, margin: 2 }}>
      <CardMedia 
        component="img" 
        height={140} 
        sx={{ objectFit: 'cover' }}  
        image={ customer.profile_pic ? BASE_URL + customer.profile_pic : sampleImg } 
        alt={customer.name} 
      />
      <CardContent>
        <Tooltip title={customer.name} arrow>
          <Typography  
            sx={{ 
              fontSize: '1.1rem', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap', 
              width: '100%' 
            }} 
            variant="h6">
            {customer.name}
          </Typography>
        </Tooltip>
        <Typography variant="body2" sx={{ fontSize: '1rem' }} color="text.secondary">
          Email: {customer.email}
        </Typography>
        <Box mt={2}>
          <Button size="small" onClick={() => onEdit(customer)}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={() => onDelete(customer.id)}>
            Delete
          </Button>
        </Box>
        <Box mt={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={() => onViewOrders(customer.id)}
          >
            View Orders
          </Button>
          <Button 
            size="small" 
            variant="outlined" 
            color="primary" 
            onClick={() => onViewProducts(customer.id)}
          >
            Purchace
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
