const createModel = require('./createModel');

const Exam = createModel('Exam', {
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
});

module.exports = Exam;

