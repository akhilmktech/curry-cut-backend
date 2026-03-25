const express = require('express');
const router = express.Router();
const deliveryAgentController = require('../../controllers/deliveryAgentController');
const { authenticate } = require('../../middleware/authMiddleware');
const { uploadAgentAvatar } = require('../../middleware/uploadMiddleware');

router.post('/create', authenticate, uploadAgentAvatar.single('avatar'), deliveryAgentController.createAgent);
router.get('/list', authenticate, deliveryAgentController.getAgents);
router.put('/update/:id', authenticate, uploadAgentAvatar.single('avatar'), deliveryAgentController.updateAgent);
router.put('/update-password/:id', authenticate, deliveryAgentController.updateAgentPassword);
router.delete('/delete/:id', authenticate, deliveryAgentController.deleteAgent);
router.post('/assign-order', authenticate, deliveryAgentController.assignAgentToOrder);
router.get('/details/:id', authenticate, deliveryAgentController.getAgentDetails);

module.exports = router;
