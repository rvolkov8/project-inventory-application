const Device = require('../models/device');
const Category = require('../models/category');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { default: mongoose } = require('mongoose');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

//GET sign up form
exports.getSignUpForm = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort('name').exec();
  if (req.user) {
    res.redirect('/profile');
  }
  res.render('signUpForm', { categories: categories });
});
//POST sign up form
exports.postSignUpForm = asyncHandler(async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next({ message: result.array() });
  }
  const body = req.body;
  if (body.password !== body.confirmPassword) {
    return next({ message: 'The password confirmation does not match.' });
  }

  bcrypt.genSalt(10, async (err, salt) => {
    if (err) {
      return next(err);
    }
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const newUser = new User({
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      password: hashedPassword,
      isAdmin: false,
    });
    await newUser.save();
    res.redirect('/log-in');
  });
});

//GET sign up form
exports.getLogInForm = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort('name').exec();
  if (req.user) {
    res.redirect('/profile');
  }
  res.render('logInForm', { categories: categories });
});
//POST log in form
exports.postSignUpForm = asyncHandler(async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next({ message: result.array() });
  }
  const body = req.body;
  if (body.password !== body.confirmPassword) {
    return next({ message: 'The password confirmation does not match.' });
  }

  bcrypt.genSalt(10, async (err, salt) => {
    if (err) {
      return next(err);
    }
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const newUser = new User({
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      password: hashedPassword,
      isAdmin: false,
    });
    await newUser.save();
    res.redirect('/log-in');
  });
});
