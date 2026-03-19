
const express = require('express');
const { getShopifyCategories } = require('../controllers/collectionController');
const { authenticate } = require('../middleware/authMiddleware');
const { createCollectionImage, updateCollectionImage, deleteCollectionImage, getCollectionImages, getCollectionImage } = require('../controllers/collectionImageController');
const router = express.Router();

// POST /api/products
router.get("/", authenticate,getShopifyCategories);
router.get("/collection-images",authenticate,getCollectionImages)
router.post("/collection-images",authenticate,createCollectionImage);
router.get("/collection-images/:id",authenticate,getCollectionImage);
router.put("/collection-images/:id",authenticate,updateCollectionImage);
router.delete("/collection-images/:id",authenticate,deleteCollectionImage);

module.exports = router;
