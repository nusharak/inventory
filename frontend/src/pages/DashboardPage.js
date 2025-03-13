import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import SalesGraph from '../components/SalesGraph';
import axios from 'axios';

const Dashboard = () => {
    const [data, setData] = useState(null);

  useEffect(() => {
    // Call API to get dashboard data
    console.log("###################");
    
    axios.post('http://localhost:5000/api/dashboard')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data', error);
      });
  }, []);
  return (
    <Grid container spacing={3} justifyContent="center">
      {/* Total Customers */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Customers</Typography>
            <Typography variant="h4">{data?.totalCustomers}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Products */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Products</Typography>
            <Typography variant="h4">{data?.totalProducts}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Sales Today */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Sales Today</Typography>
            <Typography variant="h4">${data?.salesToday}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Sales This Week */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Sales This Week</Typography>
            <Typography variant="h4">${data?.salesThisWeek}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Sales This Month */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Sales This Month</Typography>
            <Typography variant="h4">${data?.salesThisMonth}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Sales This Year */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Sales This Year</Typography>
            <Typography variant="h4">${data?.salesThisYear}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Monthly Sales Graph */}
      <Grid item xs={12}>
        <SalesGraph monthlySales={data?.monthlySales} />
      </Grid>
    </Grid>
  );
}

export default Dashboard;
