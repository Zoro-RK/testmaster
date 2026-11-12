const createModel = require('./createModel');

const PortionProgress = createModel('PortionProgress', {
  groupId: { type: String, required: true },
  userId: { type: String, required: true },
  topicId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['notStarted', 'inProgress', 'completed', 'revisionNeeded'], 
    default: 'notStarted' 
  },
  startedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  privateNotes: { type: String, default: '' } // Strictly private to owner
});

module.exports = PortionProgress;

