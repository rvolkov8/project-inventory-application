const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// GET home page
router.get('/', deviceController.index);

//GET a particular category list
router.get('/:category', deviceController.getCategoryList);

module.exports = router;
