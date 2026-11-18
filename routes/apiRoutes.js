
const express = require('express');
const apiController = require('../controllers/apiController');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/status', apiController.status);
router.get('/produk', apiController.produk);
router.post('/chat', chatController.kirim);

module.exports = router;
