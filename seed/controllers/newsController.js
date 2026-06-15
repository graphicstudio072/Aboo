const News = require('../models/News');

const getNews = async (req, res, next) => {
  try {
    const query = {};
    if (!req.user) query.isPublished = true;
    if (req.query.category) query.category = req.query.category;
    if (req.query.featured === 'true') query.isFeatured = true;
    if (req.query.search) query.$or = [
      { title: new RegExp(req.query.search, 'i') },
      { content: new RegExp(req.query.search, 'i') },
    ];
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const [news, total] = await Promise.all([
      News.find(query).populate('author', 'name').skip((page - 1) * limit).limit(limit).sort('-publishedAt -createdAt'),
      News.countDocuments(query),
    ]);
    res.json({ success: true, count: news.length, total, page, pages: Math.ceil(total / limit), data: news });
  } catch (error) { next(error); }
};

const getNewsItem = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id).populate('author', 'name');
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    await News.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    res.json({ success: true, data: news });
  } catch (error) { next(error); }
};

const createNews = async (req, res, next) => {
  try {
    const data = { ...req.body, author: req.user._id };
    if (req.file) data.coverImage = `/uploads/images/${req.file.filename}`;
    if (data.isPublished && !data.publishedAt) data.publishedAt = new Date();
    const news = await News.create(data);
    res.status(201).json({ success: true, data: news });
  } catch (error) { next(error); }
};

const updateNews = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.coverImage = `/uploads/images/${req.file.filename}`;
    if (data.isPublished === 'true' || data.isPublished === true) {
      const existing = await News.findById(req.params.id);
      if (!existing.publishedAt) data.publishedAt = new Date();
    }
    const news = await News.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    res.json({ success: true, data: news });
  } catch (error) { next(error); }
};

const deleteNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    res.json({ success: true, message: 'News deleted' });
  } catch (error) { next(error); }
};

module.exports = { getNews, getNewsItem, createNews, updateNews, deleteNews };
