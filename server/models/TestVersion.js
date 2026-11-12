const createModel = require('./createModel');

const TestVersion = createModel('TestVersion', {
  testId: { type: String, required: true },
  versionNumber: { type: Number, required: true },
  questions: { type: Array, required: true }, // [ { id, question, options: [{key, text}], correctAnswer, explanation, difficulty } ]
  schemaVersion: { type: String, default: '1.0' },
  createdBy: { type: String, required: true }
});

module.exports = TestVersion;

