const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/auth');
const { USER_ROLES } = require('../models/User');

const router = express.Router();

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

router.get('/users', protect, restrictTo(USER_ROLES.SUPERADMIN), userController.listUsers);
router.post('/users', protect, restrictTo(USER_ROLES.SUPERADMIN), userController.createUser); 

router.get('/users/:id', protect, userController.getUserById);
router.put('/users/:id', protect, userController.updateUser);
router.delete('/users/:id', protect, restrictTo(USER_ROLES.SUPERADMIN), userController.deleteUser);

module.exports = router;
