const Device = require('../models/device');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');

// GET Homepage
exports.index = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort('name').exec();
  const newArrivals = await Device.find({ newArrival: true })
    .populate('category')
    .select({
      name: 1,
      price: 1,
      mewPrice: 1,
      fileName: 1,
      url: 1,
    })
    .limit(8);
  console.log(newArrivals);
  res.render('index', { categories: categories, newArrivals: newArrivals });
});
