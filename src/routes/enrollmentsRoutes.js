const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth');
const enrollmentController = require('../controllers/enrollmentsController');
const { USER_ROLES } = require('../models/User');


const router = express.Router();

// Solo alumnos
router.get('/enrollments/:studentId', protect, restrictTo(USER_ROLES.STUDENT, USER_ROLES.SUPERADMIN), enrollmentController.getMyEnrollments);
router.post('/enrollments', protect, restrictTo(USER_ROLES.STUDENT, USER_ROLES.SUPERADMIN), enrollmentController.enrollInCourse);
router.delete('/enrollments/:id', protect, restrictTo(USER_ROLES.STUDENT, USER_ROLES.SUPERADMIN), enrollmentController.cancelEnrollment);

// Solo profesores
router.get('/enrollments/:courseId', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.SUPERADMIN), enrollmentController.getEnrollmentsByCourse);

module.exports = router;
