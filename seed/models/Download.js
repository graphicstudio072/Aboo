const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  fileUrl: { type: String, required: true },
  filePublicId: { type: String, default: '' },
  fileName: { type: String, default: '' },
  fileSize: { type: Number, default: 0 },
  fileType: { type: String, enum: ['pdf', 'image', 'document', 'spreadsheet', 'other'], default: 'pdf' },
  category: { type: String, enum: ['schedule', 'rulebook', 'certificate', 'brochure', 'programlist', 'other'], default: 'other' },
  downloadCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Download', downloadSchema);
