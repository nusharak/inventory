const moment = require('moment')
const Product = require('../models/productModel');

const createProduct = async (req, res) => {
  try {
    const { name, price, stock,description } = req.body;
    let sameNameExits = await Product.sameProductExists(name)
    if(sameNameExits){
     return   res.status(400).json({ message:'Same Product Exist' });
    }
    const image = req.file ? `build/products/${req.file.filename}` : null;
    const timestamps = moment().unix();
    const data={
        name,
        price:parseFloat(price).toFixed(2),
        description,
        stock,
        image,
        timestamps
    }
    const product = await Product.addProduct(data);
    res.status(200).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const products = await Product.getAllProducts(page, limit, search);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

const getProductById=async(req,res)=>{
  try {
    const {id} = req.params
    let data = await Product.getProductById(id)
    if(data){
      res.status(200).json({data})
    }else{
      res.status(500).json({message:'Error in getting data'})
    }
  } catch (error) {
    console.log(error,'Error in getting data')
  }
}
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock,description } = req.body;
  const image = req.file ? `build/products/${req.file.filename}` : null;
  try {
    const product = await Product.getProductById(id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.name = name || product.name;
    product.price = parseFloat(price).toFixed(2) ||  parseFloat(product.price).toFixed(2);
    product.image = image || product.image;
    product.stock = stock || product.stock;
    product.description = description || product.description;
    let updatedResult = await Product.editProduct(product,id)
    if(updatedResult){
        res.status(200).json({ message: 'Product updated successfully', product });
    }else{
        res.status(401).json({ message: 'Error updating product', error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.getProductById(id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    let deleteProduct = await Product.deleteProducts(id)
    if(deleteProduct){
        res.status(200).json({ message: 'Product deleted successfully' });
    }else{
        res.status(400).json({ message: 'Error deleting product', error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById,
};
