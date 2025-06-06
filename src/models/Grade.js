const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gradeSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  dateAssigned: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Grade', gradeSchema);
