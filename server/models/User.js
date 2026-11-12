const createModel = require('./createModel');

const User = createModel('User', {
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  profileImage: { type: String, default: '' },
  accountStatus: { type: String, enum: ['active', 'suspended'], default: 'active' }
});

module.exports = User;

