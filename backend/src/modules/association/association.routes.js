const express = require('express');
const router = express.Router();
const associationController = require('./association.controller');
const authMiddleware = require('../../middleware/auth');
const roleMiddleware = require('../../shared/role.middleware');

// All association routes protected
// Only association role can access!
router.use(authMiddleware);
router.use(roleMiddleware(['association']));

router.get(
  '/reports',
  associationController.getAreaReports
);

router.patch(
  '/reports/:reportId/status',
  associationController.updateReportStatus
);

router.get(
  '/stats',
  associationController.getAssociationStats
);

router.get(
  '/campaigns',
  associationController.getAssociationCampaigns
);

const profileController = require('./association.profile.controller');

// Profile routes
router.get(
  '/profile',
  profileController.getFullProfile
);

router.put(
  '/profile',
  profileController.updateProfile
);

router.post(
  '/profile/achievements',
  profileController.addAchievement
);

router.get(
  '/profile/achievements',
  profileController.getAchievements
);

module.exports = router;