const moment = require('moment')
const Customer = require('../models/customerModel');
const Product = require('../models/productModel')
const CartModel = require('../models/cartModel')
const CustomerOrders = require('../models/customerOrders')


const addCustomer = async (req, res) => {
    try {
      const { email, first_name,last_name } = req.body;
      let sameNameExits = await Customer.sameEmailExists(email)
      if(sameNameExits){
       return   res.status(400).json({ message:'Same Email Exist Please use another' });
      }
      const image = req.file ? `build/customer/${req.file.filename}` : null;
      const timestamps = moment().unix();
      const data={
        first_name,
        email,
        last_name:last_name||'',
        profile_pic:image||null ,    
        timestamps
      }
      const product = await Customer.addCustomer(data);
      res.status(200).json({ message: 'Customer created successfully', product });
    } catch (error) {
      res.status(500).json({ message: 'Error creating Customer', error });
    }
  };
  const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { email, first_name, last_name } = req.body;
    const image = req.file ? `build/customer/${req.file.filename}` : null;
  
    try {
      const customer = await Customer.getCustomerById(id);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      const updatedData = {};
      if (first_name) updatedData.first_name = first_name;
      if (last_name) updatedData.last_name = last_name;
      if (email) updatedData.email = email;
      if (image) updatedData.profile_pic = image;

      const updatedCustomer = await Customer.editCustomer(updatedData, id);
  
      if (updatedCustomer) {
        return res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
      } else {
        return res.status(401).json({ message: 'Error updating customer' });
      }
    } catch (error) {
      console.error(' Error in updating customer:', error);
      return res.status(500).json({ message: ' bbb Error updating customer', error });
    }
  };
  
  
  const getCustomers = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const customers = await Customer.getAllCustomers(page, limit, search);
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching customers', error });
    }
  };
  
  const getCustomerById=async(req,res)=>{
    try {
      const {id} = req.params
      let data = await Customer.getCustomerById(id)
      if(data){
        res.status(200).json({data})
      }else{
        res.status(500).json({message:'Error in getting data'})
      }
    } catch (error) {
      console.log(error,'Error in getting data')
    }
  }

  
  const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
      const customer = await Customer.getCustomerById(id)
      if (!customer) {
        return res.status(404).json({ message: 'customer not found' });
      }
      let deleteCustomer = await Customer.deletecustomer(id)
      if(deleteCustomer){
          res.status(200).json({ message: 'Customer deleted successfully' });
      }else{
          res.status(400).json({ message: 'Error deleting customer', error });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting customer', error });
    }
  };

  const getProductsForCustomers=async(req,res)=>{
    try {
      const {id} = req.params
      let customer = await Customer.getCustomerById(id)
      let products = await Product.getAllProductsForCustomersIncludeZeroQuantity()
      let cartItems = await CartModel.getCartProductByCustomer(id)
      if(customer){
        res.status(200).json({
          customer,
          products,
          cartItems,
        })
      }else{
        res.status(404).json({message:'No data found'})
      }
    } catch (error) {
      console.log(error,'error in getting customer products')
      res.status(500).json({message:'No data found'})
    }
  }

  const addCustomerOrder=async(req,res)=>{
    try {
      const { customer_id,cartItems,customer_name,paymentMode,totalAmount,balance} = req.body
      const timestamp = moment().unix();
      const data={
        customer_id,
        customer_name,
        total:parseFloat(totalAmount).toFixed(2)||0.00,
        balance:parseFloat(balance).toFixed(2)||0,
        paymentMode,
        timestamp,
      }
     const order_id = await CustomerOrders.addCustomerOrder(data)
      if(order_id){
      if(cartItems.length>0){
        for(let eachItem of cartItems){
          let itemData={
            order_id:order_id,
            status:2
          }
          await CartModel.updateToCart(itemData,eachItem.id)
        }
      }
      res.status(200).json({
        message:'Order Added Sucessfully '
      })
    }else{
      res.status(401).json({
        message:'Add to failed Order Sucessfully '
      })
    }
    } catch (error) {
      console.log(error,'error in adding customer orders')
      res.status(401).json({
        message:'Add to failed Order Sucessfully '
      })
    }
  }
  const getCustomerOrders=async(req,res)=>{
    try {
      const {customer_id} = req.params
      const customerOrders = await CustomerOrders.getOrdersByCustomerId(customer_id)
      if(customerOrders){
        res.status(200).json({
          customerOrders
        })
      }else{
        res.status(404).json({
          message:'No record found'
        })
      }
    } catch (error) {
      console.log(error,'Error in getting customer orders')
      res.status(404).json({
        message:'No record found'
      })
    }
  }
  const getCustomerOrderProducts=async(req,res)=>{
    try {
      const {order_id} = req.params
      let customerProducts = await CartModel.getCompletedOrderProducts(order_id)
      if(customerProducts){
        res.status(200).json({
          customerProducts,
        })
      }else{
        res.status(404).json({
          message:'No data found',
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
module.exports={
 addCustomer,
 deleteCustomer,
 getCustomerById,
 getCustomers,
 updateCustomer,
 getProductsForCustomers,
 addCustomerOrder,
 getCustomerOrders,
 getCustomerOrderProducts,
}