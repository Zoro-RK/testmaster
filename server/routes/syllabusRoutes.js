const express = require('express');
const router = express.Router();
const syllabusController = require('../controllers/syllabusController');
const { auth } = require('../middleware/auth');
const { requireGroupMember } = require('../middleware/groupMember');

router.get('/exams', auth, syllabusController.getExams);
router.get('/exams/:examId/syllabus', auth, syllabusController.getExamSyllabus);
router.get('/topics/:topicId', auth, requireGroupMember, syllabusController.getTopicDetails);

module.exports = router;

