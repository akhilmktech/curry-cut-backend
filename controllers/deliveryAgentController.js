const DeliveryAgent = require('../models/DeliveryAgent');
const Order = require('../models/Order');
const catchAsync = require('../utils/catchAsync');
const { NotFoundError, InternalServerError } = require('../utils/customErrors');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');

// --- Admin Controllers ---

// Create Delivery Agent
exports.createAgent = catchAsync(async (req, res, next) => {
    try {
        const { name, email, mobile, password, status } = req.body;
        const agent = await DeliveryAgent.create({
            name,
            email,
            mobile,
            password,
            status: status?.toLowerCase() || 'active'
        });

        res.status(201).json({
            status: 'success',
            message: 'Agent created successfully',
            data: agent
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already exists',
                errors: { email: ['Email already exists'] }
            });
        }
        res.status(400).json({
            status: 'error',
            message: err.message,
            errors: err.errors
        });
    }
});

// Get All Agents
exports.getAgents = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const agents = await DeliveryAgent.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await DeliveryAgent.countDocuments();

    res.status(200).json({
        status: 'success',
        total,
        data: agents
    });
});

// Update Agent
exports.updateAgent = catchAsync(async (req, res, next) => {
    try {
        if (req.body.status) req.body.status = req.body.status.toLowerCase();
        
        const agent = await DeliveryAgent.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!agent) throw new NotFoundError('Agent not found');

        res.status(200).json({
            status: 'success',
            message: 'Agent updated successfully',
            data: agent
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already exists',
                errors: { email: ['Email already exists'] }
            });
        }
        res.status(400).json({
            status: 'error',
            message: err.message,
            errors: err.errors
        });
    }
});

// Delete Agent
exports.deleteAgent = catchAsync(async (req, res, next) => {
    const agent = await DeliveryAgent.findByIdAndDelete(req.params.id);
    if (!agent) throw new NotFoundError('Agent not found');
    res.status(200).json({ status: 'success', message: 'Agent deleted successfully' });
});

// Assign Agent to Order
exports.assignAgentToOrder = catchAsync(async (req, res, next) => {
    const { order_id, agent_id } = req.body;
    const order = await Order.findOne({ order_id });
    if (!order) throw new NotFoundError('Order not found');

    const agent = await DeliveryAgent.findById(agent_id);
    if (!agent) throw new NotFoundError('Agent not found');

    order.assigned_agent = agent_id;
    order.assignment_date = new Date();
    order.delivery_status = 'Pending';
    await order.save();

    res.status(200).json({ status: 'success', message: 'Agent assigned to order successfully', data: order });
});

// --- Agent App Controllers ---

// Agent Login
exports.loginAgent = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const agent = await DeliveryAgent.findOne({ email });
    if (!agent || !(await agent.comparePassword(password))) {
        return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }

    if (agent.status === 'inactive') {
        return res.status(403).json({ status: 'error', message: 'Your account is inactive. Please contact admin.' });
    }

    const accessToken = generateAccessToken(agent);
    const refreshToken = generateRefreshToken(agent);

    agent.refresh_token = refreshToken;
    await agent.save();

    res.status(200).json({
        status: 'success',
        message: 'Login successful',
        accessToken,
        refreshToken,
        data: agent
    });
});

// Forgot Password - Set OTP 55555
exports.forgotPassword = catchAsync(async (req, res, next) => {
    const { mobile } = req.body;
    const agent = await DeliveryAgent.findOne({ mobile });
    if (!agent) throw new NotFoundError('Agent with this mobile number not found');

    agent.otp = 55555; // Default as requested
    agent.otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await agent.save();

    res.status(200).json({ status: 'success', message: 'OTP sent successfully (Default: 55555)' });
});

// Verify OTP
exports.verifyOTP = catchAsync(async (req, res, next) => {
    const { mobile, otp } = req.body;
    const agent = await DeliveryAgent.findOne({ mobile, otp, otp_expiry: { $gt: Date.now() } });

    if (!agent) {
        return res.status(400).json({ status: 'error', message: 'Invalid or expired OTP' });
    }

    agent.is_verified = true;
    await agent.save();

    res.status(200).json({ status: 'success', message: 'OTP verified successfully' });
});

// Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
    const { mobile, password } = req.body;
    const agent = await DeliveryAgent.findOne({ mobile, is_verified: true });

    if (!agent) {
        return res.status(400).json({ status: 'error', message: 'Please verify your mobile number first' });
    }

    agent.password = password;
    agent.is_verified = false;
    agent.otp = null;
    agent.otp_expiry = null;
    await agent.save();

    res.status(200).json({ status: 'success', message: 'Password reset successfully' });
});

// Get Dashboard Stats
exports.getDeliveryStats = catchAsync(async (req, res, next) => {
    const agentId = req.user.id;

    const pendingCount = await Order.countDocuments({ assigned_agent: agentId, delivery_status: { $in: ['Pending', 'Picked Up'] } });
    const completedCount = await Order.countDocuments({ assigned_agent: agentId, delivery_status: 'Delivered' });
    const recentOrders = await Order.find({ assigned_agent: agentId })
        .sort({ assignment_date: -1 })
        .limit(5);

    res.status(200).json({
        status: 'success',
        data: {
            pendingCount,
            completedCount,
            recentOrders
        }
    });
});

// Get All Assigned Orders
exports.getAssignedOrders = catchAsync(async (req, res, next) => {
    const agentId = req.user.id;
    const { status } = req.query;

    let query = { assigned_agent: agentId };
    if (status) query.delivery_status = status;

    const orders = await Order.find(query).sort({ assignment_date: 1 }); // FIFO requested

    res.status(200).json({ status: 'success', data: orders });
});

// Get Order Detail
exports.getOrderDetail = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id).lean();
    if (!order) throw new NotFoundError('Order not found');

    if (order.assigned_agent?.toString() !== req.user.id) {
        return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    res.status(200).json({ status: 'success', data: order });
});

// Update Delivery Status
exports.updateDeliveryStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body; // 'Picked Up' or 'Delivered'
    const order = await Order.findById(req.params.id);

    if (!order) throw new NotFoundError('Order not found');
    if (order.assigned_agent?.toString() !== req.user.id) {
        return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    order.delivery_status = status;
    if (status === 'Picked Up') order.picked_up_at = new Date();
    if (status === 'Delivered') order.delivered_at = new Date();

    await order.save();

    res.status(200).json({ status: 'success', message: `Order status updated to ${status}`, data: order });
});
