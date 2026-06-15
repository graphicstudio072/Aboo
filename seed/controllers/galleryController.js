const GalleryImage = require('../models/GalleryImage');
const GalleryVideo = require('../models/GalleryVideo');

// ========== IMAGES ==========
const getImages = async (req, res, next) => {
  try {
    const query = { isActive: true };
    if (req.query.category) query.category = req.query.category;
    if (req.query.day) query.day = parseInt(req.query.day);
    if (req.query.featured === 'true') query.isFeatured = true;
    if (req.query.search) query.$or = [
      { title: new RegExp(req.query.search, 'i') },
      { tags: new RegExp(req.query.search, 'i') },
    ];
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const [images, total] = await Promise.all([
      GalleryImage.find(query).populate('category', 'name slug').skip((page - 1) * limit).limit(limit).sort('-createdAt'),
      GalleryImage.countDocuments(query),
    ]);
    res.json({ success: true, count: images.length, total, page, pages: Math.ceil(total / limit), data: images });
  } catch (error) { next(error); }
};

const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const images = await GalleryImage.insertMany(
      req.files.map(file => ({
        ...req.body,
        title: req.body.title || file.originalname,
        imageUrl: `/uploads/images/${file.filename}`,
        thumbnailUrl: `/uploads/images/${file.filename}`,
      }))
    );
    res.status(201).json({ success: true, count: images.length, data: images });
  } catch (error) { next(error); }
};

const updateImage = async (req, res, next) => {
  try {
    const img = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!img) return res.status(404).json({ success: false, message: 'Image not found' });
    res.json({ success: true, data: img });
  } catch (error) { next(error); }
};

const deleteImage = async (req, res, next) => {
  try {
    const img = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!img) return res.status(404).json({ success: false, message: 'Image not found' });
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) { next(error); }
};

// ========== VIDEOS ==========
const getVideos = async (req, res, next) => {
  try {
    const query = { isActive: true };
    if (req.query.category) query.category = req.query.category;
    if (req.query.type) query.videoType = req.query.type;
    if (req.query.featured === 'true') query.isFeatured = true;
    if (req.query.search) query.title = new RegExp(req.query.search, 'i');
    const videos = await GalleryVideo.find(query).populate('category', 'name slug').sort('-createdAt');
    res.json({ success: true, count: videos.length, data: videos });
  } catch (error) { next(error); }
};

const createVideo = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.videoUrl = `/uploads/videos/${req.file.filename}`;
      data.videoType = 'upload';
    }
    if (data.youtubeId) {
      data.videoType = 'youtube';
      data.videoUrl = `https://www.youtube.com/embed/${data.youtubeId}`;
      if (!data.thumbnailUrl) data.thumbnailUrl = `https://img.youtube.com/vi/${data.youtubeId}/maxresdefault.jpg`;
    }
    const video = await GalleryVideo.create(data);
    res.status(201).json({ success: true, data: video });
  } catch (error) { next(error); }
};

const updateVideo = async (req, res, next) => {
  try {
    const video = await GalleryVideo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, data: video });
  } catch (error) { next(error); }
};

const deleteVideo = async (req, res, next) => {
  try {
    const video = await GalleryVideo.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) { next(error); }
};

module.exports = { getImages, uploadImages, updateImage, deleteImage, getVideos, createVideo, updateVideo, deleteVideo };
