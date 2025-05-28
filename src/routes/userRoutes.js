const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', protect, userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);
router.get('/',protect, userController.listUsers);
router.get('/:id', userController.getUserById);
router.put('/:id',protect, userController.updateUser);
router.delete('/:id',protect, userController.deleteUser);

module.exports = router;
