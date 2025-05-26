const { User } = require('../models/User');
const HttpError = require('../utils/http-error');
const jwt = require('jsonwebtoken');
const validateUserInput = require('../utils/validateInputs');

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {

        validateUserInput({ email, password });
        const user = await User.findOne({ email }).select('+password');;
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError(errors.array()[0].msg, 422));
    }
    try {
        validateUserInput(req.body);

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return next(new HttpError('El email ya está registrado', 400));
        }

        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
};


exports.registerUser = registerUser;
exports.loginUser = loginUser;