const express = require('express');
const router = express.Router();
const { getNews, getNewsItem, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const { protect, mediaManagerPlus, adminOnly } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

router.get('/', getNews);
router.get('/:id', getNewsItem);
router.post('/', protect, mediaManagerPlus, uploadImage.single('coverImage'), createNews);
router.put('/:id', protect, mediaManagerPlus, uploadImage.single('coverImage'), updateNews);
router.delete('/:id', protect, adminOnly, deleteNews);

module.exports = router;
