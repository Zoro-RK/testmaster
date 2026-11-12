const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { auth } = require('../middleware/auth');
const { requireGroupMember } = require('../middleware/groupMember');

router.post('/tests/:testId/attempts', auth, requireGroupMember, examController.startAttempt);
router.get('/attempts/:attemptId', auth, requireGroupMember, examController.getAttempt);
router.put('/attempts/:attemptId/answers/:questionId', auth, requireGroupMember, examController.saveAnswer);
router.post('/attempts/:attemptId/submit', auth, requireGroupMember, examController.submitAttempt);
router.get('/attempts/:attemptId/result', auth, requireGroupMember, examController.getResult);

module.exports = router;

