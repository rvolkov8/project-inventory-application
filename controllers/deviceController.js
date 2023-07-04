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
      category: 1,
      price: 1,
      mewPrice: 1,
      fileName: 1,
      url: 1,
    })
    .limit(8)
    .exec();
  console.log(newArrivals);
  res.render('index', { categories: categories, newArrivals: newArrivals });
});

// GET a particular category list
exports.getCategoryList = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort('name').exec();

  const category = req.params.category;
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  const categoryItems = await Device.find({
    category: await Category.find({ name: categoryName }).exec(),
  })
    .populate('category')
    .select({
      name: 1,
      category: 1,
      price: 1,
      newPrice: 1,
      fileName: 1,
      url: 1,
    })
    .exec();
  res.render('category', {
    categories: categories,
    categoryName: categoryName,
    categoryItems: categoryItems,
  });
});
