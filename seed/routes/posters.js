const express = require('express');
const router = express.Router();
const { getPosters, getPoster, createPoster, updatePoster, deletePoster, incrementDownload } = require('../controllers/posterController');
const { protect, adminOnly, mediaManagerPlus } = require('../middleware/auth');
const { uploadPoster } = require('../middleware/upload');

router.get('/', getPosters);
router.get('/:id', getPoster);
router.post('/:id/download', incrementDownload);
router.post('/', protect, mediaManagerPlus, uploadPoster.single('image'), createPoster);
router.put('/:id', protect, mediaManagerPlus, uploadPoster.single('image'), updatePoster);
router.delete('/:id', protect, adminOnly, deletePoster);

module.exports = router;
