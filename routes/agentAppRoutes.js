const express = require('express');
const router = express.Router();
const verifyAgent = require('../middleware/agentAuthMiddleware');
const { 
  login, 
  getAssignedOrders, 
  getOrderDetails, 
  updateOrderStatus, 
  updateLocation 
} = require('../controllers/agentAppController');

// Public route
router.post('/login', login);

// Protected routes for agents
router.get('/orders', verifyAgent, getAssignedOrders);
router.get('/orders/:id', verifyAgent, getOrderDetails);
router.put('/orders/:id/status', verifyAgent, updateOrderStatus);
router.put('/location', verifyAgent, updateLocation);

module.exports = router;
