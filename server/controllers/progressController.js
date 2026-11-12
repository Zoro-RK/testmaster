const TestAttempt = require('../models/TestAttempt');
const TestVersion = require('../models/TestVersion');
const Test = require('../models/Test');
const Bookmark = require('../models/Bookmark');
const PortionProgress = require('../models/PortionProgress');
const SyllabusTopic = require('../models/SyllabusTopic');
const SyllabusUnit = require('../models/SyllabusUnit');
const SyllabusPart = require('../models/SyllabusPart');

async function getMyProgress(req, res) {
  try {
    const userId = req.user._id;
    const groupId = req.group._id;

    // 1. Portion Progress summary
    const totalTopics = await SyllabusTopic.countDocuments({ isActive: true });
    const userPortions = await PortionProgress.find({ groupId, userId });

    const completedTopics = userPortions.filter(p => p.status === 'completed').length;
    const inProgressTopics = userPortions.filter(p => p.status === 'inProgress').length;
    const revisionNeededTopics = userPortions.filter(p => p.status === 'revisionNeeded').length;
    const notStartedTopics = Math.max(0, totalTopics - (completedTopics + inProgressTopics + revisionNeededTopics));

    // Unit-wise progress
    const parts = await SyllabusPart.find({});
    const units = await SyllabusUnit.find({});
    const topics = await SyllabusTopic.find({ isActive: true });

    const unitBreakdown = units.map(u => {
      const unitTopics = topics.filter(t => String(t.unitId) === String(u._id));
      const unitTopicIds = unitTopics.map(t => String(t._id));
      const completedInUnit = userPortions.filter(p => unitTopicIds.includes(String(p.topicId)) && p.status === 'completed').length;

      const part = parts.find(p => String(p._id) === String(u.partId));

      return {
        unitId: u._id,
        unitCode: u.code,
        unitName: u.name,
        partCode: part ? part.code : '',
        totalTopics: unitTopics.length,
        completedTopics: completedInUnit,
        percentage: unitTopics.length > 0 ? Math.round((completedInUnit / unitTopics.length) * 100) : 0
      };
    });

    // 2. Personal Test Attempt History
    const attempts = await TestAttempt.find({ userId, status: 'submitted' });
    attempts.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    const testIds = [...new Set(attempts.map(a => a.testId))];
    const tests = await Test.find({ _id: { $in: testIds } });

    const attemptHistory = attempts.map(a => {
      const test = tests.find(t => String(t._id) === String(a.testId));
      const total = (a.correctCount || 0) + (a.incorrectCount || 0) + (a.unansweredCount || 0);
      return {
        attemptId: a._id,
        testId: a.testId,
        testTitle: test ? test.title : 'Test Attempt',
        score: a.score,
        totalQuestions: total,
        percentage: total > 0 ? Math.round((a.score / total) * 100) : 0,
        correctCount: a.correctCount,
        incorrectCount: a.incorrectCount,
        unansweredCount: a.unansweredCount,
        submittedAt: a.submittedAt
      };
    });

    // 3. Bookmarks count and revision count
    const bookmarksCount = await Bookmark.countDocuments({ userId });

    res.json({
      portionProgress: {
        totalTopics,
        completedTopics,
        inProgressTopics,
        revisionNeededTopics,
        notStartedTopics,
        overallPercentage: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
        unitBreakdown
      },
      attemptHistory,
      bookmarksCount
    });
  } catch (err) {
    console.error('getMyProgress error:', err);
    res.status(500).json({ error: 'Failed to retrieve progress analytics.' });
  }
}

async function getBookmarks(req, res) {
  try {
    const userId = req.user._id;
    const bookmarks = await Bookmark.find({ userId });
    bookmarks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ bookmarks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve bookmarks.' });
  }
}

async function toggleBookmark(req, res) {
  try {
    const userId = req.user._id;
    const { questionId, testId, testVersionId, questionSnapshot } = req.body;

    if (!questionId || !testId) {
      return res.status(400).json({ error: 'questionId and testId are required.' });
    }

    const existing = await Bookmark.findOne({ userId, questionId });
    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return res.json({ message: 'Bookmark removed.', isBookmarked: false });
    }

    const newBookmark = await Bookmark.create({
      userId,
      questionId,
      testId,
      testVersionId: testVersionId || 'default',
      questionSnapshot: questionSnapshot || null
    });

    res.status(201).json({ message: 'Question bookmarked.', isBookmarked: true, bookmark: newBookmark });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle bookmark.' });
  }
}

async function getRevisionList(req, res) {
  try {
    const userId = req.user._id;

    // Find all submitted attempts for this user
    const attempts = await TestAttempt.find({ userId, status: 'submitted' });

    // Aggregate questions answered incorrectly
    const incorrectQuestionMap = new Map();

    for (const attempt of attempts) {
      const testVersion = await TestVersion.findById(attempt.testVersionId);
      const test = await Test.findById(attempt.testId);
      if (!testVersion || !testVersion.questions) continue;

      const answers = attempt.answers || [];
      for (const ans of answers) {
        if (!ans.isCorrect && ans.selectedOption) {
          const qObj = testVersion.questions.find(q => q.id === ans.questionId);
          if (qObj && !incorrectQuestionMap.has(qObj.id)) {
            incorrectQuestionMap.set(qObj.id, {
              id: qObj.id,
              question: qObj.question,
              options: qObj.options,
              correctAnswer: qObj.correctAnswer,
              explanation: qObj.explanation,
              lastSelectedOption: ans.selectedOption,
              testTitle: test ? test.title : 'Test',
              testId: attempt.testId,
              attemptDate: attempt.submittedAt
            });
          }
        }
      }
    }

    const revisionQuestions = Array.from(incorrectQuestionMap.values());

    res.json({ revisionQuestions });
  } catch (err) {
    console.error('getRevisionList error:', err);
    res.status(500).json({ error: 'Failed to retrieve revision list.' });
  }
}

module.exports = {
  getMyProgress,
  getBookmarks,
  toggleBookmark,
  getRevisionList
};

