const express = require('express');
const router = express.Router();

const Dashboard = require('../controllers/dashboard');
// cart Routes
router.post('/dashboard',Dashboard.dashboard);



module.exports = router;