const createError = require('http-errors');
const Device = require('../models/device');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const { default: mongoose } = require('mongoose');
const { validationResult } = require('express-validator');

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
  res.render('index', { categories: categories, newArrivals: newArrivals });
});

// GET a particular category list
exports.getCategoryList = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort('name').exec();

  const category = req.params.category;
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  if (!(await Category.findOne({ name: categoryName }))) {
    return next({ message: 'No such category exists' });
  }

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

// GET a particular item
exports.getItem = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort('name').exec();
  const id = req.params.id;

  try {
    const item = await Device.findOne({ _id: id }).populate('category').exec();
    res.render('item', { categories: categories, item: item });
  } catch (error) {
    return next({ message: 'No item with such an ID was found' });
  }
});

// GET update form for a particular item
exports.getUpdateItem = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort('name').exec();
  const id = req.params.id;

  try {
    const item = await Device.findOne({ _id: id }).populate('category').exec();
    res.render('itemUpdate', {
      categories: categories,
      item: item,
    });
  } catch (error) {
    return next({ message: 'No item with such an ID was found' });
  }
});

// POST update a particular item
exports.postUpdateItem = asyncHandler(async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.send({ errors: result.array() });
  }

  const id = req.params.id;
  const body = req.body;

  const item = await Device.findOne({ _id: id }).populate('category').exec();

  await Device.findByIdAndUpdate(
    { _id: id },
    {
      name: body.name.replace(/&quot;/g, '"'),
      category: await Category.findOne({ name: body.category }),
      price: parseInt(body.price),
      newPrice: body.newPrice.trim() ? parseInt(body.newPrice) : null,
      description: body.description,
      numberInStock: parseInt(body.numberInStock),
      newArrival: body.newArrival === 'on' ? true : false,
    }
  );
  if (req.file) {
    await Device.findByIdAndUpdate(
      { _id: id },
      {
        fileName: req.file.filename,
      }
    );
  }
  res.redirect(item.url);
});

// GET delete a particular item
exports.getDeleteItem = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort('name').exec();
  const id = req.params.id;

  try {
    const item = await Device.findOne({ _id: id }).populate('category').exec();
    res.render('itemDelete', {
      categories: categories,
      item: item,
    });
  } catch (error) {
    return next({ message: 'No item with such an ID was found' });
  }
});

// POST delete a particular item
exports.postDeleteItem = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const category = req.params.category;
  await Device.findByIdAndDelete({ _id: id }).catch(() => {
    return next({ message: 'No item with such an ID was found' });
  });
  res.redirect(`/shop/${category}`);
});

//GET create an item form
exports.getCreateItem = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort('name').exec();
  res.render('itemCreate', { categories: categories });
});

//POST create an item form
exports.postCreateItem = asyncHandler(async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.send({ errors: result.array() });
  }

  const body = req.body;

  const deviceDetail = {
    name: body.name,
    category: await Category.findOne({ name: body.category }),
    price: body.price,
    newPrice: body.newPrice ? body.newPrice : null,
    description: body.description,
    numberInStock: body.numberInStock,
    newArrival: body.newArrival === 'on' ? true : false,
    fileName: req.file.filename,
  };
  const newDevice = new Device(deviceDetail);
  await newDevice.save();
  res.redirect(`/shop/${newDevice.category}/${newDevice._id}`);
});
