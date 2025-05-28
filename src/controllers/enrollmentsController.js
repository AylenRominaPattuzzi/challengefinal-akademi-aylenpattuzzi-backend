const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const HttpError = require('../utils/http-error');
const validateEnrollmentInput = require('../utils/validateEnrollmentInput'); // corregido nombre del archivo
const { paginatedResponse } = require('../utils/paginatedResponse');

// Listar mis inscripciones (solo alumno)
const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course', 'title description startDate endDate');
    res.json(enrollments);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// Inscribirse a un curso (solo alumno)
const enrollInCourse = async (req, res, next) => {
  try {
    const error = validateEnrollmentInput(req.body);
    if (error) return next(error);

    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return next(new HttpError('Curso no encontrado', 404));

    const existing = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (existing) return next(new HttpError('Ya estás inscripto en este curso', 400));

    const totalEnrolled = await Enrollment.countDocuments({ course: courseId });
    if (totalEnrolled >= course.capacity) {
      return next(new HttpError('El curso ya alcanzó el cupo máximo', 400));
    }

    const enrollment = new Enrollment({ student: req.user.id, course: courseId, enrollmentDate: new Date() });
    await enrollment.save();

    res.status(201).json(enrollment);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// Cancelar inscripción (solo alumno)
const cancelEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return next(new HttpError('Inscripción no encontrada', 404));
    if (enrollment.student.toString() !== req.user.id) {
      return next(new HttpError('No autorizado para cancelar esta inscripción', 403));
    }

    await enrollment.deleteOne();
    res.json({ message: 'Inscripción cancelada correctamente' });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// Listar inscripciones por curso (solo profesor)
const getEnrollmentsByCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return next(new HttpError('Curso no encontrado', 404));
    if (course.professor.toString() !== req.user.id) {
      return next(new HttpError('No autorizado para ver inscripciones de este curso', 403));
    }

    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'name email');
    res.json(enrollments);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

exports.getMyEnrollments = getMyEnrollments;
exports.enrollInCourse = enrollInCourse;
exports.cancelEnrollment = cancelEnrollment;
exports.getEnrollmentsByCourse = getEnrollmentsByCourse;
