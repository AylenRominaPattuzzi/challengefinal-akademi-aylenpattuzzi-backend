const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/auth');
const { USER_ROLES } = require('../models/user');

const router = express.Router();

// Registro de alumnos: sin protección
router.post('/register', userController.registerUser);

// Login y recuperación de contraseña
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

// Acciones del SuperAdmin
router.get('/users', protect, restrictTo(USER_ROLES.SUPERADMIN), userController.listUsers);
router.post('/users', protect, restrictTo(USER_ROLES.SUPERADMIN), userController.createUser); // crear profesor/superadmin

// Acciones protegidas pero abiertas a varios roles (editarse a sí mismo, ver perfil, etc.)
router.get('/users:id', protect, userController.getUserById);
router.put('/users/:id', protect, userController.updateUser);
router.delete('/users/:id', protect, restrictTo(USER_ROLES.SUPERADMIN), userController.deleteUser);

module.exports = router;
