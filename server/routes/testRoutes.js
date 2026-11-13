const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { auth } = require('../middleware/auth');
const { requireGroupMember } = require('../middleware/groupMember');

router.post('/validate', auth, testController.validateTestJson);
router.post('/', auth, requireGroupMember, testController.createTest);
router.get('/', auth, requireGroupMember, testController.getTests);
router.get('/my', auth, requireGroupMember, testController.getMyTests);
router.get('/:testId/portion-pdf', auth, requireGroupMember, testController.getPortionPdf);
router.get('/:testId', auth, requireGroupMember, testController.getTestById);
router.post('/:testId/publish', auth, requireGroupMember, testController.publishTest);
router.post('/:testId/archive', auth, requireGroupMember, testController.archiveTest);

module.exports = router;

