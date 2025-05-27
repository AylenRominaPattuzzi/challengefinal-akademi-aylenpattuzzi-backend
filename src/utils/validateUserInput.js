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

