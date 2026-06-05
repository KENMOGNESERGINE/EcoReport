const express = require('express');
const router = express.Router();
const governmentController = require('./government.controller');
const authMiddleware = require('../../middleware/auth');
const roleMiddleware = require('../../shared/role.middleware');

// All government routes protected
// Only government role can access!
router.use(authMiddleware);
router.use(roleMiddleware(['government']));

router.get(
  '/reports',
  governmentController.getAllReports
);

router.get(
  '/stats',
  governmentController.getFullStats
);

router.get(
  '/hotspots',
  governmentController.getHotSpots
);

router.get(
  '/agents',
  governmentController.getAgents
);

router.get(
  '/monthly-stats',
  governmentController.getMonthlyStats
);

router.post(
  '/reports/:reportId/assign',
  governmentController.assignToAgent
);
const profileController = require('./government.profile.controller');

// Profile routes
router.get(
  '/profile',
  profileController.getFullProfile
);

router.put(
  '/profile',
  profileController.updateProfile
);
module.exports = router;