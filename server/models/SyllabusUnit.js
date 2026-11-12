const createModel = require('./createModel');

const SyllabusUnit = createModel('SyllabusUnit', {
  partId: { type: String, required: true },
  code: { type: String, required: true }, // 'Unit I', 'Unit II', etc.
  name: { type: String, required: true },
  questionWeightage: { type: Number, default: 0 },
  displayOrder: { type: Number, default: 0 }
});

module.exports = SyllabusUnit;

