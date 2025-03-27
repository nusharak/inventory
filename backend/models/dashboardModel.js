const  sequelize  = require('../config/dbconnection'); // Sequelize instance
const { QueryTypes } = require('sequelize');

const dashboard = async () => {
  try {
    // Total Customers
    const queryCustomers = 'SELECT COUNT(*) AS total_customers FROM customer';

    // Total Products
    const queryProducts = 'SELECT COUNT(*) AS total_products FROM product';

    // Total Sales Today, This Week, This Month, This Year
    const querySales = `
      SELECT 
        SUM(total) AS total_sales, 
        DATE(FROM_UNIXTIME(timestamp)) AS sale_date
      FROM customer_orders
      WHERE FROM_UNIXTIME(timestamp) BETWEEN CURDATE() - INTERVAL 1 YEAR AND NOW()
      GROUP BY DATE(FROM_UNIXTIME(timestamp))
    `;

    // Monthly Sales Breakdown
    const queryMonthlySales = `
      SELECT
        MONTHNAME(FROM_UNIXTIME(timestamp)) AS month,
        SUM(total) AS sales
      FROM customer_orders
      WHERE FROM_UNIXTIME(timestamp) BETWEEN CURDATE() - INTERVAL 1 YEAR AND NOW()
      GROUP BY MONTH(FROM_UNIXTIME(timestamp)), YEAR(FROM_UNIXTIME(timestamp))
      ORDER BY YEAR(FROM_UNIXTIME(timestamp)), MONTH(FROM_UNIXTIME(timestamp))
    `;

    // Execute queries for each metric
    const [customersResult] = await sequelize.query(queryCustomers, { type: QueryTypes.SELECT });
    const [productsResult] = await sequelize.query(queryProducts, { type: QueryTypes.SELECT });
    const salesResult = await sequelize.query(querySales, { type: QueryTypes.SELECT });
    const monthlySalesResult = await sequelize.query(queryMonthlySales, { type: QueryTypes.SELECT });

    const totalCustomers = customersResult.total_customers;
    const totalProducts = productsResult.total_products;

    const totalSalesData = salesResult.reduce((acc, row) => {
      const rowDate = new Date(row.sale_date); // Ensure we parse the row sale date correctly
      const today = new Date();
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1); // Jan 1st of this year
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the current month
    
      // Today's sales (only comparing the date part, ignoring the time)
      if (
        rowDate.getFullYear() === today.getFullYear() &&
        rowDate.getMonth() === today.getMonth() &&
        rowDate.getDate() === today.getDate()
      ) {
        acc.salesToday += row.total_sales;
      }
    
      // Sales in the last 7 days (this week)
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
      if (rowDate >= sevenDaysAgo && rowDate <= today) {
        acc.salesThisWeek += row.total_sales;
      }
    
      // Sales this year
      if (rowDate >= firstDayOfYear && rowDate <= today) {
        acc.salesThisYear += row.total_sales;
      }
    
      // Sales this month
      if (rowDate >= firstDayOfMonth && rowDate <= today) {
        acc.salesThisMonth += row.total_sales;
      }
    
      return acc;
    }, {
      salesToday: 0,
      salesThisWeek: 0,
      salesThisMonth: 0,
      salesThisYear: 0,
    });

    console.log(totalSalesData);

    const monthlySales = monthlySalesResult.map((row) => ({
      month: row.month,
      sales: row.sales,
    }));

    return {
      totalCustomers,
      totalProducts,
      salesToday: totalSalesData.salesToday,
      salesThisWeek: totalSalesData.salesThisWeek,
      salesThisMonth: totalSalesData.salesThisMonth,
      salesThisYear: totalSalesData.salesThisYear,
      monthlySales,
    };
  } catch (error) {
    console.log('Error in dashboard function:', error);
    return false;
  }
};

module.exports = { dashboard };
