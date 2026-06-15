const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  speakerName: { type: String, required: true },
  speakerBio: { type: String, default: '' },
  speakerImage: { type: String, default: '' },
  speakerImagePublicId: { type: String, default: '' },
  designation: { type: String, default: '' },
  organization: { type: String, default: '' },
  topic: { type: String, default: '' },
  description: { type: String, default: '' },
  venue: { type: String, default: '' },
  date: { type: Date },
  startTime: { type: String, default: '' },
  endTime: { type: String, default: '' },
  sessionType: { type: String, enum: ['keynote', 'panel', 'workshop', 'talk', 'cultural'], default: 'talk' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
