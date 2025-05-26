const express = require('express');
const userController = require('../controllers/userController');
const protect  = require('../middlewares/auth');


const router = express.Router();

router.post(
  '/auth/register',
  protect,
  userController.registerUser
);

router.post(
    '/auth/login',
    userController.loginUser
  );