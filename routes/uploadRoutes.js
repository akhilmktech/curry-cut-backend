// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { uploadBase64Image } = require('../controllers/uploadController');

router.post('/upload-base64', uploadBase64Image);

module.exports = router;
