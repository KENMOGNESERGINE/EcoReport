const express = require('express');
const router = express.Router();
const reportingController = require('./reporting.controller');
const authMiddleware = require('../../middleware/auth');
const upload = require('../../shared/upload');



// PUBLIC routes
router.get('/', reportingController.getAllReports);
router.get('/nearby', reportingController.getNearbyReports);
router.get('/stats', reportingController.getReportStats);
router.get('/mine', authMiddleware, reportingController.getMyReports);
router.get('/:id', reportingController.getReportById);

// PROTECTED routes
router.post(
  '/',
  authMiddleware,
  upload.single('photo'),
  reportingController.createReportWithPhoto
);
router.put(
  '/:id',
  authMiddleware,
  reportingController.updateReport
);
router.patch(
  '/:id/status',
  authMiddleware,
  reportingController.updateReportStatus
);
router.delete(
  '/:id',
  authMiddleware,
  reportingController.deleteReport
);
router.post(
  '/:id/comments',
  authMiddleware,
  reportingController.addComment
);

router.get(
  '/:id/comments',
  reportingController.getComments
);

module.exports = router;