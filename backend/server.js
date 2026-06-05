require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./src/modules/auth/auth.routes');
const reportingRoutes = require('./src/modules/reporting/reporting.routes');
const campaignsRoutes = require('./src/modules/campaigns/campaigns.routes');
const rewardsRoutes = require('./src/modules/rewards/rewards.routes');
const governmentRoutes = require('./src/modules/government/government.routes');
const associationRoutes = require('./src/modules/association/association.routes');
const adminRoutes = require('./src/modules/admin/admin.routes');

const { createUsersTable } = require('./src/modules/auth/auth.model');
const { createReportsTable, createCampaignsTable } = require('./src/modules/reporting/reporting.model');
const startNotificationConsumer = require('./src/events/consumers/notification.consumer');
const startStatusConsumer = require('./src/events/consumers/status.consumer');
const startRewardsConsumer = require('./src/events/consumers/rewards.consumer');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'EcoReport API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportingRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/government', governmentRoutes);
app.use('/api/association', associationRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

createUsersTable()
  .then(() => {
    console.log('✅ Users table ready');
    return createReportsTable();
  })
  .then(() => {
    console.log('✅ Reports table ready');
    return createCampaignsTable();
  })
  .then(() => {
    console.log('✅ Campaigns table ready');
    startNotificationConsumer().catch(console.error);
    startStatusConsumer().catch(console.error);
    startRewardsConsumer().catch(console.error);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });

module.exports = app;