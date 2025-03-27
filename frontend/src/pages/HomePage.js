import React, { useEffect, useState } from 'react';
import { Grid, Typography, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
     const [products, setProducts] = useState([]);
       const [loading, setLoading] = useState(true);
       const [search, setSearch] = useState('');
const [page, setPage] = useState(1);
 const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage] = useState(6);
    //    const fetchProducts = async () => {
    //     setLoading(true);
    //     try {
    //       const response = await axios.get(
    //         `/products?page=${page}&limit=${rowsPerPage}&search=${search}`
    //       );
    //       setProducts(response.data.products);
    //       setTotalPages(Math.ceil(response.data.total / rowsPerPage));
    //     } catch (error) {
    //       console.error('Error fetching products:', error);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
    
    //   useEffect(() => {
    //     fetchProducts();
    //   }, [page, search]);
  // Initialize the navigate function
  const navigate = useNavigate();

  // Handle the button click to navigate to the products page
  const handleStartShopping = () => {
    navigate("/customers");
    window.location.reload()
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4', height: '100%' }}>
      {/* Hide the Sidebar and Navbar */}
      <Box mb={4}>
        <Typography variant="h3" gutterBottom>
          Welcome to Our Store!
        </Typography>
        <Typography variant="h6" paragraph>
          Explore our wide range of products. We offer quality items at great prices.
        </Typography>
        {/* Button with onClick event */}
        <Button variant="contained" color="primary" onClick={handleStartShopping}>
          Start Shopping
        </Button>
      </Box>

      {/* Display products */}
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </CardContent>
              {/* View Details button for each product */}
              <Button size="small" component="a" href={`/products/${product.id}`} color="primary">
                View Details
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default HomePage;
