const express = require('express');
const coursesController = require('../controllers/coursesController');
const { protect, restrictTo } = require('../middlewares/auth');
const { USER_ROLES } = require('../models/user');

const router = express.Router();

// Crear curso - solo para profesores
router.post('/courses', protect, restrictTo(USER_ROLES.PROFESSOR), coursesController.createCourse);

// Listar cursos - accesible a todos los usuarios autenticados
router.get('/courses', protect, coursesController.listCourses);

// Obtener curso por ID - accesible a todos los usuarios autenticados
router.get('/courses/:id', protect, coursesController.getCourseById);

// Actualizar curso - solo para profesores
router.put('/courses/:id', protect, restrictTo(USER_ROLES.PROFESSOR), coursesController.updateCourse);

// Eliminar curso - solo para superadmin
router.delete('/courses/:id', protect, restrictTo(USER_ROLES.SUPERADMIN), coursesController.deleteCourse);

// Listar cursos por profesor - solo para profesores
router.get('/courses/professor/:id', protect, restrictTo(USER_ROLES.PROFESSOR), coursesController.listCoursesByProfessor);

module.exports = router;
