const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');

async function requireGroupMember(req, res, next) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    // Find the user's primary/active group membership
    let membership = await GroupMember.findOne({
      userId: user._id,
      membershipStatus: 'approved'
    });

    let group = null;
    if (membership) {
      group = await Group.findById(membership.groupId);
    }

    // Auto-connect user to the study circle if not yet linked
    if (!membership || !group) {
      const defaultGroup = await Group.findOne({ name: 'TNPSC Group IV Study Circle' }) || (await Group.findOne({})) || (await Group.find({}))[0];
      if (defaultGroup) {
        group = defaultGroup;
        if (!membership) {
          membership = await GroupMember.create({
            groupId: defaultGroup._id,
            userId: user._id,
            role: 'member',
            membershipStatus: 'approved'
          });
        } else {
          await GroupMember.findByIdAndUpdate(membership._id, { groupId: defaultGroup._id });
        }
      }
    }

    if (!group) {
      return res.status(404).json({ error: 'Study circle group not found.' });
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

