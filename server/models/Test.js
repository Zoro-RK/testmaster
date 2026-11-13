const createModel = require('./createModel');

const Test = createModel('Test', {
  groupId: { type: String, required: true },
  createdBy: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  examId: { type: String, required: true },
  partId: { type: String, required: true },
  unitIds: { type: [String], default: [] },
  topicIds: { type: [String], default: [] },
  questionCount: { type: Number, required: true },
  durationMinutes: { type: Number, required: true },
  language: { type: String, default: 'English' }, // 'English' | 'Tamil' | 'Bilingual'
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  currentVersion: { type: Number, default: 1 },
  publishedAt: { type: Date, default: null },
  portionPdfName: { type: String, default: '' },
  portionPdfStorageKey: { type: String, default: '' },
  portionPdfUrl: { type: String, default: '' },
  studyNotesText: { type: String, default: '' }
});

module.exports = Test;

