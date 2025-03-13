const sequelize = require('../config/dbconnection')
const {DataTypes} = require('sequelize')

const Product = sequelize.define('product', {
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:null
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:null
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timestamps:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:null
    }
  },{tableName:'product',timestamps:false,indexes:[{
    unique: true,
    fields: ['name']
  }]});

  const addProduct=async(data)=>{
    try {
        let results = await Product.create(data)

        if(results){
            return results.dataValues.id
        }else{
            return false
        }
    } catch (error) {
        console.log(error,'Error in adding products')
        return false
    }
  }

  const editProduct=async(data,id)=>{
    try {
        let results = await Product.update(data,{
            where:{
                id:id
            },returning:true
        })
        if(results){
            return true
        }else{
            return false
        }
    } catch (error) {
        console.log(error,'Error in updating the product')
        return false
    }
  }
  const sameProductExists = async (name) => {
    try {
      const result = await sequelize.query(
        `SELECT 1 FROM product WHERE name = :name LIMIT 1`, 
        {
          replacements: { name },
          type: sequelize.QueryTypes.SELECT
        }
      );

      return result.length > 0; 
    } catch (error) {
      console.error('Error checking product existence:', error);
      return false; 
    }
  };
  
 const getProductById=async(id)=>{
    try {
     let result = await sequelize.query(`select * from product where id = ${id}`)
     if(result[0].length ===1){
        return result[0][0]
     }else{
        return {}
     }
    } catch (error) {
        console.log(error,'error in getting product id')
    }
 }
 const getAllProducts = async (page, limit, search) => {
    try {
      const offset = (page - 1) * limit;

      let whereClause = '';
      if (search) {
        whereClause = `WHERE p.name LIKE :search`;
      }
  
      const query = `
        SELECT p.name, p.image, p.stock, p.price, p.id
        FROM product AS p
        ${whereClause} order by p.id desc
        LIMIT :limit OFFSET :offset 
      `;

      const countQuery = `
        SELECT COUNT(*) AS total
        FROM product AS p
        ${whereClause}
      `;

      const [products, countResult] = await Promise.all([
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
      return { products: products[0], total: totalCount };
  
    } catch (error) {
      console.error('Error in getting products:', error);
      throw error;
    }
  };
  

  const deleteProducts = async (id) => {
    try {
      const result = await Product.destroy({
        where: { id: id }
      });

      if (result > 0) {
        console.log(`Product with ID ${id} deleted successfully.`);
        return true;
      } else {
        console.log(`No product found with ID ${id}.`);
        return false;
      }
    } catch (error) {
      console.log(error, 'error in deleting the product');
      return false;
    }
  };

  const getAllProductForCustomers=async()=>{
    try {
      let result  =await sequelize.query(`
        select p.* from product as p  where `)

        if(result[0].length > 0){
          return result[0]
        }else{
          return []
        }
    } catch (error) {p.stock > 0
      console.log(error,'Error in getting products')
    }
  }
  const getAllProductsForCustomersIncludeZeroQuantity=async()=>{
    try {
      let result  =await sequelize.query(`
        select p.* from product p `)

        if(result[0].length > 0){
          return result[0]
        }else{
          return []
        }
    } catch (error) {p.stock > 0
      console.log(error,'Error in getting products')
    }
  }
module.exports={
    addProduct,
    editProduct,
    getAllProducts,
    deleteProducts,
    getProductById,
    sameProductExists,
    getAllProductForCustomers,
    getAllProductsForCustomersIncludeZeroQuantity
}
  