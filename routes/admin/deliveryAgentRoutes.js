const express = require('express');
const router = express.Router();
const deliveryAgentController = require('../../controllers/deliveryAgentController');
const { authenticate } = require('../../middleware/authMiddleware');

router.post('/create', authenticate, deliveryAgentController.createAgent);
router.get('/list', authenticate, deliveryAgentController.getAgents);
router.put('/update/:id', authenticate, deliveryAgentController.updateAgent);
router.delete('/delete/:id', authenticate, deliveryAgentController.deleteAgent);
router.post('/assign-order', authenticate, deliveryAgentController.assignAgentToOrder);

module.exports = router;
