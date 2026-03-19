const DeliveryAgent = require('../models/DeliveryAgent');
const Order = require('../models/Order');
const OrderTimeline = require('../models/OrderTimeline');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mobile App Agent Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const agent = await DeliveryAgent.findOne({ email });
    if (!agent) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (agent.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }

    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = {
      agent: {
        id: agent.id,
        role: 'delivery_agent'
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret123', // Fallback for dev if env missing
      { expiresIn: '30d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          agent: {
            id: agent.id,
            name: agent.name,
            email: agent.email,
            vehicle_type: agent.vehicle_type
          }
        });
      }
    );
  } catch (err) {
    console.error('Agent Login Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Assigned Orders for logged-in Agent
exports.getAssignedOrders = async (req, res) => {
  try {
    const agentId = req.agent.id;
    const { status } = req.query; // optional filter by status

    let filter = { delivery_agent_id: agentId };
    if (status) {
      filter.delivery_status = status;
    }

    const orders = await Order.find(filter)
      .sort({ created_at: -1 })
      .select('order_id order_number subtotal_price delivery_charge delivery_status shipping_address customer');

    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    console.error('Get Assigned Orders Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single order details
exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const agentId = req.agent.id;

    // Check if order belongs to this agent
    const order = await Order.findById(id).populate('delivery_agent_id', 'name phone');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.delivery_agent_id && order.delivery_agent_id._id.toString() !== agentId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this order' });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error('Get Order Details Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update order delivery status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const agentId = req.agent.id;

    const validStatuses = ['assigned', 'out_for_delivery', 'delivered', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid delivery status' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.delivery_agent_id.toString() !== agentId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this order' });
    }

    order.delivery_status = status;
    order.delivery_notes = remarks || order.delivery_notes;
    
    if (status === 'delivered') {
      order.delivered_at = new Date();
    }

    await order.save();

    await OrderTimeline.create({
      order_id: order.order_id,
      action: `delivery_${status}`,
      message: `Delivery status updated to ${status} by agent. Remarks: ${remarks || 'None'}`
    });

    res.json({ success: true, message: 'Order status updated successfully', status: order.delivery_status });
  } catch (err) {
    console.error('Update Order Status Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Live Location
exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const agentId = req.agent.id;

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    await DeliveryAgent.findByIdAndUpdate(agentId, {
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      updated_at: new Date()
    });

    res.json({ success: true, message: 'Location updated successfully' });
  } catch (err) {
    console.error('Update Location Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
