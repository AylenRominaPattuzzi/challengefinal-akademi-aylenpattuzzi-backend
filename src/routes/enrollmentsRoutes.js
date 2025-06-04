const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth');
const enrollmentController = require('../controllers/enrollmentsController');
const { USER_ROLES } = require('../models/User');


const router = express.Router();

// Solo alumnos
router.get('/:studentId', protect, restrictTo(USER_ROLES.STUDENT, USER_ROLES.SUPERADMIN), enrollmentController.getMyEnrollments);
router.post('', protect, restrictTo(USER_ROLES.STUDENT, USER_ROLES.SUPERADMIN), enrollmentController.enrollInCourse);
router.delete('/:id', protect, restrictTo(USER_ROLES.STUDENT, USER_ROLES.SUPERADMIN), enrollmentController.cancelEnrollment);

// Solo profesores
router.get('/:courseId', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.SUPERADMIN), enrollmentController.getEnrollmentsByCourse);

module.exports = router;
