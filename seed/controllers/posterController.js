const ResultPoster = require('../models/ResultPoster');
const path = require('path');
const fs = require('fs');

const getPosters = async (req, res, next) => {
  try {
    const query = { isActive: true };
    if (req.query.program) query.program = req.query.program;
    if (req.query.category) query.category = req.query.category;
    if (req.query.day) query.day = parseInt(req.query.day);
    if (req.query.venue) query.venue = new RegExp(req.query.venue, 'i');
    if (req.query.search) query.title = new RegExp(req.query.search, 'i');
    const posters = await ResultPoster.find(query)
      .populate('program', 'name slug')
      .populate('category', 'name slug icon')
      .sort('-createdAt');
    res.json({ success: true, count: posters.length, data: posters });
  } catch (error) { next(error); }
};

const getPoster = async (req, res, next) => {
  try {
    const poster = await ResultPoster.findById(req.params.id)
      .populate('program', 'name slug').populate('category', 'name slug icon');
    if (!poster) return res.status(404).json({ success: false, message: 'Poster not found' });
    res.json({ success: true, data: poster });
  } catch (error) { next(error); }
};

const createPoster = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.imageUrl = `/uploads/posters/${req.file.filename}`;
      data.thumbnailUrl = data.imageUrl;
    }
    const poster = await ResultPoster.create(data);
    res.status(201).json({ success: true, data: poster });
  } catch (error) { next(error); }
};

const updatePoster = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = `/uploads/posters/${req.file.filename}`;
    const poster = await ResultPoster.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!poster) return res.status(404).json({ success: false, message: 'Poster not found' });
    res.json({ success: true, data: poster });
  } catch (error) { next(error); }
};

const deletePoster = async (req, res, next) => {
  try {
    const poster = await ResultPoster.findByIdAndDelete(req.params.id);
    if (!poster) return res.status(404).json({ success: false, message: 'Poster not found' });
    res.json({ success: true, message: 'Poster deleted' });
  } catch (error) { next(error); }
};

const incrementDownload = async (req, res, next) => {
  try {
    await ResultPoster.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } });
    res.json({ success: true });
  } catch (error) { next(error); }
};

module.exports = { getPosters, getPoster, createPoster, updatePoster, deletePoster, incrementDownload };
