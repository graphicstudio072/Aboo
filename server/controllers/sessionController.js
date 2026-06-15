const Session = require('../models/Session');
const path = require('path');
const fs = require('fs');

const getSessions = async (req, res, next) => {
  try {
    const query = { isActive: true };
    if (req.query.type) query.sessionType = req.query.type;
    if (req.query.search) query.$or = [
      { title: new RegExp(req.query.search, 'i') },
      { speakerName: new RegExp(req.query.search, 'i') },
    ];
    if (req.query.all === 'true') delete query.isActive;
    const sessions = await Session.find(query).sort('-isFeatured date startTime');
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (error) { next(error); }
};

const getSession = async (req, res, next) => {
  try {
    const sess = await Session.findById(req.params.id);
    if (!sess) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, data: sess });
  } catch (error) { next(error); }
};

const createSession = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.speakerImage = `/uploads/images/${req.file.filename}`;
    }
    const sess = await Session.create(data);
    res.status(201).json({ success: true, data: sess });
  } catch (error) { next(error); }
};

const updateSession = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const existing = await Session.findById(req.params.id);
      if (existing && existing.speakerImage && !existing.speakerImage.includes('http')) {
        const oldPath = path.join(__dirname, '..', existing.speakerImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      data.speakerImage = `/uploads/images/${req.file.filename}`;
    }
    const sess = await Session.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!sess) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, data: sess });
  } catch (error) { next(error); }
};

const deleteSession = async (req, res, next) => {
  try {
    const sess = await Session.findByIdAndDelete(req.params.id);
    if (!sess) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, message: 'Session deleted' });
  } catch (error) { next(error); }
};

module.exports = { getSessions, getSession, createSession, updateSession, deleteSession };
