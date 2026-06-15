const express = require('express');
const router = express.Router();
const { getDownloads, createDownload, updateDownload, deleteDownload, incrementDownload } = require('../controllers/downloadController');
const { protect, mediaManagerPlus, adminOnly } = require('../middleware/auth');
const { uploadDoc } = require('../middleware/upload');

router.get('/', getDownloads);
router.post('/:id/increment', incrementDownload);
router.post('/', protect, mediaManagerPlus, uploadDoc.single('file'), createDownload);
router.put('/:id', protect, mediaManagerPlus, updateDownload);
router.delete('/:id', protect, adminOnly, deleteDownload);

module.exports = router;
