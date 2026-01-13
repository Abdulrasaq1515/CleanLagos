const WasteReport = require('../models/wasteReport');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Create waste report
// @route   POST /api/reports
// @access  Private (Citizen)
exports.createReport = async (req, res) => {
  try {
    const { title, description, location, address, category, severity } = req.body;
    
    const report = await WasteReport.create({
      reporter: req.user.id,
      title,
      description,
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      address,
      category,
      severity,
      images: req.files ? req.files.map(file => file.path) : []
    });

    // Emit real-time event via WebSocket
    if (req.io) {
      req.io.emit('report_created', {
        reportId: report._id,
        location: report.location,
        severity: report.severity
      });
    }

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all waste reports
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    
    // Citizens can only see their own reports
    if (req.user.role === 'citizen') {
      query.reporter = req.user.id;
    }

    const reports = await WasteReport.find(query)
      .populate('reporter', 'fullName phone')
      .populate('assignedTo', 'fullName')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await WasteReport.countDocuments(query);

    res.json({
      success: true,
      data: reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign waste report to PSP worker
// @route   POST /api/reports/:id/assign
// @access  Private (LAWMA Admin)
exports.assignReport = async (req, res) => {
  try {
    const { workerId, deadline } = req.body;

    const report = await WasteReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const worker = await User.findById(workerId);
    if (!worker || worker.role !== 'psp') {
      return res.status(400).json({ message: 'Invalid PSP worker' });
    }

    report.status = 'assigned';
    report.assignedTo = workerId;
    report.assignedAt = Date.now();
    await report.save();

    // Create task
    const task = await Task.create({
      wasteReport: report._id,
      assignedTo: workerId,
      assignedBy: req.user.id,
      deadline,
      status: 'pending'
    });

    // Emit real-time event
    if (req.io) {
      req.io.emit('report_status_changed', {
        reportId: report._id,
        status: report.status,
        assignedTo: workerId
      });
      
      // Send notification to specific worker
      req.io.to(`worker_${workerId}`).emit('notification_sent', {
        type: 'task_assigned',
        message: `New task assigned: ${report.title}`,
        taskId: task._id
      });
    }

    res.json({
      success: true,
      data: report,
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report status
// @route   PUT /api/reports/:id/status
// @access  Private
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await WasteReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Authorization checks
    if (req.user.role === 'citizen' && report.reporter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'psp' && report.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    report.status = status;
    
    if (status === 'completed') {
      report.completedAt = Date.now();
      report.completedBy = req.user.id;
      report.completionProof = req.files ? req.files.map(file => file.path) : [];
    }

    await report.save();

    // Emit real-time event
    if (req.io) {
      req.io.emit('report_status_changed', {
        reportId: report._id,
        status: report.status
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};