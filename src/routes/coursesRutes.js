const express = require('express');
const coursesController = require('../controllers/coursesController');
const { protect, restrictTo } = require('../middlewares/auth');
const { USER_ROLES } = require('../models/User');

const router = express.Router();

router.post('/', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.SUPERADMIN), coursesController.createCourse);
router.get('/', coursesController.listCourses);
router.get('/professor', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.SUPERADMIN), coursesController.listCoursesByProfessor);
router.get('/:id', protect, coursesController.getCourseById);
router.put('/:id', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.SUPERADMIN), coursesController.updateCourse);
router.delete('/:id', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.SUPERADMIN), coursesController.deleteCourse);

module.exports = router;
