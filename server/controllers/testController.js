const Test = require('../models/Test');
const TestVersion = require('../models/TestVersion');
const TestAttempt = require('../models/TestAttempt');
const ActivityEvent = require('../models/ActivityEvent');
const SyllabusPart = require('../models/SyllabusPart');
const SyllabusUnit = require('../models/SyllabusUnit');
const SyllabusTopic = require('../models/SyllabusTopic');
const User = require('../models/User');
const { validateTestSchema } = require('../validators/testValidator');

async function validateTestJson(req, res) {
  try {
    const payload = req.body;
    const result = validateTestSchema(payload);
    res.json(result);
  } catch (err) {
    res.status(400).json({ isValid: false, errors: [{ field: 'root', message: err.message }] });
  }
}

async function createTest(req, res) {
  try {
    const payload = req.body;
    const validation = validateTestSchema(payload);

    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed. Please correct errors before saving.',
        errors: validation.errors
      });
    }

    const {
      title,
      description,
      examId,
      part,
      partId,
      unit,
      unitIds,
      topics,
      topicIds,
      questionCount,
      durationMinutes,
      language,
      status = 'draft',
      questions
    } = payload;

    // Resolve part and exam if strings were passed
    let resolvedPartId = partId;
    if (!resolvedPartId && part) {
      const p = await SyllabusPart.findOne({ code: part }) || await SyllabusPart.findById(part);
      if (p) resolvedPartId = p._id;
    }

    const test = await Test.create({
      groupId: req.group._id,
      createdBy: req.user._id,
      title: title.trim(),
      description: description || '',
      examId: examId || 'default',
      partId: resolvedPartId || 'A',
      unitIds: unitIds || (unit ? [unit] : []),
      topicIds: topicIds || topics || [],
      questionCount: questions.length,
      durationMinutes: durationMinutes || 60,
      language: language || 'English',
      status: status === 'published' ? 'published' : 'draft',
      currentVersion: 1,
      publishedAt: status === 'published' ? new Date() : null
    });

    await TestVersion.create({
      testId: test._id,
      versionNumber: 1,
      questions,
      schemaVersion: payload.schemaVersion || '1.0',
      createdBy: req.user._id
    });

    if (test.status === 'published') {
      await ActivityEvent.create({
        groupId: req.group._id,
        userId: req.user._id,
        userDisplayName: req.user.displayName,
        eventType: 'test_published',
        resourceType: 'test',
        resourceId: test._id,
        resourceTitle: test.title,
        details: `Published a ${questions.length}-question practice test: "${test.title}"`
      });
    }

    res.status(201).json({
      message: test.status === 'published' ? 'Test published successfully.' : 'Test saved as draft.',
      test
    });
  } catch (err) {
    console.error('createTest error:', err);
    res.status(500).json({ error: 'Failed to create test.' });
  }
}

async function getTests(req, res) {
  try {
    const groupId = req.group._id;
    const userId = req.user._id;
    const { search, partId, creatorId, attemptState } = req.query;

    const query = { groupId, status: 'published' };

    let tests = await Test.find(query);

    // Fetch user attempts to compute attempt state for current user
    const userAttempts = await TestAttempt.find({ userId });

    // Fetch creators for display name mapping
    const creatorIds = [...new Set(tests.map(t => t.createdBy))];
    const creators = await User.find({ _id: { $in: creatorIds } });
    const parts = await SyllabusPart.find({});

    let formatted = tests.map(t => {
      const creator = creators.find(c => String(c._id) === String(t.createdBy));
      const part = parts.find(p => String(p._id) === String(t.partId) || p.code === t.partId);
      const attempts = userAttempts.filter(a => String(a.testId) === String(t._id));

      let state = 'not_attempted';
      const inProgressAttempt = attempts.find(a => a.status === 'inProgress');
      const completedAttempt = attempts.find(a => a.status === 'submitted');

      if (inProgressAttempt) state = 'in_progress';
      else if (completedAttempt) state = 'attempted';

      return {
        id: t._id,
        title: t.title,
        description: t.description,
        questionCount: t.questionCount,
        durationMinutes: t.durationMinutes,
        language: t.language,
        partName: part ? part.name : t.partId,
        partCode: part ? part.code : t.partId,
        creator: {
          id: t.createdBy,
          displayName: creator ? creator.displayName : 'Group Member'
        },
        status: t.status,
        attemptState: state,
        publishedAt: t.publishedAt || t.createdAt,
        isOwner: String(t.createdBy) === String(userId)
      };
    });

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      formatted = formatted.filter(t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)));
    }

    if (partId && partId !== 'all') {
      formatted = formatted.filter(t => t.partCode === partId || t.partId === partId);
    }

    if (creatorId && creatorId !== 'all') {
      formatted = formatted.filter(t => String(t.creator.id) === String(creatorId));
    }

    if (attemptState && attemptState !== 'all') {
      formatted = formatted.filter(t => t.attemptState === attemptState);
    }

    // Sort newest first
    formatted.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    res.json({ tests: formatted });
  } catch (err) {
    console.error('getTests error:', err);
    res.status(500).json({ error: 'Failed to retrieve tests.' });
  }
}

