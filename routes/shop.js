const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/devices');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// GET home page
router.get('/', deviceController.index);

//GET a particular category list
router.get('/:category', deviceController.getCategoryList);

//GET a particular item
router.get('/:category/:id', deviceController.getItem);

//GET update form for a particular item
router.get('/:category/:id/update', deviceController.getUpdateItem);

//POST update a particular item
router.post(
  '/:category/:id/update',
  upload.single('fileName'),
  deviceController.postUpdateItem
);

module.exports = router;
