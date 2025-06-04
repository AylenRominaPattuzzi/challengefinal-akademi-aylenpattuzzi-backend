const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/auth');
const { USER_ROLES } = require('../models/User');

const router = express.Router();

router.get('/', protect, restrictTo(USER_ROLES.SUPERADMIN), userController.listUsers);
router.post('/', protect, restrictTo(USER_ROLES.SUPERADMIN), userController.createUser); 

router.get('/:id', protect, userController.getUserById);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, restrictTo(USER_ROLES.SUPERADMIN), userController.deleteUser);

module.exports = router;
