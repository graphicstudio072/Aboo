const express = require('express');
const router = express.Router();
const { getSchedules, getSchedule, createSchedule, updateSchedule, deleteSchedule } = require('../controllers/scheduleController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getSchedules);
router.get('/:id', getSchedule);
router.post('/', protect, adminOnly, createSchedule);
router.put('/:id', protect, adminOnly, updateSchedule);
router.delete('/:id', protect, adminOnly, deleteSchedule);

module.exports = router;