async function getTestById(req, res) {
  try {
    const { testId } = req.params;
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    const creator = await User.findById(test.createdBy);
    const part = await SyllabusPart.findById(test.partId) || await SyllabusPart.findOne({ code: test.partId });
    const isOwner = String(test.createdBy) === String(req.user._id);

    // If published or owner/admin, allow viewing details
    if (test.status !== 'published' && !isOwner && !req.isGroupAdmin) {
      return res.status(403).json({ error: 'This draft test is not yet published.' });
    }

    // Check user's attempt history for this test
    const userAttempts = await TestAttempt.find({ testId: test._id, userId: req.user._id });
    const latestAttempt = [...userAttempts].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))[0];

    res.json({
      test: {
        id: test._id,
        title: test.title,
        description: test.description,
        questionCount: test.questionCount,
        durationMinutes: test.durationMinutes,
        language: test.language,
        status: test.status,
        currentVersion: test.currentVersion,
        partName: part ? part.name : test.partId,
        creator: {
          id: test.createdBy,
          displayName: creator ? creator.displayName : 'Group Member'
        },
        publishedAt: test.publishedAt,
        isOwner,
        latestAttempt: latestAttempt ? {
          id: latestAttempt._id,
          status: latestAttempt.status,
          score: latestAttempt.status === 'submitted' ? latestAttempt.score : null,
          submittedAt: latestAttempt.submittedAt
        } : null
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch test details.' });
  }
}

async function publishTest(req, res) {
  try {
    const { testId } = req.params;
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    if (String(test.createdBy) !== String(req.user._id) && !req.isGroupAdmin) {
      return res.status(403).json({ error: 'Only the test creator or group admin can publish this test.' });
    }

    const updated = await Test.findByIdAndUpdate(test._id, {
      $set: {
        status: 'published',
        publishedAt: new Date()
      }
    }, { new: true });

    await ActivityEvent.create({
      groupId: req.group._id,
      userId: req.user._id,
      userDisplayName: req.user.displayName,
      eventType: 'test_published',
      resourceType: 'test',
      resourceId: updated._id,
      resourceTitle: updated.title,
      details: `Published test: "${updated.title}"`
    });

    res.json({ message: 'Test published to group library.', test: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to publish test.' });
  }
}

async function archiveTest(req, res) {
  try {
    const { testId } = req.params;
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    if (String(test.createdBy) !== String(req.user._id) && !req.isGroupAdmin) {
      return res.status(403).json({ error: 'Only the creator or group admin can archive this test.' });
    }

    const updated = await Test.findByIdAndUpdate(test._id, { $set: { status: 'archived' } }, { new: true });
    res.json({ message: 'Test archived.', test: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to archive test.' });
  }
}

async function getMyTests(req, res) {
  try {
    const tests = await Test.find({ createdBy: req.user._id });
    tests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ tests });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your tests.' });
  }
}

module.exports = {
  validateTestJson,
  createTest,
  getTests,
  getTestById,
  publishTest,
  archiveTest,
  getMyTests
};

