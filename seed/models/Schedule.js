const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, default: '' },
  venue: { type: String, required: true },
  hall: { type: String, default: '' },
  dayNumber: { type: Number, default: 1 },
  notes: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
