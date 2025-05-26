const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const USER_ROLES = {
  SUPERADMIN: 'superAdmin',
  PROFESSOR: 'profesor',
  STUDENT: 'alumno'
};

const profileSchema = new mongoose.Schema({
  // Para profesores
  credential: { 
    type: String, 
    required: function() { return this.parent().role === USER_ROLES.PROFESSOR; } 
  },

  // Para alumnos
  dni: { 
    type: String, 
    required: function() { return this.parent().role === USER_ROLES.STUDENT; } 
  }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.STUDENT
  },
  profileData: profileSchema
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = {
  User: mongoose.model('User', userSchema),
  USER_ROLES
};
