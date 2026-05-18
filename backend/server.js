require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./src/modules/auth/auth.routes');
const reportingRoutes = require('./src/modules/reporting/reporting.routes');
const { createUsersTable } = require('./src/modules/auth/auth.model');
const { createReportsTable } = require('./src/modules/reporting/reporting.model');
const startNotificationConsumer = require('./src/events/consumers/notification.consumer');

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
    startNotificationConsumer().catch(console.error);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });

module.exports = app;