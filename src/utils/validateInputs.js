const HttpError = require("./http-error");

const validateUserInput = (data, isUpdate = false) => {
  const { name, email, password, role } = data;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validRoles = ['admin', 'recepcion'];

  if (!name) return new HttpError('El nombre es requerido', 400);
  if (!email) return new HttpError('El email es requerido', 400);
  if (!emailRegex.test(email)) return new HttpError('El formato del email es inválido', 400);
  if (!isUpdate || password) {
    if (!password) return new HttpError('La contraseña es requerida', 400);
    if (password.length < 8) return new HttpError('La contraseña debe tener al menos 8 caracteres', 400);
  }
  if (!role) return new HttpError('El rol es requerido', 400);
  if (!validRoles.includes(role)) return new HttpError('El rol es inválido', 400);
};

module.exports = validateUserInput;


const validateCourseInput = (data, isUpdate = false) => {
  const { title, description, professor, startDate, endDate, capacity } = data;

  if (!title) return new HttpError('El título es requerido', 400);
  if (!description) return new HttpError('La descripción es requerida', 400);
  if (!professor) return new HttpError('El profesor es requerido', 400);

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

module.exports = validateCourseInput;

const validateEnrollmentInput = (data, isUpdate = false) => {
  const { userId, courseId, enrollmentDate } = data;

  if (!userId) return new HttpError('El ID del usuario es requerido', 400);
  if (typeof userId !== 'string') return new HttpError('El ID del usuario debe ser una cadena', 400);

  if (!courseId) return new HttpError('El ID del curso es requerido', 400);
  if (typeof courseId !== 'string') return new HttpError('El ID del curso debe ser una cadena', 400);

  if (!enrollmentDate) return new HttpError('La fecha de inscripción es requerida', 400);
  if (isNaN(Date.parse(enrollmentDate))) return new HttpError('La fecha de inscripción no es válida', 400);
};

module.exports = validateEnrollmentInput;