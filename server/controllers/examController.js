const Test = require('../models/Test');
const TestVersion = require('../models/TestVersion');
const TestAttempt = require('../models/TestAttempt');
const Bookmark = require('../models/Bookmark');

async function startAttempt(req, res) {
  try {
    const { testId } = req.params;
    const userId = req.user._id;

    const test = await Test.findById(testId);
    if (!test || test.status !== 'published') {
      return res.status(404).json({ error: 'This test is not published or available for attempt.' });
    }

    // Check if there is already an active in-progress attempt
    const activeAttempt = await TestAttempt.findOne({ testId, userId, status: 'inProgress' });
    if (activeAttempt) {
      // Check if it has expired
      if (new Date() > new Date(activeAttempt.expiresAt)) {
        await evaluateAndSubmitAttempt(activeAttempt._id);
      } else {
        return res.json({
          message: 'Resuming existing active attempt.',
          attemptId: activeAttempt._id
        });
      }
    }

    // Fetch the test version
    const testVersion = await TestVersion.findOne({ testId: test._id, versionNumber: test.currentVersion })
      || (await TestVersion.find({ testId: test._id }))[0];

    if (!testVersion || !testVersion.questions || testVersion.questions.length === 0) {
      return res.status(500).json({ error: 'Test questions snapshot not found.' });
    }

    const durationMs = (test.durationMinutes || 60) * 60 * 1000;
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + durationMs);

    const attempt = await TestAttempt.create({
      testId: test._id,
      testVersionId: testVersion._id,
      userId,
      startedAt,
      expiresAt,
      status: 'inProgress',
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      unansweredCount: testVersion.questions.length,
      answers: []
    });

    res.status(201).json({
      message: 'Test started successfully.',
      attemptId: attempt._id
    });
  } catch (err) {
    console.error('startAttempt error:', err);
    res.status(500).json({ error: 'Failed to start examination attempt.' });
  }
}

async function getAttempt(req, res) {
  try {
    const { attemptId } = req.params;
    const userId = req.user._id;

    const attempt = await TestAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    if (String(attempt.userId) !== String(userId)) {
      return res.status(403).json({ error: 'Access denied to this attempt.' });
    }

    // Check for expiration
    const now = new Date();
    if (attempt.status === 'inProgress' && now > new Date(attempt.expiresAt)) {
      await evaluateAndSubmitAttempt(attempt._id);
      return res.status(400).json({ 
        error: 'Exam time has expired. The test has been automatically submitted.',
        isExpired: true,
        attemptId: attempt._id
      });
    }

    const test = await Test.findById(attempt.testId);
    const testVersion = await TestVersion.findById(attempt.testVersionId);

    if (!testVersion) {
      return res.status(500).json({ error: 'Test questions snapshot not found.' });
    }

    // Strip out correctAnswer and explanation for active examination security!
    const sanitizedQuestions = testVersion.questions.map((q, index) => ({
      index,
      id: q.id,
      question: q.question,
      options: q.options.map(opt => ({ key: opt.key, text: opt.text })),
      difficulty: q.difficulty || 'medium'
    }));

    const remainingMs = Math.max(0, new Date(attempt.expiresAt).getTime() - now.getTime());

    res.json({
      attempt: {
        id: attempt._id,
        testId: attempt.testId,
        testTitle: test ? test.title : 'Examination',
        durationMinutes: test ? test.durationMinutes : 60,
        status: attempt.status,
        startedAt: attempt.startedAt,
        expiresAt: attempt.expiresAt,
        remainingSeconds: Math.floor(remainingMs / 1000),
        answers: attempt.answers || []
      },
      questions: sanitizedQuestions
    });
  } catch (err) {
    console.error('getAttempt error:', err);
    res.status(500).json({ error: 'Failed to fetch examination attempt.' });
  }
}

async function saveAnswer(req, res) {
  try {
    const { attemptId, questionId } = req.params;
    const { selectedOption, markedForReview } = req.body;
    const userId = req.user._id;

    const attempt = await TestAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    if (String(attempt.userId) !== String(userId)) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    if (attempt.status !== 'inProgress') {
      return res.status(400).json({ error: 'Attempt has already been submitted or expired.' });
    }

    if (new Date() > new Date(attempt.expiresAt)) {
      await evaluateAndSubmitAttempt(attempt._id);
      return res.status(400).json({ error: 'Exam time has expired. Test was automatically submitted.' });
    }

    const answers = attempt.answers || [];
    const existingIndex = answers.findIndex(a => a.questionId === questionId);

    const answerRecord = {
      questionId,
      selectedOption: selectedOption !== undefined ? selectedOption : (existingIndex !== -1 ? answers[existingIndex].selectedOption : null),
      markedForReview: markedForReview !== undefined ? Boolean(markedForReview) : (existingIndex !== -1 ? answers[existingIndex].markedForReview : false),
      answeredAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      answers[existingIndex] = answerRecord;
    } else {
      answers.push(answerRecord);
    }

    await TestAttempt.findByIdAndUpdate(attempt._id, { $set: { answers } });

    res.json({ message: 'Answer saved successfully.', answer: answerRecord });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save answer.' });
  }
}

