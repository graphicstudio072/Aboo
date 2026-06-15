const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed },
  group: { type: String, default: 'general' },
  label: { type: String, default: '' },
  type: { type: String, enum: ['text', 'number', 'boolean', 'json', 'image'], default: 'text' },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
