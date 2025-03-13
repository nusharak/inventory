
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconnection');

const CustomerOrder = sequelize.define('CustomerOrder', {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customer_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT(14, 7),
    allowNull: false,
  },
  balance: {
    type: DataTypes.FLOAT(14, 7),
    allowNull: false,
  },
  paymentMode: {
    type: DataTypes.CHAR,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'customer_orders', 
  timestamps: false,
});


    const addCustomerOrder=async(data)=>{try {
        let result  =await CustomerOrder.create(data)
        if(result){
            return result.dataValues.order_id
        }else{
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

const updateCustomerOrder=async(data,id)=>{
    try {
        const result = await CustomerOrder.update(data,{
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
const getOrdersByCustomerId=async(customer_id)=>{
  try {
  let result = await sequelize.query(`select * from customer_orders
     where customer_id = ${customer_id} order by order_id desc`)
    if(result[0].length>0){
      return result[0]
    }else{
      return []
    }
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  addCustomerOrder,
  updateCustomerOrder,
  getOrdersByCustomerId,
};
