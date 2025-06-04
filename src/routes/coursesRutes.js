const express = require('express');
const coursesController = require('../controllers/coursesController');
const { protect, restrictTo } = require('../middlewares/auth');
const { USER_ROLES } = require('../models/User');

const router = express.Router();

// Crear curso - solo para profesores
router.post('/', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.SUPERADMIN), coursesController.createCourse);

// Listar cursos - accesible a todos los usuarios autenticados
router.get('/', coursesController.listCourses);

// Listar cursos por profesor - solo para profesores
router.get('/professor', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.SUPERADMIN), coursesController.listCoursesByProfessor);

// Obtener curso por ID - accesible a todos los usuarios autenticados
router.get('/:id', protect, coursesController.getCourseById);

// Actualizar curso - solo para profesores
router.put('/:id', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.SUPERADMIN), coursesController.updateCourse);

// Eliminar curso - solo para superadmin
router.delete('/:id', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.SUPERADMIN), coursesController.deleteCourse);



module.exports = router;
