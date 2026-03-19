const DeliveryAgent = require('../models/DeliveryAgent');
const bcrypt = require('bcryptjs'); // Assuming bcryptjs is used elsewhere in the backend for hashing

// Create new delivery agent
const createDeliveryAgent = async (req, res) => {
  try {
    const { name, email, phone, password, status, vehicle_type, vehicle_number } = req.body;
    
    // Check if agent already exists
    const existingAgent = await DeliveryAgent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ success: false, message: 'Delivery agent with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAgent = new DeliveryAgent({
      name,
      email,
      phone,
      password: hashedPassword,
      status: status || 'active',
      vehicle_type: vehicle_type || 'bike',
      vehicle_number
    });

    await newAgent.save();

    res.status(201).json({ success: true, message: 'Delivery agent created successfully', agent: newAgent });
  } catch (error) {
    console.error('Error creating delivery agent:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all delivery agents with pagination and search
const getDeliveryAgents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const skip = page * limit;
    const { search, status } = req.query;

    let sort = { created_at: -1 };
    
    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
         { name: regex },
         { email: regex },
         { phone: regex },
         { vehicle_number: regex }
      ];
    }

    const agents = await DeliveryAgent.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-password')
      .lean();

    const total = await DeliveryAgent.countDocuments(filter);

    res.status(200).json({ 
      success: true, 
      status: 'success',
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      agents 
    });
  } catch (error) {
    console.error('Error fetching delivery agents:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single delivery agent by ID
const getDeliveryAgentById = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await DeliveryAgent.findById(id).select('-password');
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Delivery agent not found' });
    }
    res.status(200).json({ success: true, agent });
  } catch (error) {
    console.error('Error fetching delivery agent:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update delivery agent
const updateDeliveryAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, status, vehicle_type, vehicle_number, password } = req.body;

    const agent = await DeliveryAgent.findById(id);
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Delivery agent not found' });
    }

    agent.name = name || agent.name;
    agent.phone = phone || agent.phone;
    agent.status = status || agent.status;
    agent.vehicle_type = vehicle_type || agent.vehicle_type;
    agent.vehicle_number = vehicle_number !== undefined ? vehicle_number : agent.vehicle_number;
    agent.updated_at = Date.now();

    if (password) {
      const salt = await bcrypt.genSalt(10);
      agent.password = await bcrypt.hash(password, salt);
    }

    await agent.save();

    res.status(200).json({ success: true, message: 'Delivery agent updated successfully', agent });
  } catch (error) {
    console.error('Error updating delivery agent:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete delivery agent
const deleteDeliveryAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await DeliveryAgent.findByIdAndDelete(id);

    if (!agent) {
      return res.status(404).json({ success: false, message: 'Delivery agent not found' });
    }

    res.status(200).json({ success: true, message: 'Delivery agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting delivery agent:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createDeliveryAgent,
  getDeliveryAgents,
  getDeliveryAgentById,
  updateDeliveryAgent,
  deleteDeliveryAgent
};
