const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const validateMiddleware = require('../utils/validate');
const { deliveryAgentSchema, deliveryAgentUpdateSchema } = require('../validations/deliveryAgentValidation');

const { 
  createDeliveryAgent, 
  getDeliveryAgents, 
  getDeliveryAgentById,
  updateDeliveryAgent, 
  deleteDeliveryAgent 
} = require('../controllers/deliveryAgentController');

// All routes here should be protected by authenticate or an admin-specific middleware
// Assuming authenticate checks for general admin access based on existing routes

router.post('/', authenticate, validateMiddleware(deliveryAgentSchema), createDeliveryAgent);
router.get('/', authenticate, getDeliveryAgents);
router.get('/:id', authenticate, getDeliveryAgentById);
router.put('/:id', authenticate, validateMiddleware(deliveryAgentUpdateSchema), updateDeliveryAgent);
router.delete('/:id', authenticate, deleteDeliveryAgent);

module.exports = router;
