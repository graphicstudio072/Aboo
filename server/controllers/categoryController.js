const Category = require('../models/Category');

const getCategories = async (req, res, next) => {
  try {
    const query = req.query.active === 'true' ? { isActive: true } : {};
    const categories = await Category.find(query).sort('order name');
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) { next(error); }
};

const getCategory = async (req, res, next) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: cat });
  } catch (error) { next(error); }
};

const createCategory = async (req, res, next) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json({ success: true, data: cat });
  } catch (error) { next(error); }
};

const updateCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: cat });
  } catch (error) { next(error); }
};

const deleteCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) { next(error); }
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
