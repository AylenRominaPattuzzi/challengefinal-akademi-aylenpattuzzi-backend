const jwt = require('jsonwebtoken');
const {User} = require('../models/User');
const HttpError = require('../utils/http-error');


const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(new HttpError('No autorizado', 401));
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new HttpError('Token inválido', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new HttpError(error, 401));
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new HttpError('Acceso denegado', 403));
    }
    next();
  };
};


exports.restrictTo = restrictTo;
exports.protect = protect;