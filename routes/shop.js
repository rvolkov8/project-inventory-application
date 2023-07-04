const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// GET home page
router.get('/', deviceController.index);

//GET a particular category list
router.get('/:category', deviceController.getCategoryList);

//GET a particular item
router.get('/:category/:id', deviceController.getItem);

module.exports = router;
