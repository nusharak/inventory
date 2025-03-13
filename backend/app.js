const path = require('path');
const express = require('express');
const sequelize = require('./config/dbconnection'); 
const cors = require('cors');
const dotenv = require('dotenv');

const productRoutes = require('./routes/productRoute');
const customerRoutes = require('./routes/customerRoute');
const cartRoutes = require('./routes/cartRoute');
const dashboard=require("./routes/dashboard")

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/build/products', express.static(path.join(__dirname, 'build', 'products')));
app.use('/build/customer', express.static(path.join(__dirname, 'build', 'customer')));



app.use('/api', productRoutes);
app.use('/api', customerRoutes);
app.use('/api', cartRoutes);
app.use('/api', dashboard);
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.log('Error syncing database:', error);
  }
});
