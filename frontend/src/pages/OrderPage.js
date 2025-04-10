import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, useMediaQuery, useTheme, TablePagination, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from '../utils/api';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';

const OrdersPage = () => {
  const { customer_id } = useParams();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orders, setOrders] = useState([]);
  const [viewData, setViewData] = useState({});
  const [open, setOpen] = useState(false);

  const receiptRef = useRef();

  const fetchOrders = () => {
    console.log("$$$$$$$$$$$$$$$$$$");
   
    axios.get(`customer-orders/${customer_id}`)
      .then((res) => {
        if (res.status === 200) {
          setOrders(res.data.customerOrders);
        }
      })
      .catch((err) => {
        console.log(err, 'Error in getting customer Orders');
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [customer_id]);

  const handleViewClick = (orderId) => {
    axios.get(`customer-order-products/${orderId}`)
      .then((res) => {
        if (res.status === 200) {
          setViewData(res.data.customerProducts.customerProducts);
          setOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedOrders = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ padding: 3, marginLeft: { xs: 0, } }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Orders List
      </Typography>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              {!isSmallScreen && <TableCell>Payment Mode</TableCell>}
              <TableCell>Total</TableCell>
              <TableCell>Ordered Date</TableCell>
              {!isSmallScreen && <TableCell>View</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedOrders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{order.order_id}</TableCell>
                {!isSmallScreen && <TableCell>{order.paymentMode}</TableCell>}
                <TableCell>${parseFloat(order.total).toFixed(2)}</TableCell>
                <TableCell>{moment.unix(order.timestamp).format('DD/MM/YYYY')}</TableCell>
                {!isSmallScreen && (
                  <TableCell>
                    <Button variant="outlined" size='small' onClick={() => handleViewClick(order.order_id)}>
                      View
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          <div ref={receiptRef}>
            <Typography variant="h6" gutterBottom>
              Receipt
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography>Order ID: {viewData?.customer_order?.order_id}</Typography>
                <Typography>Customer: {viewData?.customer_order?.customer_name}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography>Payment Mode: {viewData?.customer_order?.paymentMode}</Typography>
                <Typography>Total: ${parseFloat(viewData?.customer_order?.total).toFixed(2)}</Typography>
                <Typography>Date: {moment.unix(viewData?.customer_order?.timestamp).format('DD/MM/YYYY')}</Typography>
              </Box>
            </Box>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viewData?.cart_items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handlePrint} variant="contained" color="secondary">
            Print Receipt
          </Button>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersPage;
