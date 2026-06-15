const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String, default: '' },
  venue: { type: String, default: '' },
  date: { type: Date },
  time: { type: String, default: '' },
  duration: { type: Number, default: 60, comment: 'minutes' },
  maxParticipants: { type: Number, default: 0 },
  ageGroup: { type: String, default: '' },
  rules: { type: String, default: '' },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  pointsFirst: { type: Number, default: 5 },
  pointsSecond: { type: Number, default: 3 },
  pointsThird: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

programSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Program', programSchema);
