const broker = require('../broker');
const rewardsService = require('../../modules/rewards/rewards.service');
const reportingModel = require('../../modules/reporting/reporting.model');

const startRewardsConsumer = async () => {
  console.log('Rewards consumer starting...');

  // Listen for report submitted
  await broker.consumeEvent(
    'report.submitted',
    async (data) => {
      try {
        await rewardsService.addPoints(
          data.userId,
          10,
          'Report submitted'
        );
        console.log(`✅ +10 points to user ${data.userId}`);
      } catch (error) {
        console.log('Rewards error:', error.message);
      }
    }
  );

  // Listen for report resolved
  await broker.consumeEvent(
    'report.status_changed',
    async (data) => {
      try {
        if (data.status === 'resolved') {
          const report = await reportingModel.getReportById(
            data.reportId
          );
          if (report && report.user_id) {
            await rewardsService.addPoints(
              report.user_id,
              20,
              'Your report was resolved!'
            );
            console.log(
              `✅ +20 points to user ${report.user_id}`
            );
          }
        }
      } catch (error) {
        console.log('Rewards error:', error.message);
      }
    }
  );

  // Listen for campaign joined
  await broker.consumeEvent(
    'campaign.joined',
    async (data) => {
      try {
        await rewardsService.addPoints(
          data.citizenId,
          5,
          'Joined a cleanup campaign!'
        );
        console.log(
          `✅ +5 points to user ${data.citizenId}`
        );
      } catch (error) {
        console.log('Rewards error:', error.message);
      }
    }
  );

  console.log('✅ Rewards consumer ready');
};

module.exports = startRewardsConsumer;