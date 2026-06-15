const Download = require('../models/Download');

const getDownloads = async (req, res, next) => {
  try {
    const query = { isActive: true };
    if (req.query.category) query.category = req.query.category;
    if (req.query.type) query.fileType = req.query.type;
    if (req.query.search) query.title = new RegExp(req.query.search, 'i');
    const downloads = await Download.find(query).sort('-isFeatured -createdAt');
    res.json({ success: true, count: downloads.length, data: downloads });
  } catch (error) { next(error); }
};

const createDownload = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.fileUrl = `/uploads/docs/${req.file.filename}`;
      data.fileName = req.file.originalname;
      data.fileSize = req.file.size;
    }
    const dl = await Download.create(data);
    res.status(201).json({ success: true, data: dl });
  } catch (error) { next(error); }
};

const updateDownload = async (req, res, next) => {
  try {
    const dl = await Download.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dl) return res.status(404).json({ success: false, message: 'Download not found' });
    res.json({ success: true, data: dl });
  } catch (error) { next(error); }
};

const deleteDownload = async (req, res, next) => {
  try {
    const dl = await Download.findByIdAndDelete(req.params.id);
    if (!dl) return res.status(404).json({ success: false, message: 'Download not found' });
    res.json({ success: true, message: 'Download deleted' });
  } catch (error) { next(error); }
};

const incrementDownload = async (req, res, next) => {
  try {
    await Download.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } });
    res.json({ success: true });
  } catch (error) { next(error); }
};

module.exports = { getDownloads, createDownload, updateDownload, deleteDownload, incrementDownload };
