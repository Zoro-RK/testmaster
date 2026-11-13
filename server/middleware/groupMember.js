const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');

async function requireGroupMember(req, res, next) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    // Find the user's primary/active group membership
    const membership = await GroupMember.findOne({
      userId: user._id,
      membershipStatus: 'approved'
    });

    if (!membership) {
      return res.status(403).json({ 
        error: 'You do not belong to an approved private study group. Please join using an invitation code.',
        requiresGroup: true 
      });
    }

    const group = await Group.findById(membership.groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    req.group = group;
    req.membership = membership;
    req.isGroupAdmin = false; // Admin role removed - peer circle learning
    next();
  } catch (err) {
    console.error('Group verification error:', err);
    return res.status(500).json({ error: 'Error checking group membership.' });
  }
}

function requireGroupAdmin(req, res, next) {
  // All active circle members have equal peer access
  next();
}

module.exports = {
  requireGroupMember,
  requireGroupAdmin
};

