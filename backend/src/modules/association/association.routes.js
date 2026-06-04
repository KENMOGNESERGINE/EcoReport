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

module.exports = router;