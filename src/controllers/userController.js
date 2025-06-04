const { User, USER_ROLES } = require('../models/User');
const jwt = require('jsonwebtoken');
const { forgotPasswordEmail } = require('../utils/emails/forgotPasswordEmail');
const {validateUserInput} = require('../utils/validateInputs');
const sendEmail = require('../utils/sendEmail');
const HttpError = require('../utils/http-error');
const { paginatedResponse } = require('../utils/paginatedResponse');

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    console.log('Email recibido en login:', email);

    const user = await User.findOne({ email }).select('+password');
    console.log('Usuario encontrado en BD:', user);

    if (!user) {
      return next(new HttpError('Usuario no encontrado', 401));
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return next(new HttpError('Contraseña incorrecta', 401));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, profile } = req.body;

    if (!name || !email || !password || !profile?.documentNumber || !profile?.birthDate) {
      return next(new HttpError('Faltan campos obligatorios', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new HttpError('El email ya está registrado', 400));
    }

    const newUser = new User({
      name,
      email,
      password,
      role: role || USER_ROLES.STUDENT, 
      profile: {
        documentNumber: profile.documentNumber,
        birthDate: profile.birthDate,
      },
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new HttpError('Usuario no encontrado', 404));
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7h' });
    const link = `http://localhost:3000/reset-password/${token}`;


    await sendEmail({
      email: user.email,
      subject: 'Recuperación de contraseña',
      html: forgotPasswordEmail(user.name, link)
    });

    res.json({ message: 'Enlace de recuperación enviado' });
  } catch (error) {
    next(new HttpError('Error al enviar el correo electrónico', 500));
  }
};



const resetPassword = async (req, res, next) => {
  const { password } = req.body;
  try {

    validateUserInput({ password });

    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+password');

    if (!user) {
      return next(new HttpError('Usuario no encontrado', 404));
    }

    user.password = password;
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    next(new HttpError('Token inválido o expirado', 400));
  }
};


const createUser = async (req, res, next) => {
  try {
    const validationError = validateUserInput(req.body);
    if (validationError) {
      return next(validationError);
    }

    // Solo superadmin puede crear usuarios que no sean estudiantes
    if (![USER_ROLES.SUPERADMIN].includes(req.user.role)) {
      return next(new HttpError('No autorizado para crear usuarios', 403));
    }

    const { name, email, password, role, profile } = req.body;


    // Validar rol permitido (solo profesor o superadmin, no estudiantes)
    if (![USER_ROLES.PROFESSOR, USER_ROLES.SUPERADMIN].includes(role)) {
      return next(new HttpError('Rol inválido para creación por superadmin', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new HttpError('Email ya registrado', 409));
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      profile,
    });

    await newUser.save();
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};




const listUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }

    const { data, total, page, limit, totalPages } = await paginatedResponse(User, req.query, filter);
    res.json({ data, total, page, limit, totalPages });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return next(new HttpError('Usuario no encontrado', 404));
    }
    res.json(user);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const validationError = validateUserInput(req.body, true);
    if (validationError) {
      return next(validationError);
    }
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!updatedUser) {
      return next(new HttpError('Usuario no encontrado', 404));
    }

    res.json(updatedUser);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return next(new HttpError('Usuario no encontrado', 404));
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.createUser = createUser;
exports.listUsers = listUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;