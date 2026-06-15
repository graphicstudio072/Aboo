const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser, getUserStats } = require('../controllers/userController');
const { protect, superAdminOnly } = require('../middleware/auth');

router.use(protect, superAdminOnly);
router.get('/', getUsers);
router.get('/stats', getUserStats);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
