const express = require('express');
const router = express.Router();
const { getPrograms, getProgram, createProgram, updateProgram, deleteProgram, getProgramStats } = require('../controllers/programController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getPrograms);
router.get('/stats', getProgramStats);
router.get('/:id', getProgram);
router.post('/', protect, adminOnly, createProgram);
router.put('/:id', protect, adminOnly, updateProgram);
router.delete('/:id', protect, adminOnly, deleteProgram);

module.exports = router;
