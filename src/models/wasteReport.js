const mongoose = require('mongoose');

const wasteReportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: {
    type: String
  },
  category: {
    type: String,
    enum: ['household', 'industrial', 'construction', 'medical', 'recyclable', 'other'],
    default: 'household'
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'completed', 'verified', 'rejected'],
    default: 'pending'
  },
  images: [{
    type: String
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationProof: [{
    type: String
  }],
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  pointsAwarded: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

wasteReportSchema.index({ location: '2dsphere' });
wasteReportSchema.index({ status: 1 });
wasteReportSchema.index({ reporter: 1 });
wasteReportSchema.index({ assignedTo: 1 });

module.exports = mongoose.model('WasteReport', wasteReportSchema);