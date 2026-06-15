const express = require('express');
const router = express.Router();
const { getImages, uploadImages, updateImage, deleteImage, getVideos, createVideo, updateVideo, deleteVideo } = require('../controllers/galleryController');
const { protect, mediaManagerPlus, adminOnly } = require('../middleware/auth');
const { uploadImage, uploadVideo } = require('../middleware/upload');

// Images
router.get('/images', getImages);
router.post('/images', protect, mediaManagerPlus, uploadImage.array('images', 20), uploadImages);
router.put('/images/:id', protect, mediaManagerPlus, updateImage);
router.delete('/images/:id', protect, adminOnly, deleteImage);

// Videos
router.get('/videos', getVideos);
router.post('/videos', protect, mediaManagerPlus, uploadVideo.single('video'), createVideo);
router.put('/videos/:id', protect, mediaManagerPlus, updateVideo);
router.delete('/videos/:id', protect, adminOnly, deleteVideo);

module.exports = router;
