// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar'; // Import Navbar
import ProductsPage from './pages/ProductPages';
import AddProductPage from './components/AddProduct';
import CustomersPage from './pages/CustomerPage';
import AddCustomerPage from './components/AddCustomer';
import CustomerProductsPage from './pages/CustomerProductPage';
import OrdersPage from './pages/OrderPage';
import Dashboard from './pages/DashboardPage';
import HomePage from './pages/HomePage'; // Import HomePage
import SignUpPage from './pages/SignUpPage'; // Import SignUpPage

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Conditionally render the Sidebar based on the route */}
        {window.location.pathname !== '/' && (
          <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        )}

        {/* Main Content */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Navbar */}
          <Navbar handleDrawerToggle={handleDrawerToggle} />

          {/* Main Content Area */}
          <div style={{ marginTop: 64 }}> {/* Add `marginTop` to offset the Navbar */}
            <Routes>
              <Route path="/" element={<HomePage />} /> {/* HomePage as the initial route */}
              <Route path="/sign-up" element={<SignUpPage />} /> {/* Sign-Up Page */}
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/add-product" element={<AddProductPage />} />
              <Route path="/edit-product/:product_id" element={<AddProductPage />} />
              <Route path="/add-customer" element={<AddCustomerPage />} />
              <Route path="/edit-customer/:customer_id" element={<AddCustomerPage />} />
              <Route path="/products/:customer_id" element={<CustomerProductsPage />} />
              <Route path="/orders/:customer_id" element={<OrdersPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
};

export default App;
