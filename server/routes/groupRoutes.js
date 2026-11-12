const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { auth } = require('../middleware/auth');
const { requireGroupMember, requireGroupAdmin } = require('../middleware/groupMember');

router.post('/join', auth, groupController.joinGroup);
router.get('/current', auth, requireGroupMember, groupController.getCurrentGroup);
router.get('/current/members', auth, requireGroupMember, groupController.getMembers);
router.get('/current/members/:userId', auth, requireGroupMember, groupController.getMemberProfile);
router.put('/current/settings', auth, requireGroupMember, requireGroupAdmin, groupController.updateGroupSettings);

module.exports = router;

