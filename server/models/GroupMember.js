const createModel = require('./createModel');

const GroupMember = createModel('GroupMember', {
  groupId: { type: String, required: true },
  userId: { type: String, required: true },
  role: { type: String, default: 'member' },
  membershipStatus: { type: String, enum: ['approved', 'pending', 'suspended'], default: 'approved' },
  joinedAt: { type: Date, default: Date.now }
});

module.exports = GroupMember;

