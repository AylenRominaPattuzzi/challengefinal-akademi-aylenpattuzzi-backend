const Course = require('../models/Course');
const HttpError = require('../utils/http-error');
const { paginatedResponse } = require('../utils/paginatedResponse');
const { validateCourseInput } = require('../utils/validateInputs');
const { USER_ROLES } = require('../models/User');
const Enrollment = require('../models/Enrollment');

const listCourses = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.search) {
      filter.title = new RegExp(req.query.search, 'i');
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const { data, total, page, limit, totalPages } = await paginatedResponse(Course, req.query, filter);
    let formatted = await Promise.all(data.map(async course => {
      const enrolleds = await Enrollment.countDocuments({ course: course._id })
      return { ...course.toObject(), enrolleds }
    }))

    if (req.user.role === 'student') {
      formatted = await Promise.all(formatted.map(async course => {
        const isEnrolled = (await Enrollment.countDocuments({ course: course._id, student: req.user.id }));

        return { ...course, isEnrolled }
      }))
    }

    res.json({ data: formatted, total, page, limit, totalPages });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


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


const createCourse = async (req, res, next) => {
  try {
    let { professor } = req.body
    if (req.user.role == USER_ROLES.PROFESSOR) {
      professor = req.user.id
    }

    const error = validateCourseInput({ ...req.body, professor });
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
      professor
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    next(new HttpError(error, 500));
  }
};

const updateCourse = async (req, res, next) => {
  try {

    if (req.user.role === USER_ROLES.PROFESSOR) {
      req.body.professor = req.user.id;
    }

    const error = validateCourseInput(req.body, true);
    if (error) return next(error);

    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new HttpError('Curso no encontrado', 404));
    }

    if (course.professor.toString() !== req.user.id && req.user.role !== USER_ROLES.SUPERADMIN) {
      return next(new HttpError('No autorizado para editar este curso', 403));
    }

    Object.assign(course, req.body);
    await course.save();

    res.json(course);
  } catch (error) {
    next(new HttpError(error.message || error, 500));
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


const listCoursesByProfessor = async (req, res, next) => {
  try {
    if (req.user.role !== USER_ROLES.PROFESSOR) {
      return next(new HttpError('Debes estar registrado como profesor para ver esta página', 403));
    }

    const filter = { professor: req.user.id };

    if (req.query.search) {
      filter.title = new RegExp(req.query.search, 'i');
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const { data, total, page, limit, totalPages } = await paginatedResponse(Course, req.query, filter);
    const formatted = await Promise.all(data.map(async course => {
      const enrolleds = await Enrollment.countDocuments({ course: course.id })
      return { ...course.toObject(), enrolleds }
    }))

    res.json({ data: formatted, total, page, limit, totalPages });
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
