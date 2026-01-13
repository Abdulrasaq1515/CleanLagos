const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createReport,
  getReports,
  assignReport,
  updateStatus
} = require('../controllers/wasteReportController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Citizen routes
router.post('/', protect, authorize('citizen'), upload.array('images', 5), createReport);
router.get('/', protect, getReports);

// LAWMA Admin routes
router.post('/:id/assign', protect, authorize('lawma_admin'), assignReport);

// PSP Worker routes
router.put('/:id/status', protect, authorize('psp'), upload.array('proof', 5), updateStatus);

module.exports = router;