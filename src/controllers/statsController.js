const {User} = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

exports.getGeneralStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    res.status(200).json({
      totalUsers,
      totalCourses,
      totalEnrollments
    });
  } catch (error) {
    console.error('Error al obtener estadísticas generales:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};
