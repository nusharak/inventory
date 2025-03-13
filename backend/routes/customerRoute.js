const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { validateCustomer } = require('../middlewares/customerValidation');
const upload = require('../middlewares/uploadProductImage');

// Customer Routes
router.post('/add-customer', upload.single('image'), validateCustomer, customerController.addCustomer);
router.get('/customers', customerController.getCustomers);
router.get('/customer/:id', customerController.getCustomerById);
router.put('/customer/:id', upload.single('image'), validateCustomer, customerController.updateCustomer);
router.delete('/customer/:id', customerController.deleteCustomer);

// for product view
router.get('/customer-product-view/:id', customerController.getProductsForCustomers);
//for customer order

router.post('/customer/add-order', customerController.addCustomerOrder);
router.get('/customer-orders/:customer_id', customerController.getCustomerOrders);
router.get('/customer-order-products/:order_id', customerController.getCustomerOrderProducts);

module.exports = router;