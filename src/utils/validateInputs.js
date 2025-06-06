const HttpError = require("./http-error");
const { USER_ROLES } = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Grade = require('../models/Grade');

const validateUserInput = (data, isUpdate = false) => {
  const { name, email, password, role } = data;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validRoles = [USER_ROLES.SUPERADMIN, USER_ROLES.PROFESSOR, USER_ROLES.STUDENT];

  if (!isUpdate) {
    if (!name) return new HttpError('El nombre es requerido', 400);
    if (!email) return new HttpError('El email es requerido', 400);
    if (!emailRegex.test(email)) return new HttpError('El formato del email es inválido', 400);
    if (!password) return new HttpError('La contraseña es requerida', 400);
    if (password.length < 8) return new HttpError('La contraseña debe tener al menos 8 caracteres', 400);
    if (!role) return new HttpError('El rol es requerido', 400);
    if (!validRoles.includes(role)) return new HttpError('El rol es inválido', 400);
  } else {
 
    if (name !== undefined && !name) return new HttpError('El nombre no puede estar vacío', 400);

    if (email !== undefined) {
      if (!email) return new HttpError('El email no puede estar vacío', 400);
      if (!emailRegex.test(email)) return new HttpError('El formato del email es inválido', 400);
    }

    if (password !== undefined) {
      if (!password) return new HttpError('La contraseña es requerida', 400);
      if (password.length < 8) return new HttpError('La contraseña debe tener al menos 8 caracteres', 400);
    }

    if (role !== undefined) {
      if (!role) return new HttpError('El rol no puede estar vacío', 400);
      if (!validRoles.includes(role)) return new HttpError('El rol es inválido', 400);
    }
  }
};

const validateCourseInput = (data) => {
  const { title, price, startDate, endDate, capacity } = data;

  if (!title) return new HttpError('El título es requerido', 400);
  if (!price) return new HttpError('El precio es requerido', 400);
  if (price < 0) return new HttpError('El precio no puede ser negativo', 400);

  if (!startDate) return new HttpError('La fecha de inicio es requerida', 400);
  if (isNaN(Date.parse(startDate))) return new HttpError('La fecha de inicio no es válida', 400);

  if (!endDate) return new HttpError('La fecha de fin es requerida', 400);
  if (isNaN(Date.parse(endDate))) return new HttpError('La fecha de fin no es válida', 400);

  if (new Date(startDate) > new Date(endDate)) {
    return new HttpError('La fecha de inicio no puede ser posterior a la fecha de fin', 400);
  }

  if (!capacity && capacity !== 0) return new HttpError('La capacidad es requerida', 400);
  if (typeof capacity !== 'number' || capacity < 1) {
    return new HttpError('La capacidad debe ser un número mayor a 0', 400);
  }
};

const validateEnrollmentInput = (data) => {
  const { userId, courseId, enrollmentDate } = data;

  if (!userId) return new HttpError('El ID del usuario es requerido', 400);
  if (typeof userId !== 'string') return new HttpError('El ID del usuario debe ser una cadena', 400);

  if (!courseId) return new HttpError('El ID del curso es requerido', 400);
  if (typeof courseId !== 'string') return new HttpError('El ID del curso debe ser una cadena', 400);

  if (!enrollmentDate) return new HttpError('La fecha de inscripción es requerida', 400);
  if (isNaN(Date.parse(enrollmentDate))) return new HttpError('La fecha de inscripción no es válida', 400);
};

const validateGradeInput = async (data) => {
  const { studentId, courseId, value } = data;

  if (!studentId) return new HttpError('El ID del estudiante es requerido', 400);
  if (typeof studentId !== 'string') return new HttpError('El ID del estudiante debe ser una cadena', 400);

  if (!courseId) return new HttpError('El ID del curso es requerido', 400);
  if (typeof courseId !== 'string') return new HttpError('El ID del curso debe ser una cadena', 400);

  if (value === undefined) return new HttpError('El valor de la nota es requerido', 400);
  if (typeof value !== 'number' || value < 0 || value > 10) {
    return new HttpError('La calificación debe ser un número entre 0 y 10', 400);
  }

  const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
  if (!enrollment) return new HttpError('El alumno no está inscripto en este curso', 400);

  const existing = await Grade.findOne({ student: studentId, course: courseId });
  if (existing) return new HttpError('La calificación ya fue cargada para este alumno en este curso', 400);

  return null;
};

module.exports = {
  validateUserInput,
  validateCourseInput,
  validateEnrollmentInput,
  validateGradeInput
};
