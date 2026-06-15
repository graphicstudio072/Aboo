const express = require('express');
const router = express.Router();
const { getResults, getResult, createResult, updateResult, deleteResult, publishResult, unpublishResult, bulkCreateResults, getChampionship } = require('../controllers/resultController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes (auth checked inside controller for published filter)
router.get('/', getResults);
router.get('/championship', getChampionship);
router.get('/:id', getResult);

// Protected routes
router.post('/', protect, adminOnly, createResult);
router.post('/bulk', protect, adminOnly, bulkCreateResults);
router.put('/:id', protect, adminOnly, updateResult);
router.put('/:id/publish', protect, adminOnly, publishResult);
router.put('/:id/unpublish', protect, adminOnly, unpublishResult);
router.delete('/:id', protect, adminOnly, deleteResult);

module.exports = router;
