import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid2,
  Paper,
  Pagination,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "../utils/api";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from "../constants/DefaultValues";
import { v4 as uuidv4 } from 'uuid'; // For generating temporary IDs

const CustomerProductsPage = () => {
  const { customer_id } = useParams();
  const [customerData, setCustomerData] = useState({});
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cashAmount, setCashAmount] = useState(0);
  const [chequeAmount, setChequeAmount] = useState(0);
  const productsPerPage = 6;
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const fetchDataForCustomerView = async () => {
    try {
      if (isOnline) {
        const res = await axios.get(`/customer-product-view/${customer_id}`);
        if (res.status === 200) {
          const { customer, products: serverProducts, cartItems: serverCartItems } = res.data;
          const productsMap = serverProducts.reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
          }, {});
          const updatedCartItems = serverCartItems.map((cartItem) => {
            const matchingProduct = productsMap[cartItem.product_id];
            return matchingProduct ? { ...cartItem, ...matchingProduct } : cartItem;
          });
          const remainingProducts = serverProducts.filter(
            (product) => !serverCartItems.some((cartItem) => cartItem.product_id === product.id)
          );
          setCustomerData(customer);
          setProducts(remainingProducts);
          setCart(updatedCartItems);
          localStorage.setItem(`cart_${customer_id}`, JSON.stringify(updatedCartItems));
        }
      } else {
        const storedCart = localStorage.getItem(`cart_${customer_id}`);
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
        // Fetch products from local storage or a predefined list if needed offline
        // This part depends on how you want to handle products offline
        // For simplicity, we might only show what's in the cart offline.
        // If you have a way to store product details offline, you can retrieve them here.
        // Example: setProducts(JSON.parse(localStorage.getItem('offline_products') || '[]'));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (!isOnline) {
        toast.error("Data is not available offline. Please connect to the internet.");
      }
    }
  };

  useEffect(() => {
    fetchDataForCustomerView();
  }, [customer_id, isOnline]);

  const addToCart = (product) => {
    if (isOnline) {
      axios
        .post("/cart/add-to-cart", {
          customer_id: customer_id,
          product_id: product.id,
          product_name: product.name,
          quantity: 1,
        })
        .then((res) => {
          if (res.status === 200) {
            fetchDataForCustomerView();
          }
        })
        .catch((err) => {
          console.error("Error adding to cart:", err);
          toast.error("Failed to add to cart. Please try again.");
        });
    } else {
      const existingItem = cart.find(item => item.product_id === product.id);
      if (existingItem) {
        const updatedCart = cart.map(item =>
          item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCart(updatedCart);
        localStorage.setItem(`cart_${customer_id}`, JSON.stringify(updatedCart));
      } else {
        const newItem = {
          id: uuidv4(), // Temporary ID for offline cart item
          customer_id: customer_id,
          product_id: product.id,
          name: product.name,
          description: product.description,
          image: product.image,
          price: product.price,
          stock: product.stock,
          quantity: 1,
        };
        setCart([...cart, newItem]);
        localStorage.setItem(`cart_${customer_id}`, JSON.stringify([...cart, newItem]));
      }
      toast.success(`${product.name} added to cart (offline).`);
    }
  };

  const removeFromCart = (productId) => {
    if (isOnline) {
      const cartItem = cart.find((item) => item.product_id === productId);
      if (!cartItem) return;
      axios
        .delete(`/cart/${cartItem.id}`, {
          data: { cart_id: cartItem.id, product_id: productId },
        })
        .then((res) => {
          if (res.status === 200) {
            fetchDataForCustomerView();
          }
        })
        .catch((err) => {
          console.error("Error removing from cart:", err);
          toast.error("Failed to remove from cart. Please try again.");
        });
    } else {
      const updatedCart = cart.filter(item => item.product_id !== productId);
      setCart(updatedCart);
      localStorage.setItem(`cart_${customer_id}`, JSON.stringify(updatedCart));
      toast.success("Item removed from cart (offline).");
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (isOnline) {
      const cartItem = cart.find((item) => item.product_id === productId);
      if (!cartItem) return;
      axios
        .put(`/cart/${cartItem.id}`, {
          cart_id: cartItem.id,
          product_id: productId,
          new_quantity: newQuantity,
        })
        .then((res) => {
          if (res.status === 200) {
            fetchDataForCustomerView();
          }
        })
        .catch((err) => {
          console.error("Error updating cart quantity:", err);
          toast.error("Failed to update quantity. Please try again.");
        });
    } else {
      const updatedCart = cart.map(item =>
        item.product_id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
      localStorage.setItem(`cart_${customer_id}`, JSON.stringify(updatedCart));
      toast.success("Cart quantity updated (offline).");
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const currentPageProducts = products.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setCashAmount(0);
    setChequeAmount(0);
  };

  const handleProceed = async () => {
    const totalAmount = calculateCartTotal();
    let balance = 0;

    if (paymentMode === "cash") {
      balance = cashAmount - totalAmount;
      if (cashAmount < totalAmount) {
        toast.error("Insufficient cash. Please provide the correct amount.");
        return;
      }
      toast.success(`Order placed successfully! Balance: $${balance.toFixed(2)}`);
    } else if (paymentMode === "cheque") {
      if (chequeAmount !== totalAmount) {
        toast.error("Cheque amount must match the total amount.");
        return;
      }
      toast.success("Order placed successfully with cheque payment!");
    }

    if (isOnline) {
      try {
        const res = await axios.post("customer/add-order", {
          customer_id: customer_id,
          customer_name: customerData?.first_name + ' ' + customerData?.last_name,
          cartItems: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
          paymentMode: paymentMode,
          totalAmount,
          balance: balance,
        });
        if (res.status === 200) {
          toast.success("Order created successfully!");
          localStorage.removeItem(`cart_${customer_id}`); // Clear local cart after successful order
          setCart([]);
          window.history.back();
          setIsDialogOpen(false);
          fetchDataForCustomerView();
        }
      } catch (error) {
        console.error("Error creating order:", error);
        toast.error("Failed to create order. Please try again.");
      }
    } else {
      // Store order details locally for later submission when online
      const offlineOrder = {
        customer_id: customer_id,
        customer_name: customerData?.first_name + ' ' + customerData?.last_name,
        cartItems: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
        paymentMode: paymentMode,
        totalAmount,
        balance: balance,
        timestamp: new Date().toISOString(),
      };
      const offlineOrders = JSON.parse(localStorage.getItem('offline_orders') || '[]');
      localStorage.setItem('offline_orders', JSON.stringify([...offlineOrders, offlineOrder]));
      toast.success("Order saved locally. It will be submitted when you are online.");
      localStorage.removeItem(`cart_${customer_id}`);
      setCart([]);
      window.history.back();
      setIsDialogOpen(false);
    }
  };

  const handlePayment = () => {
    if (paymentMode === "cheque") {
      setChequeAmount(calculateCartTotal());
    }
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (isOnline) {
      const offlineOrders = JSON.parse(localStorage.getItem('offline_orders') || '[]');
      offlineOrders.forEach(async (order) => {
        try {
          const res = await axios.post("customer/add-order", order);
          if (res.status === 200) {
            toast.success("Offline order submitted successfully!");
            const updatedOfflineOrders = offlineOrders.filter(o => o.timestamp !== order.timestamp);
            localStorage.setItem('offline_orders', JSON.stringify(updatedOfflineOrders));
          } else {
            toast.error("Failed to submit offline order.");
          }
        } catch (error) {
          console.error("Error submitting offline order:", error);
          toast.error("Failed to submit offline order.");
        }
      });
    }
  }, [isOnline]);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'nowrap', padding: 3, gap: 3 }}>
      {/* Products Section */}
      <Box sx={{ flex: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{ mb: 3, fontWeight: "bold", fontSize: "1.2rem", color: "#333" }}
        >
          👋 Welcome, {customerData.first_name} {customerData.last_name}! We're so
          glad to have you here.
        </Typography>

        <Grid2 container spacing={3}>
          {currentPageProducts.map((product) => (
            <Grid2 item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card>
                <CardContent>
                  <img
                    src={BASE_URL + product.image}
                    alt={product.name}
                    style={{ width: "200px", height: "150px" }}
                  />
                  <Typography variant="subtitle1">{product.name}</Typography>
                  <Typography variant="subtitle2">Price: ${product.price}</Typography>
                  <Typography variant="subtitle2">Stock: {product.stock}</Typography>
                  <Button
                    size="small"
                    sx={{ mt: 2 }}
                    variant="contained"
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                  >
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
          />
        </Box>
      </Box>

      {/* Cart Section */}
      <Box sx={{ flex: 1, minWidth: 500 }}>
        <Paper
          sx={{
            padding: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "auto",
          }}
        >
          <Typography variant="h6">Cart Summary</Typography>
          {cart.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    overflow: "hidden",
                    borderRadius: "4px",
                  }}
                >
                  <img
                    src={BASE_URL + item.image}
                    alt={item.name}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Box>
                <Typography sx={{ ml: 2 }}>{item.name}</Typography>
              </Box>
              <Box>
                <Typography variant="body2">{item.description}</Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
                  <Button
                    size="small"
                    color="info"
                    variant="contained"
                    onClick={() =>
                      updateQuantity(item.product_id, Math.max(item.quantity - 1, 1))
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <Typography variant="body2">{item.quantity}</Typography>
                  <Button
                    size="small"
                    color="info"
                    variant="contained"
                    onClick={() =>
                      updateQuantity(
                        item.product_id,
                        Math.min(item.quantity + 1, item.stock)
                      )
                    }
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeFromCart(item.product_id)}
                  >
                    Remove
                  </Button>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Subtotal: $ {parseFloat(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
              <Divider sx={{ color: "GrayText" }} />
            </Box>
          ))}

          <Typography variant="body1">
            Total Products: {cart.reduce((total, item) => total + item.quantity, 0)}
          </Typography>
          <Typography variant="body1">
            Total Amount: $ {calculateCartTotal().toFixed(2)}
          </Typography>
          <RadioGroup
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            sx={{ mt: 2 }}
          >
            <FormControlLabel value="cash" control={<Radio />} label="Cash" />
            {/* <FormControlLabel value="cheque" control={<Radio />} label="Cheque" /> */}
          </RadioGroup>
          <Button
            variant="contained"onClick={handlePayment}
            color="primary"
            sx={{ mt: 2 }}
          >
            Payment
          </Button>
        </Paper>
        <Dialog open={isDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Payment</DialogTitle>
          <DialogContent>
            {paymentMode === "cash" && (
              <>
                <TextField
                  label="Cash Amount"
                  type="number"
                  fullWidth
                  value={cashAmount}
                  onChange={(e) => setCashAmount(parseFloat(e.target.value))}
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Balance"
                  type="number"
                  fullWidth
                  value={cashAmount > 0 ? (cashAmount - calculateCartTotal()).toFixed(2) : 0}
                  InputProps={{ readOnly: true }}
                  sx={{ mt: 2 }}
                />
              </>
            )}
            {paymentMode === "cheque" && (
              <TextField
                label="Cheque Amount"
                type="number"
                fullWidth
                value={calculateCartTotal()}
                InputProps={{ readOnly: true }}
                sx={{ mt: 2 }}
              />
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleProceed} variant="contained" color="primary">
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CustomerProductsPage;