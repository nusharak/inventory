const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../middlewares/productValidation');
const upload = require('../middlewares/uploadProductImage');

// Product Routes
router.post('/add-product', upload.single('image'), validateProduct, productController.createProduct);
router.get('/products', productController.getProducts);
router.get('/product/:id', productController.getProductById);
router.put('/product/:id', upload.single('image'), validateProduct, productController.updateProduct);
router.delete('/product/:id', productController.deleteProduct);

module.exports = router;
