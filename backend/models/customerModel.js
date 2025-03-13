const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconnection'); 

const Customer = sequelize.define('customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profile_pic: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  timestamps:{
    type:DataTypes.INTEGER,
    allowNull:false,
    defaultValue:null
}
},{tableName:'customer',timestamps:false,indexes:[{
    unique: true,
    fields: ['first_name','email']
  }]});


  const addCustomer=async(data)=>{
    try {
        let results = await Customer.create(data)

        if(results){
            return results.dataValues.id
        }else{
            return false
        }
    } catch (error) {
        console.log(error,'Error in adding customer')
        return false
    }
  }

  const editCustomer = async (data, id) => {
    try {
  
      const result = await Customer.update(data,{
        where:{
          id:id
        },returning:true
      })
     return true
    } catch (error) {
      console.error(error, ' Error in updating the customer');
      return null;
    }
  };
  
  const sameEmailExists = async (email) => {
    try {
      const result = await sequelize.query(
        `SELECT 1 FROM customer WHERE email = :email LIMIT 1`, 
        {
          replacements: { email },
          type: sequelize.QueryTypes.SELECT
        }
      );

      return result.length > 0; 
    } catch (error) {
      console.error('Error checking product existence:', error);
      return false; 
    }
  };
  
 const getCustomerById=async(id)=>{
    try {
     let result = await sequelize.query(`select * from customer where id = ${id}`)
     if(result[0].length ===1){
        return result[0][0]
     }else{
        return {}
     }
    } catch (error) {
        console.log(error,'error in getting Customer id')
    }
 }
 const getAllCustomers = async (page, limit, search) => {
    try {
      const offset = (page - 1) * limit;

      let whereClause = '';
      if (search) {
        whereClause = `WHERE c.first_name LIKE :search OR c.last_name LIKE :search OR c.email LIKE :search`;
      }
  
      const query = ` 
        SELECT CONCAT(c.first_name, ' ', c.last_name) AS name, c.profile_pic, c.email, c.id
        FROM customer AS c
        ${whereClause} order by c.id desc
        LIMIT :limit OFFSET :offset 
      `;

      const countQuery = `
        SELECT COUNT(*) AS total
        FROM customer AS c
        ${whereClause}
      `;

      const [customer, countResult] = await Promise.all([
        sequelize.query(query, {
          replacements: { 
            search: `%${search}%`, 
            limit: parseInt(limit), 
            offset: parseInt(offset)
          }
        }),
        sequelize.query(countQuery, {
          replacements: { search: `%${search}%` }
        })
      ]);

      const totalCount = countResult[0][0].total;
      return { customer:customer[0], total: totalCount };
  
    } catch (error) {
      console.error('Error in getting customer:', error);
      throw error;
    }
  };
  

  const deletecustomer = async (id) => {
    try {
      const result = await Customer.destroy({
        where: { id: id }
      });

      if (result > 0) {
        console.log(`customer with ID ${id} deleted successfully.`);
        return true;
      } else {
        console.log(`No customer found with ID ${id}.`);
        return false;
      }
    } catch (error) {
      console.log(error, 'error in deleting the customer');
      return false;
    }
  };

  
module.exports={
addCustomer,
editCustomer,
deletecustomer,
getAllCustomers,
getCustomerById,
sameEmailExists,
}