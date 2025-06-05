const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { protect, restrictTo } = require('../middlewares/auth');
const { USER_ROLES } = require('../models/User');

router.get('/general', protect, restrictTo(USER_ROLES.SUPERADMIN), statsController.getGeneralStats );

module.exports = router;
