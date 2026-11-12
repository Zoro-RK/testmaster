const createModel = require('./createModel');

const TestAttempt = createModel('TestAttempt', {
  testId: { type: String, required: true },
  testVersionId: { type: String, required: true },
  userId: { type: String, required: true },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date, default: null },
  expiresAt: { type: Date, required: true },
  status: { type: String, enum: ['inProgress', 'submitted', 'expired'], default: 'inProgress' },
  score: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  incorrectCount: { type: Number, default: 0 },
  unansweredCount: { type: Number, default: 0 },
  answers: { 
    type: Array, 
    default: [] 
    // each item: { questionId, selectedOption, markedForReview, isCorrect, answeredAt }
  }
});

module.exports = TestAttempt;

