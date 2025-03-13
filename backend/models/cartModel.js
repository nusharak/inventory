const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconnection');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:null
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timestamps: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    comment:'1-pending 2 - completed'
  },
}, {
  tableName: 'cart',
  timestamps: false,
});
const addToCart=async(data)=>{
  try {
      let result  =await Cart.create(data)
      if(result){
          return result.dataValues.id
      }else{
          return false
      }
  } catch (error) {
      console.log(error)
      return false
  }
}

const updateToCart=async(data,id)=>{
  try {
      const result = await Cart.update(data,{
          where:{
              id:id
          },returning:true
      })
      return true
  } catch (error) {
      console.log(error)
      return false
  }
}
const deleteFromCart=async(id)=>{
  try {
    const result = await Cart.destroy({
      where: { id: id }
    });

    if (result > 0) {
      console.log(`cart with ID ${id} deleted successfully.`);
      return true;
    } else {
      console.log(`No cart found with ID ${id}.`);
      return false;
    }
  } catch (error) {
    console.log(error,'error in deleting the cart product')
  }
}

const getCartProductById=async(id)=>{
  try {
    let result = await sequelize.query(`
      select * from cart where id = ${id}`)
      if(result[0].length === 1){
        return result[0][0]
      }else{
        return {}
      }
  } catch (error) {
    console.log(error)
  }
}
const getCartProductByCustomer=async(customer_id)=>{
  try {
    let result = await sequelize.query(`
      select ct.id ,ct.customer_id,ct.product_id,ct.quantity from cart as ct where 
      ct.customer_id = ${customer_id} and ct.status = 1`)
      if(result[0].length >0 ){
        return result[0]
      }else{
        return []
      }
  } catch (error) {
    console.log(error)
  }
}
const getCompletedOrderProducts = async (order_id) => {
  try {
    const result = await sequelize.query(`
      SELECT 
        co.order_id, 
        co.customer_id, 
        co.customer_name, 
        co.total, 
        co.balance, 
        co.paymentMode, 
        co.timestamp, 
        c.id,
        c.product_id, 
        c.quantity, 
        c.product_name
      FROM customer_orders AS co
      LEFT JOIN cart c ON c.order_id = co.order_id
      WHERE co.order_id = :order_id AND c.status = 2
    `, {
      replacements: { order_id },
      type: sequelize.QueryTypes.SELECT,
    });

    if (result && result.length > 0) {
      const customerOrder = {
        order_id: result[0].order_id,
        customer_id: result[0].customer_id,
        customer_name: result[0].customer_name,
        total: result[0].total,
        balance: result[0].balance,
        paymentMode: result[0].paymentMode,
        timestamp: result[0].timestamp,
        id: result[0].id,
        status: result[0].status,
        timestamps: result[0].timestamps,
      };

      const cartItems = result.map(row => ({
        id:row.id,
        product_id: row.product_id,
        quantity: row.quantity,
        product_name: row.product_name,
      }));

      return {
        customerProducts: {
          customer_order: customerOrder,
          cart_items: cartItems,
        },
      };
    } else {
      return {}; 
    }
  } catch (error) {
    console.error('Error retrieving completed order products:', error);
    throw error; 
  }
};

module.exports = {
  addToCart,
  updateToCart,
  deleteFromCart,
  getCartProductById,
  getCartProductByCustomer,
  getCompletedOrderProducts,
};
