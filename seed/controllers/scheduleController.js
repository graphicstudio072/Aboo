const Schedule = require('../models/Schedule');

const getSchedules = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.day) query.dayNumber = parseInt(req.query.day);
    if (req.query.venue) query.venue = new RegExp(req.query.venue, 'i');
    if (req.query.date) query.date = { $gte: new Date(req.query.date), $lt: new Date(new Date(req.query.date).getTime() + 86400000) };
    const schedules = await Schedule.find(query)
      .populate({ path: 'program', populate: { path: 'category', select: 'name slug icon color' } })
      .sort('date startTime');
    res.json({ success: true, count: schedules.length, data: schedules });
  } catch (error) { next(error); }
};

const getSchedule = async (req, res, next) => {
  try {
    const sch = await Schedule.findById(req.params.id).populate({ path: 'program', populate: { path: 'category', select: 'name slug icon color' } });
    if (!sch) return res.status(404).json({ success: false, message: 'Schedule not found' });
    res.json({ success: true, data: sch });
  } catch (error) { next(error); }
};

const createSchedule = async (req, res, next) => {
  try {
    const sch = await Schedule.create(req.body);
    await sch.populate({ path: 'program', populate: { path: 'category', select: 'name slug icon color' } });
    res.status(201).json({ success: true, data: sch });
  } catch (error) { next(error); }
};

const updateSchedule = async (req, res, next) => {
  try {
    const sch = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate({ path: 'program', populate: { path: 'category', select: 'name slug icon color' } });
    if (!sch) return res.status(404).json({ success: false, message: 'Schedule not found' });
    res.json({ success: true, data: sch });
  } catch (error) { next(error); }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const sch = await Schedule.findByIdAndDelete(req.params.id);
    if (!sch) return res.status(404).json({ success: false, message: 'Schedule not found' });
    res.json({ success: true, message: 'Schedule deleted' });
  } catch (error) { next(error); }
};

module.exports = { getSchedules, getSchedule, createSchedule, updateSchedule, deleteSchedule };
