const User = require('../models/User');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) { next(error); }
};

const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) { next(error); }
};

const updateUser = async (req, res, next) => {
  try {
    const { password, ...updateData } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'super_admin') return res.status(400).json({ success: false, message: 'Cannot delete super admin' });
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) { next(error); }
};

const getUserStats = async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);
    res.json({ success: true, data: stats });
  } catch (error) { next(error); }
};

module.exports = { getUsers, createUser, updateUser, deleteUser, getUserStats };
