const createModel = require('./createModel');

const SyllabusPart = createModel('SyllabusPart', {
  examId: { type: String, required: true },
  code: { type: String, required: true }, // 'A', 'B', 'C', 'C_EN'
  name: { type: String, required: true },
  language: { type: String, default: 'English' },
  questionWeightage: { type: Number, required: true },
  displayOrder: { type: Number, default: 0 }
});

module.exports = SyllabusPart;

