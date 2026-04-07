const express = require('express');
const { getOrders, createOrder, getOrderByVendor, updateOrder, cancelOrder, getOrderById, markAsPaid, fulfilOrder, fulfillSingleItem, deleteOrder, getOrdersByCustomer, getOrderDetailByCustomer, pickupOrder } = require('../controllers/orderController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/',authenticate,getOrders);
router.post('/',createOrder);
router.get(`/:id`,authenticate,getOrderByVendor);
// customer orders
router.get('/customer/:customerId',getOrdersByCustomer);
router.get('/customer/:customerId/:orderId',getOrderDetailByCustomer);
// full order details
router.get('/all/:id',authenticate,getOrderById);
router.post('/update',authenticate,updateOrder);
router.post('/cancel',authenticate,cancelOrder);
router.post('/fulfilled',authenticate,fulfilOrder);
router.post('/fulfillSingleItem',authenticate,fulfillSingleItem);
router.post('/delete',authenticate,deleteOrder);
router.post('/pickup',authenticate,pickupOrder);


module.exports = router;
