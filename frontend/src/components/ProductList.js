import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { Grid2, TextField, Pagination, Button, Box, Typography, CircularProgress } from '@mui/material';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCards';
import { Search as SearchIcon, ShoppingCartOutlined } from '@mui/icons-material';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/products?page=${page}&limit=${rowsPerPage}&search=${search}`
      );
      setProducts(response.data.products);
      setTotalPages(Math.ceil(response.data.total / rowsPerPage));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); 
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/product/${id}`);
      
      if (response.status === 200) {    
        toast.success('Product deleted successfully!');
        fetchProducts();
      }else{
        toast.error('Failed to delete the product. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete the product. Please try again.');
    }
  };

  const handleEdit = (product) => {
    navigate(`/edit-product/${product.id}`);
  };

  return (
    <Box sx={{ padding: 3 ,marginLeft: { xs: 0, md: '0px',sm :'0px' }}}>
     
     <Grid2 container alignItems="center" sx={{ marginBottom: 3 }}>
    <Grid2 item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', textAlign: 'center' }}
      >
        Products
      </Typography>
    </Grid2>
  </Grid2>
  <Grid2 container alignItems="center" sx={{ marginBottom: 3,justifyContent: 'space-between' }}>
    {/* <Grid2 item xs={12} sx={{ display: 'flex',gap:5, justifyContent: 'space-between', alignItems: 'center' }}> */}
      {/* Search Bar */}
      <Box  sx={{  maxWidth: '300 '}}>
        <TextField
          fullWidth
          size="medium"
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ marginRight: 1 }} />,
          }}
        />
      </Box>
      <Button
        variant="contained"
        onClick={() => navigate('/add-product')}
        sx={{ backgroundColor: '#1976d2', color: 'white' }}
      >
        Add Product
      </Button>
    {/* </Grid2> */}
  </Grid2>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
            flexDirection: 'column',
            height: '60vh',
          }}
        >
          <ShoppingCartOutlined sx={{ fontSize: 100, color: 'gray' }} />
          <Typography variant="h6" sx={{ marginTop: 2, color: 'gray' }}>
            No products found
          </Typography>
        </Box>
      ) : (
        <Grid2 container spacing={3} sx={{  }}>
          {products.map((product) => (
            <Grid2 item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} onEdit={handleEdit} onDelete={handleDelete} />
            </Grid2>
          ))}
        </Grid2>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>
    </Box>
  );
};

export default ProductList;
