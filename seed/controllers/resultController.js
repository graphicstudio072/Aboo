const Result = require('../models/Result');
const Program = require('../models/Program');

const getResults = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.program) query.program = req.query.program;
    if (req.query.district) query.district = new RegExp(req.query.district, 'i');
    if (req.query.institution) query.institution = new RegExp(req.query.institution, 'i');
    if (req.query.search) {
      query.$or = [
        { participantName: new RegExp(req.query.search, 'i') },
        { institution: new RegExp(req.query.search, 'i') },
        { district: new RegExp(req.query.search, 'i') },
      ];
    }
    // Public API only shows published
    if (!req.user) query.isPublished = true;
    else if (req.query.published === 'true') query.isPublished = true;
    
    const results = await Result.find(query)
      .populate({ path: 'program', populate: { path: 'category', select: 'name slug icon color' } })
      .sort('rank');
    res.json({ success: true, count: results.length, data: results });
  } catch (error) { next(error); }
};

const getResult = async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate({ path: 'program', populate: { path: 'category', select: 'name slug icon color' } });
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

const createResult = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const result = await Result.create(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

const updateResult = async (req, res, next) => {
  try {
    const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

const deleteResult = async (req, res, next) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
    res.json({ success: true, message: 'Result deleted' });
  } catch (error) { next(error); }
};

const publishResult = async (req, res, next) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      { isPublished: true, publishedAt: new Date() },
      { new: true }
    );
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

const unpublishResult = async (req, res, next) => {
  try {
    const result = await Result.findByIdAndUpdate(req.params.id, { isPublished: false, publishedAt: null }, { new: true });
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

const bulkCreateResults = async (req, res, next) => {
  try {
    const results = req.body.results;
    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ success: false, message: 'Provide results array' });
    }
    const created = await Result.insertMany(results.map(r => ({ ...r, createdBy: req.user._id })));
    res.status(201).json({ success: true, count: created.length, data: created });
  } catch (error) { next(error); }
};

const getChampionship = async (req, res, next) => {
  try {
    const championship = await Result.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$institution', totalPoints: { $sum: '$points' }, district: { $first: '$district' }, wins: { $sum: { $cond: [{ $eq: ['$rank', 1] }, 1, 0] } } } },
      { $sort: { totalPoints: -1 } },
      { $limit: 50 },
    ]);
    res.json({ success: true, data: championship });
  } catch (error) { next(error); }
};

module.exports = { getResults, getResult, createResult, updateResult, deleteResult, publishResult, unpublishResult, bulkCreateResults, getChampionship };
