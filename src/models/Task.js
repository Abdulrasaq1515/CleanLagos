const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  wasteReport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteReport',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  deadline: {
    type: Date
  },
  acceptedAt: {
    type: Date
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  completionProof: [{
    type: String
  }],
  notes: {
    type: String
  },
  pointsReward: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ status: 1 });

module.exports = mongoose.model('Task', taskSchema);