const mongoose = require('mongoose');

const galleryVideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  videoType: { type: String, enum: ['upload', 'youtube'], default: 'youtube' },
  videoUrl: { type: String, required: true },
  videoPublicId: { type: String, default: '' },
  youtubeId: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  duration: { type: String, default: '' },
  day: { type: Number, default: 1 },
  viewCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('GalleryVideo', galleryVideoSchema);
