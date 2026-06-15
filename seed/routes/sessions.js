const express = require('express');
const router = express.Router();
const { getSessions, getSession, createSession, updateSession, deleteSession } = require('../controllers/sessionController');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

router.get('/', getSessions);
router.get('/:id', getSession);
router.post('/', protect, adminOnly, uploadImage.single('speakerImage'), createSession);
router.put('/:id', protect, adminOnly, uploadImage.single('speakerImage'), updateSession);
router.delete('/:id', protect, adminOnly, deleteSession);

module.exports = router;
