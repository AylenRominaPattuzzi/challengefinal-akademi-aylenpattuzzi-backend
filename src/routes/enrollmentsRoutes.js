const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth');
const enrollmentController = require('../controllers/enrollmentsController');
const { USER_ROLES } = require('../models/user');


const router = express.Router();

// Solo alumnos
router.get('/enrollments/studentId', protect, restrictTo(USER_ROLES.STUDENT), enrollmentController.getMyEnrollments);
router.post('/enrollments', protect, restrictTo(USER_ROLES.STUDENT), enrollmentController.enrollInCourse);
router.delete('/enrollments/:id', protect, restrictTo(USER_ROLES.STUDENT), enrollmentController.cancelEnrollment);

// Solo profesores
router.get('/enrollments/courseId', protect, restrictTo(USER_ROLES.PROFESSOR), enrollmentController.getEnrollmentsByCourse);

module.exports = router;
