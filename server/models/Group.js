const createModel = require('./createModel');

const Group = createModel('Group', {
  name: { type: String, required: true },
  description: { type: String, default: '' },
  createdBy: { type: String, required: true },
  joinMode: { type: String, enum: ['invitationCode', 'adminApproval', 'open'], default: 'invitationCode' },
  invitationCode: { type: String, default: 'TNPSC2025' }
});

module.exports = Group;

