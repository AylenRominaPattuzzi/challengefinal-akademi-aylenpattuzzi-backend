const Grade = require('../models/Grade');
const Course = require('../models/Course');
const HttpError = require('../utils/http-error');
const { validateGradeInput } = require('../utils/validateInputs');
const Enrollment = require('../models/Enrollment');
const { paginatedResponse } = require('../utils/paginatedResponse');

const createGrade = async (req, res, next) => {
  try {
    const error = await validateGradeInput(req.body);
    if (error) return next(error);

    const { studentId, courseId, value, comment } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return next(new HttpError('Curso no encontrado', 404));
    if (course.professor.toString() !== req.user.id) {
      return next(new HttpError('No autorizado para calificar en este curso', 403));
    }

    const grade = new Grade({ student: studentId, course: courseId, value, comment });
    await grade.save();

    res.status(201).json(grade);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


const updateGrade = async (req, res, next) => {
  try {
    const grade = await Grade.findById(req.params.id).populate('course');
    if (!grade) return next(new HttpError('Calificación no encontrada', 404));
    if (grade.course.professor.toString() !== req.user.id) {
      return next(new HttpError('No autorizado para editar esta calificación', 403));
    }

    const { value, comment } = req.body;
    if (value !== undefined) {
      if (typeof value !== 'number' || value < 0 || value > 10) {
        return next(new HttpError('La calificación debe ser un número entre 0 y 10', 400));
      }
      grade.value = value;
    }
    if (comment !== undefined) {
      grade.comment = comment;
    }

    await grade.save();
    res.json(grade);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


const getGradesByStudent = async (req, res, next) => {
  try {
    const filter = { student: req.user.id };

    if (req.query.value) {
      filter.value = req.query.value;
    }
    const courseMatch = {};
    if (req.query.search) {
      courseMatch.title = new RegExp(req.query.search, 'i');
    }

    const populate = {
      path: 'course',
      select: 'title description startDate endDate capacity category',
      strictPopulate: false,
      match: courseMatch
    };

    const { data, total, page, limit, totalPages } = await paginatedResponse(Grade, req.query, filter, populate);

    res.json({ data, total, page, limit, totalPages });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};



const getGradesByCourse = async (req, res, next) => {
  try {
    const filter = { course: req.params.id };

    const populate = {
      path: 'student',
      select: 'name email',
      strictPopulate: false,
    };

    const { data, total, page, limit, totalPages } = await paginatedResponse(Grade, req.query, filter, populate);

    const studentsWithGrades = data.map(grade => grade.student?._id?.toString()).filter(Boolean);

    const enrolled = await Enrollment.find({ course: req.params.id }).populate({
      path: 'student',
      select: 'name email',
      strictPopulate: false,
    });

    const extra = enrolled
      .map(enroll => enroll.student)
      .filter(student => student && !studentsWithGrades.includes(student._id.toString()));

    res.json({ data, extra, total, page, limit, totalPages });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};



exports.createGrade = createGrade;
exports.updateGrade = updateGrade;
exports.getGradesByStudent = getGradesByStudent;
exports.getGradesByCourse = getGradesByCourse;

