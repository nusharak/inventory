const Dashboard= require("../models/dashboardModel")

const dashboard = async (req, res) => {
  try {
   const dashboard=await Dashboard.dashboard()
    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};
module.exports={dashboard}