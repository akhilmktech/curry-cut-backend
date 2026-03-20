const express = require('express');
const router = express.Router();
const deliveryAgentController = require('../../controllers/deliveryAgentController');
const { authenticate } = require('../../middleware/authMiddleware');

router.post('/login', deliveryAgentController.loginAgent);
router.post('/forgot-password', deliveryAgentController.forgotPassword);
router.post('/verify-otp', deliveryAgentController.verifyOTP);
router.post('/reset-password', deliveryAgentController.resetPassword);

// Authenticated Agent Routes
router.get('/dashboard-stats', authenticate, deliveryAgentController.getDeliveryStats);
router.get('/assigned-orders', authenticate, deliveryAgentController.getAssignedOrders);
router.get('/order-detail/:id', authenticate, deliveryAgentController.getOrderDetail);
router.put('/update-delivery-status/:id', authenticate, deliveryAgentController.updateDeliveryStatus);

module.exports = router;
