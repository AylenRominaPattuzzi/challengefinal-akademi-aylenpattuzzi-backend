
const Course = require('../models/Course');
const HttpError = require('../utils/http-error');
const { paginatedResponse } = require('../utils/paginatedResponse');
const validateCourseInput = require('../utils/validateInputs');

//Listar cursos (solo alumnos)
const listCourses = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const { data, total, page, limit, totalPages } = await paginatedResponse(Course, req.query, filter);
    res.json({ data, total, page, limit, totalPages });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//Detalle del curso
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('professor', 'name email');
    if (!course) {
      return next(new HttpError('Curso no encontrado', 404));
    }
    res.json(course);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//Crear curso (solo profesor)
const createCourse = async (req, res, next) => {
  try {
    const error = validateCourseInput(req.body);
    if (error) return next(error);

    const { title, description, category, price, capacity, startDate, endDate } = req.body;

    const course = new Course({
      title,
      description,
      category,
      price,
      capacity,
      startDate,
      endDate,
      professor: req.user.id,
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//Editar curso (solo profesor)
const updateCourse = async (req, res, next) => {
  try {
    const error = validateCourseInput(req.body, true);
    if (error) return next(error);

    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new HttpError('Curso no encontrado', 404));
    }

    if (course.professor.toString() !== req.user.id) {
      return next(new HttpError('No autorizado para editar este curso', 403));
    }

    Object.assign(course, req.body);
    await course.save();
    res.json(course);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new HttpError('Curso no encontrado', 404));
    }

    const isOwner = course.professor.toString() === req.user.id;
    const isSuperAdmin = req.user.role === 'superadmin';

    if (!isOwner && !isSuperAdmin) {
      return next(new HttpError('No autorizado para eliminar este curso', 403));
    }

    await course.deleteOne();
    res.json({ message: 'Curso eliminado correctamente' });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//Listar cursos del profesor logueado
const listCoursesByProfessor = async (req, res, next) => {
  try {
    const courses = await Course.find({ professor: req.user.id });
    res.json(courses);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

exports.listCourses = listCourses;
exports.getCourseById = getCourseById;
exports.createCourse = createCourse;
exports.updateCourse = updateCourse;
exports.deleteCourse = deleteCourse;
exports.listCoursesByProfessor = listCoursesByProfessor;
