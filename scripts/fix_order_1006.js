const mongoose = require('mongoose');
const Order = require('../models/Order');

const fixOrder = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/curry_cut_test');
        console.log('Connected to MongoDB');

        // Target order #1006
        const order = await Order.findOne({ name: '#1006' });
        
        if (order) {
            console.log(`Order #1006 current status: fulfillment_status=[${order.fulfillment_status}], delivery_status=[${order.delivery_status}]`);
            
            if (order.delivery_status === 'Delivered') {
                console.log('Detect inconsistency: Resetting delivery_status to Pending to match UI.');
                order.delivery_status = 'Pending';
                order.delivered_at = null; // Clear timestamps if it's not actually delivered
                await order.save();
                console.log('Order #1006 fixed successfully.');
            } else {
                console.log('Order #1006 already has consistent status or is not "Delivered" internally.');
            }
        } else {
            console.log('Order #1006 not found in the database.');
        }

    } catch (err) {
        console.error('Error fixing order:', err);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
};

fixOrder();
