const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.post('/', itemController.createItem);
router.get('/',itemController.getItems)
router.get('/item/:id',itemController.getItem)
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);
router.get('/home/details',itemController.getHomePageData)

module.exports = router;
