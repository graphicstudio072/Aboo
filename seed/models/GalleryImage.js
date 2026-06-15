const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  imagePublicId: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  day: { type: Number, default: 1 },
  venue: { type: String, default: '' },
  description: { type: String, default: '' },
  photographer: { type: String, default: '' },
  tags: [{ type: String }],
  downloadCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
