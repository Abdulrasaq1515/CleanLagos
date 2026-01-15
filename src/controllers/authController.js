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
    
    // FOR DEVELOPMENT: Log verification code to console
    console.log('📱 ========================================');
    console.log('📱 VERIFICATION CODE FOR TESTING');
    console.log('📱 ========================================');
    console.log(`📱 Phone: ${phone}`);
    console.log(`📱 Code: ${verificationCode}`);
    console.log('📱 ========================================');

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your phone.',
      userId: user._id,
      // FOR DEVELOPMENT ONLY: Include code in response (remove in production!)
      verificationCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined
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

// @desc    Register admin user (no phone verification required)
// @route   POST /api/auth/register-admin
// @access  Public (but validates admin role)
exports.registerAdmin = async (req, res) => {
  try {
    console.log('📝 Admin registration request:', req.body);
    
    const { phone, password, fullName, email, role } = req.body;

    // Validate role is admin
    if (!['lawma_admin', 'system_admin'].includes(role)) {
      console.log('❌ Invalid role:', role);
      return res.status(400).json({ 
        message: 'Invalid role. Only lawma_admin or system_admin allowed.' 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ phone });
    if (userExists) {
      console.log('❌ Phone already exists:', phone);
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // Check if email exists (if provided)
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        console.log('❌ Email already exists:', email);
        return res.status(400).json({ message: 'Email already registered' });
      }
    }

    console.log('✅ Creating admin user...');
    
    // Create admin user with verified phone
    const user = await User.create({
      phone,
      password,
      fullName,
      email,
      role,
      isPhoneVerified: true, // Auto-verify admin accounts
      isActive: true
    });

    console.log('✅ Admin user created:', user._id);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Admin registration successful',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Admin registration error:', error);
    res.status(500).json({ message: error.message });
  }
};