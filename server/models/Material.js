const createModel = require('./createModel');

const Material = createModel('Material', {
  groupId: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  topicIds: { type: [String], default: [] },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  fileStorageKey: { type: String, required: true },
  fileName: { type: String, default: '' },
  fileType: { type: String, default: 'application/pdf' },
  fileSize: { type: Number, default: 0 },
  visibility: { type: String, enum: ['group', 'private'], default: 'group' }
});

module.exports = Material;

