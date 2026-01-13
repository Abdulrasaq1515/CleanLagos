const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    sparse: true,
    lowercase: true
  },
  fullName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['citizen', 'psp', 'recycler', 'lawma_admin', 'system_admin'],
    default: 'citizen'
  },
  address: {
    type: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  points: {
    type: Number,
    default: 0
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  verificationCode: {
    type: String
  },
  verificationExpires: {
    type: Date
  },
  fcmToken: {
    type: String
  }
}, {
  timestamps: true
});

// Index for location-based queries
userSchema.index({ location: '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);