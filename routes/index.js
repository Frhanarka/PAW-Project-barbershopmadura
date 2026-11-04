const express = require('express');
const pageRoutes = require('./pageRoutes');
const apiRoutes = require('./apiRoutes');

const router = express.Router();

router.use('/api', apiRoutes);
router.use('/', pageRoutes);

module.exports = router;
