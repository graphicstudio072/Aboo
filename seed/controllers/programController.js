const Program = require('../models/Program');

const buildQuery = (query) => {
  const q = {};
  if (query.category) q.category = query.category;
  if (query.status) q.status = query.status;
  if (query.venue) q.venue = new RegExp(query.venue, 'i');
  if (query.search) q.name = new RegExp(query.search, 'i');
  if (query.active !== undefined) q.isActive = query.active === 'true';
  return q;
};

const getPrograms = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const query = buildQuery(req.query);
    const [programs, total] = await Promise.all([
      Program.find(query).populate('category', 'name slug icon color').skip(skip).limit(limit).sort('name'),
      Program.countDocuments(query),
    ]);
    res.json({ success: true, count: programs.length, total, page, pages: Math.ceil(total / limit), data: programs });
  } catch (error) { next(error); }
};

const getProgram = async (req, res, next) => {
  try {
    const prog = await Program.findById(req.params.id).populate('category', 'name slug icon color');
    if (!prog) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, data: prog });
  } catch (error) { next(error); }
};

const createProgram = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const prog = await Program.create(req.body);
    await prog.populate('category', 'name slug icon color');
    res.status(201).json({ success: true, data: prog });
  } catch (error) { next(error); }
};

const updateProgram = async (req, res, next) => {
  try {
    const prog = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('category', 'name slug icon color');
    if (!prog) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, data: prog });
  } catch (error) { next(error); }
};

const deleteProgram = async (req, res, next) => {
  try {
    const prog = await Program.findByIdAndDelete(req.params.id);
    if (!prog) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, message: 'Program deleted' });
  } catch (error) { next(error); }
};

const getProgramStats = async (req, res, next) => {
  try {
    const stats = await Program.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const total = await Program.countDocuments();
    res.json({ success: true, total, data: stats });
  } catch (error) { next(error); }
};

module.exports = { getPrograms, getProgram, createProgram, updateProgram, deleteProgram, getProgramStats };
