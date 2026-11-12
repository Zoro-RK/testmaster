const createModel = require('./createModel');

const Bookmark = createModel('Bookmark', {
  userId: { type: String, required: true },
  questionId: { type: String, required: true },
  testId: { type: String, required: true },
  testVersionId: { type: String, required: true },
  questionSnapshot: { type: Object, default: null }
});

module.exports = Bookmark;

