const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  rank: { type: Number, required: true, min: 1 },
  grade: { type: String, enum: ['A+', 'A', 'B', 'C', ''], default: '' },
  participantName: { type: String, required: true, trim: true },
  institution: { type: String, required: true, trim: true },
  district: { type: String, default: '' },
  school: { type: String, default: '' },
  points: { type: Number, default: 0 },
  remarks: { type: String, default: '' },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