async function evaluateAndSubmitAttempt(attemptId) {
  const attempt = await TestAttempt.findById(attemptId);
  if (!attempt || attempt.status === 'submitted') return attempt;

  const testVersion = await TestVersion.findById(attempt.testVersionId);
  const questions = testVersion ? testVersion.questions : [];
  const userAnswers = attempt.answers || [];

  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const evaluatedAnswers = questions.map(q => {
    const ua = userAnswers.find(a => a.questionId === q.id);
    const selected = ua ? ua.selectedOption : null;
    const isMarked = ua ? Boolean(ua.markedForReview) : false;

    let isCorrect = false;
    if (selected) {
      if (selected.toUpperCase() === q.correctAnswer.toUpperCase()) {
        isCorrect = true;
        correctCount++;
      } else {
        incorrectCount++;
      }
    } else {
      unansweredCount++;
    }

    return {
      questionId: q.id,
      selectedOption: selected,
      isCorrect,
      markedForReview: isMarked,
      answeredAt: ua ? ua.answeredAt : null
    };
  });

  const totalQuestions = questions.length;
  // TNPSC scoring: 1 mark per correct question
  const score = correctCount;

  const updated = await TestAttempt.findByIdAndUpdate(attempt._id, {
    $set: {
      status: 'submitted',
      submittedAt: new Date(),
      score,
      correctCount,
      incorrectCount,
      unansweredCount,
      answers: evaluatedAnswers
    }
  }, { new: true });

  return updated;
}

async function submitAttempt(req, res) {
  try {
    const { attemptId } = req.params;
    const userId = req.user._id;

    const attempt = await TestAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    if (String(attempt.userId) !== String(userId)) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    if (attempt.status === 'submitted') {
      return res.json({ message: 'Attempt has already been submitted.', attemptId: attempt._id });
    }

    const submittedAttempt = await evaluateAndSubmitAttempt(attempt._id);

    res.json({
      message: 'Test submitted and evaluated successfully.',
      attemptId: submittedAttempt._id,
      score: submittedAttempt.score,
      correctCount: submittedAttempt.correctCount,
      incorrectCount: submittedAttempt.incorrectCount,
      unansweredCount: submittedAttempt.unansweredCount
    });
  } catch (err) {
    console.error('submitAttempt error:', err);
    res.status(500).json({ error: 'Failed to submit test attempt.' });
  }
}

async function getResult(req, res) {
  try {
    const { attemptId } = req.params;
    const userId = req.user._id;

    const attempt = await TestAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    // Strict privacy rule: Only the member who took the test can view the result
    if (String(attempt.userId) !== String(userId)) {
      return res.status(403).json({ error: 'Privacy protection: Scores and answers are strictly private to the candidate.' });
    }

    if (attempt.status === 'inProgress') {
      return res.status(400).json({ error: 'Attempt is still in progress and has not been submitted.' });
    }

    const test = await Test.findById(attempt.testId);
    const testVersion = await TestVersion.findById(attempt.testVersionId);
    const questions = testVersion ? testVersion.questions : [];

    // Fetch member bookmarks for this attempt's questions
    const userBookmarks = await Bookmark.find({ userId });
    const bookmarkedIds = new Set(userBookmarks.map(b => b.questionId));

    // Combine question breakdown with user choices and explanations
    const questionReview = questions.map((q, index) => {
      const ua = (attempt.answers || []).find(a => a.questionId === q.id);
      return {
        index,
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        selectedOption: ua ? ua.selectedOption : null,
        isCorrect: ua ? Boolean(ua.isCorrect) : false,
        explanation: q.explanation || 'No explanation provided for this question.',
        difficulty: q.difficulty || 'medium',
        isBookmarked: bookmarkedIds.has(q.id)
      };
    });

    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? Math.round((attempt.score / totalQuestions) * 100) : 0;

    res.json({
      result: {
        attemptId: attempt._id,
        testId: attempt.testId,
        testTitle: test ? test.title : 'Test Result',
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        score: attempt.score,
        totalQuestions,
        correctCount: attempt.correctCount,
        incorrectCount: attempt.incorrectCount,
        unansweredCount: attempt.unansweredCount,
        percentage,
        questions: questionReview
      }
    });
  } catch (err) {
    console.error('getResult error:', err);
    res.status(500).json({ error: 'Failed to retrieve test result.' });
  }
}

module.exports = {
  startAttempt,
  getAttempt,
  saveAnswer,
  submitAttempt,
  getResult
};

