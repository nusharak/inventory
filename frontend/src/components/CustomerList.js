import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { Grid2, TextField, Pagination, Button, Box, Typography, CircularProgress } from '@mui/material';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom';
import CustomerCard from './CustomerCard';
import { Search as SearchIcon, ShoppingCartOutlined } from '@mui/icons-material';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/customers?page=${page}&limit=${rowsPerPage}&search=${search}`
      );
      setCustomers(response.data.customer);
      setTotalPages(Math.ceil(response.data.total / rowsPerPage));
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); 
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/customer/${id}`);
      
      if (response.status === 200) {    
        toast.success('customer deleted successfully!');
        fetchCustomers();
      }else{
        toast.error('Failed to delete the customer. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete the customer. Please try again.');
    }
  };

  const handleEdit = (customer) => {
    navigate(`/edit-customer/${customer.id}`);
  };
 const handleViewOrder=(customerID)=>{
  navigate(`/orders/${customerID}`)
 }
 const handleViewProducts = (customerID) => {
  navigate(`/products/${customerID}`);
};

  return (
    <Box sx={{ padding: 3 ,marginLeft: { xs: 0, md: '0',sm :'0' }}}>
     
     <Grid2 container alignItems="center" sx={{ marginBottom: 3 }}>
    <Grid2 item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', textAlign: 'center' }}
      >
        Customers
      </Typography>
    </Grid2>
  </Grid2>
  <Grid2 container alignItems="center" sx={{ marginBottom: 3,justifyContent: 'space-between' }}>
    {/* <Grid2 item xs={12} sx={{ display: 'flex',gap:5, justifyContent: 'space-between', alignItems: 'center' }}> */}
      {/* Search Bar */}
      <Box sx={{ maxWidth: 300 }}>
        <TextField
          fullWidth
          size="small"
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
        onClick={() => navigate('/add-customer')}
        sx={{ backgroundColor: '#1976d2', color: 'white' }}
      >
        Add Customer
      </Button>
    {/* </Grid2> */}
  </Grid2>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      ) : customers.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '60vh',
          }}
        >
          <ShoppingCartOutlined sx={{ fontSize: 100, color: 'gray' }} />
          <Typography variant="h6" sx={{ marginTop: 2, color: 'gray' }}>
            No customer found
          </Typography>
        </Box>
      ) : (
        <Grid2 container spacing={3} sx={{  }}>
          {customers?.map((customer) => (
            <Grid2 item key={customer.id} xs={12} sm={6} md={4} lg={3}>
              <CustomerCard 
              customer={customer} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onViewOrders={handleViewOrder}
              onViewProducts={handleViewProducts}
               />
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

export default CustomerList;
