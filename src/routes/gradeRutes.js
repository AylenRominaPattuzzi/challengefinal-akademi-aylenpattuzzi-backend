const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/gradesController');
const { protect, restrictTo } = require('../middlewares/auth');
const { USER_ROLES } = require('../models/User');

router.post('/', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.SUPERADMIN), gradesController.createGrade);
router.put('/:id', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.SUPERADMIN), gradesController.updateGrade);
router.get('/student/', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.STUDENT, USER_ROLES.SUPERADMIN), gradesController.getGradesByStudent);
router.get( '/course/:id', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.STUDENT, USER_ROLES.SUPERADMIN), gradesController.getGradesByCourse);


module.exports = router;
