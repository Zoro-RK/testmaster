const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { auth } = require('../middleware/auth');
const { requireGroupMember } = require('../middleware/groupMember');

router.get('/', auth, requireGroupMember, activityController.getRecentActivity);

module.exports = router;

