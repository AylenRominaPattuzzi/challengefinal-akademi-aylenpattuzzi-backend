const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/gradesController');
const { protect, restrictTo } = require('../middlewares/auth');
const { USER_ROLES } = require('../models/User');

// Crear una nota - solo profesores
router.post('/grades', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.SUPERADMIN), gradesController.createGrade);

// Actualizar una nota - solo profesores
router.put('/grades/:id', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.SUPERADMIN), gradesController.updateGrade);

// Obtener notas por estudiante - profesores y el propio estudiante
router.get( '/grades/student/:id', protect, restrictTo(USER_ROLES.PROFESSOR, USER_ROLES.STUDENT, USER_ROLES.SUPERADMIN), gradesController.getGradesByStudent);

module.exports = router;
