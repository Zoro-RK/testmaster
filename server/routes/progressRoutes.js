const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { auth } = require('../middleware/auth');
const { requireGroupMember } = require('../middleware/groupMember');

router.get('/me', auth, requireGroupMember, progressController.getMyProgress);
router.get('/bookmarks', auth, requireGroupMember, progressController.getBookmarks);
router.post('/bookmarks', auth, requireGroupMember, progressController.toggleBookmark);
router.get('/revision', auth, requireGroupMember, progressController.getRevisionList);

module.exports = router;

