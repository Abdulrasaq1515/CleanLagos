const express = require('express');
const router = express.Router();
const { register, verifyPhone, login, getMe, registerAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/register-admin', registerAdmin);
router.post('/verify-phone', verifyPhone);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;