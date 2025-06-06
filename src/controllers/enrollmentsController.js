const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const HttpError = require('../utils/http-error');
const { paginatedResponse } = require('../utils/paginatedResponse');


const getMyEnrollments = async (req, res, next) => {
  try {
    const filter = { professor: req.user.id };

    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      filter['$or'] = [
        { title: regex }
      ];
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }


    const populaate = {
      path: 'course',
      select: 'title description startDate endDate capacity',
      strictPopulate: false
    }
    const { data, total, page, limit, totalPages } = await paginatedResponse(Enrollment, req.query, filter, populaate);

    const formatted = await Promise.all(data.map(async enrollment => {
      const enrolleds = await Enrollment.countDocuments({ course: enrollment.course.id })
      return { ...enrollment.course.toObject(), enrolleds, enrollmentId: enrollment._id }
    }))

    res.json({ data: formatted, total, page, limit, totalPages });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId, enrollmentDate } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return next(new HttpError('Curso no encontrado', 404));

    const existing = await Enrollment.findOne({ student: userId, course: courseId });
    if (existing) return next(new HttpError('Ya estás inscripto en este curso', 400));

    const totalEnrolled = await Enrollment.countDocuments({ course: courseId });
    if (totalEnrolled >= course.capacity) {
      return next(new HttpError('El curso ya alcanzó el cupo máximo', 400));
    }

    let parsedDate = new Date();
    if (enrollmentDate) {
      const tempDate = new Date(enrollmentDate);
      if (!isNaN(tempDate.getTime())) {
        parsedDate = tempDate;
      } else {
        return next(new HttpError('La fecha de inscripción es inválida', 400));
      }
    }

    const enrollment = new Enrollment({
      student: userId,
      course: courseId,
      enrolledAt: parsedDate
    });

    await enrollment.save();

    res.status(201).json(enrollment);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


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


const getEnrollmentsByCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return next(new HttpError('Curso no encontrado', 404));

    if (course.professor.toString() !== req.user.id) {
      return next(new HttpError('No autorizado para ver inscripciones de este curso', 403));
    }

    const filter = { course: req.params.courseId };

    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      filter['$or'] = [
        { 'student.name': regex },
        { 'student.email': regex }
      ];
    }
    const populate = ('student', 'name email')
    const { data, total, page, limit, totalPages } = await paginatedResponse(
      Enrollment,
      req.query,
      filter,
      populate
    );

    res.json({ data, total, page, limit, totalPages });

  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


exports.getMyEnrollments = getMyEnrollments;
exports.enrollInCourse = enrollInCourse;
exports.cancelEnrollment = cancelEnrollment;
exports.getEnrollmentsByCourse = getEnrollmentsByCourse;
