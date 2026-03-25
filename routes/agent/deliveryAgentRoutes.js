const express = require('express');
const router = express.Router();
const deliveryAgentController = require('../../controllers/deliveryAgentController');
const { authenticate } = require('../../middleware/authMiddleware');
const { uploadAgentAvatar } = require('../../middleware/uploadMiddleware');

router.post('/login', deliveryAgentController.loginAgent);
router.post('/refresh-token', deliveryAgentController.refreshToken);
router.post('/forgot-password', deliveryAgentController.forgotPassword);
router.post('/verify-otp', deliveryAgentController.verifyOTP);
router.post('/reset-password', deliveryAgentController.resetPassword);

// Authenticated Agent Routes
router.get('/dashboard-stats', authenticate, deliveryAgentController.getDeliveryStats);
router.get('/assigned-orders', authenticate, deliveryAgentController.getAssignedOrders);
router.get('/order-detail/:id', authenticate, deliveryAgentController.getOrderDetail);
router.put('/update-delivery-status/:id', authenticate, deliveryAgentController.updateDeliveryStatus);
router.put('/update-profile', authenticate, uploadAgentAvatar.single('avatar'), deliveryAgentController.updateProfile);
router.put('/change-password', authenticate, deliveryAgentController.changePasswordAgent);
router.get('/profile', authenticate, deliveryAgentController.getProfile);

module.exports = router;
