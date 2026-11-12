const createModel = require('./createModel');

const ActivityEvent = createModel('ActivityEvent', {
  groupId: { type: String, required: true },
  userId: { type: String, required: true },
  userDisplayName: { type: String, default: '' },
  eventType: { 
    type: String, 
    enum: ['test_published', 'material_shared', 'portion_updated', 'member_joined'], 
    required: true 
  },
  resourceType: { type: String, required: true }, // 'test', 'material', 'topic', 'member'
  resourceId: { type: String, required: true },
  resourceTitle: { type: String, default: '' },
  details: { type: String, default: '' } // Non-competitive context (e.g. "marked Fundamental Rights as completed")
});

module.exports = ActivityEvent;

