const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', protect, userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

module.exports = router;
