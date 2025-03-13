import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Tooltip } from '@mui/material';
import { BASE_URL } from '../constants/DefaultValues';

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <Card sx={{ maxWidth: 300, margin: 2 }}>
      <CardMedia component="img" 
       height={140} width={200}
       sx={{ objectFit: 'cover' }}  
       image={BASE_URL+product.image} 
       alt={product.name} />
      <CardContent>
      <Tooltip title={product.name} arrow>
        <Typography  sx={{ 
          fontSize: '1.1rem', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap', 
          width: '100%' 
        }} variant="h6">{product.name}</Typography>
        </Tooltip>
        <Typography variant="body2" sx={{ fontSize: '1rem' }} color="text.secondary">
          Price: ${product.price}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem' }} color="text.secondary">
          Stock: {product.stock}
        </Typography>
        <Box mt={2}>
          <Button size="small" onClick={() => onEdit(product)}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={() => onDelete(product.id)}>
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
