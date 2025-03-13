const express = require('express');
const router = express.Router();
const cartProducts = require('../controllers/cartProducts')
// cart Routes
router.post('/cart/add-to-cart', cartProducts.addCartProducts);
router.put('/cart/:cart_id', cartProducts.updateCartQuantity);
router.delete('/cart/:cart_id', cartProducts.deleteCartProduct);


module.exports = router;