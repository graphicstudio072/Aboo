const mongoose = require('mongoose');

const resultPosterSchema = new mongoose.Schema({
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imagePublicId: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  day: { type: Number, default: 1 },
  venue: { type: String, default: '' },
  downloadCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('ResultPoster', resultPosterSchema);
