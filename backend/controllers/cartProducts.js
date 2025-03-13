const moment = require('moment');
const Product = require('../models/productModel');
const CartModel = require('../models/cartModel');

const addCartProducts = async (req, res) => {
    try {
        const { customer_id, product_id, product_name, quantity } = req.body;
        const timestamps = moment().unix();

        const product = await Product.getProductById(product_id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: `Insufficient stock. Only ${product.stock} items are available.` });
        }

        product.stock -= quantity;

        await Product.editProduct(product,product_id)

        const data = {
            customer_id,
            product_id,
            product_name,
            quantity,
            timestamps,
            status: 1,
        };

        const result = await CartModel.addToCart(data);

        if (result) {
            res.status(200).json({ message: `${product_name} added to cart successfully` });
        } else {
            product.stock += quantity;
            await Product.editProduct(product,product_id)

            res.status(404).json({ message: 'Error adding product to cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error in add to cart', error });
    }
};

const updateCartQuantity = async (req, res) => {
    try {
        const { cart_id, product_id, new_quantity } = req.body;

        const cartItem = await CartModel.getCartProductById(cart_id)

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        const product = await Product.getProductById(product_id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const currentQuantity = cartItem.quantity;

        if (new_quantity > currentQuantity) {
            const stockRequired = new_quantity - currentQuantity;
            if (product.stock < stockRequired) {
                return res.status(400).json({ message: `Not enough stock available. Only ${product.stock} items in stock.` });
            }
            product.stock -= stockRequired;
        } else if (new_quantity < currentQuantity) {
            const stockToRestore = currentQuantity - new_quantity;
            product.stock += stockToRestore;
        }

        await Product.editProduct(product,product_id)

        cartItem.quantity = new_quantity;
        await CartModel.updateToCart(cartItem,cart_id)

        res.status(200).json({ message: `Cart updated successfully. New quantity: ${new_quantity}` });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart quantity', error });
    }
};

const deleteCartProduct = async (req, res) => {
    try {
        const { cart_id, product_id } = req.body;

        const cartItem = await CartModel.getCartProductById(cart_id);

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        const product = await Product.getProductById(product_id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.stock += cartItem.quantity;

        await Product.editProduct(product,product_id)
        await CartModel.deleteFromCart(cart_id)

        res.status(200).json({ message: 'Product removed from cart and stock updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing product from cart', error });
    }
};
module.exports = {
    addCartProducts,
    updateCartQuantity,
    deleteCartProduct,
};
