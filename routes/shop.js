const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// GET home page
router.get('/', deviceController.index);

module.exports = router;
