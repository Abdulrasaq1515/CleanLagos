const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { phone, password, fullName, email, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      phone,
      password,
      fullName,
      email,
      role: role || 'citizen'
    });

    // Generate verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    user.verificationCode = verificationCode;
    user.verificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // TODO: Send SMS with verification code
    // await sendVerificationSMS(phone, verificationCode);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your phone.',
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify phone number
// @route   POST /api/auth/verify-phone
// @access  Public
exports.verifyPhone = async (req, res) => {
  try {
    const { phone, code } = req.body;

    const user = await User.findOne({ 
      phone,
      verificationCode: code,
      verificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    user.isPhoneVerified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        points: user.points
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isPhoneVerified) {
      return res.status(401).json({ message: 'Please verify your phone number first' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        points: user.points
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};