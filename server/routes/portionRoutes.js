const express = require('express');
const router = express.Router();
const portionController = require('../controllers/portionController');
const { auth } = require('../middleware/auth');
const { requireGroupMember } = require('../middleware/groupMember');

router.get('/me', auth, requireGroupMember, portionController.getMyPortions);
router.put('/me/:topicId', auth, requireGroupMember, portionController.updateMyPortion);
router.get('/member/:userId', auth, requireGroupMember, portionController.getMemberPortions);

module.exports = router;

