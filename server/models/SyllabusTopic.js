const createModel = require('./createModel');

const SyllabusTopic = createModel('SyllabusTopic', {
  unitId: { type: String, required: true },
  slug: { type: String, required: true },
  parentTopicId: { type: String, default: null },
  name: { type: String, required: true },
  nameTa: { type: String, default: '' },
  description: { type: String, default: '' },
  language: { type: String, default: 'English' },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

module.exports = SyllabusTopic;

