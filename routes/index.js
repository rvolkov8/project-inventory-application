const express = require('express');
const passport = require('passport');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { body } = require('express-validator');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/shop');
});

//GET sign up form
router.get('/sign-up', profileController.getSignUpForm);
//POST sign up
router.post(
  '/sign-up',
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name field is empty.')
    .escape(),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name field is empty.')
    .escape(),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username field is empty.')
    .escape(),
  body('password').escape(),
  body('confirmPassword').escape(),
  profileController.postSignUpForm
);

//GET log in form
router.get('/log-in', profileController.getLogInForm);
//POST log in form
router.post(
  '/log-in',
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username field is empty.')
    .escape(),
  body('password').escape(),
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
  })
);

module.exports = router;
