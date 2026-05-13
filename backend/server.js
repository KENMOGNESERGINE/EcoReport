require('dotenv').config();

const express = require('express');//creates our HTTP server handles routes and requests
const cors = require('cors');//Allows React Native app to talk to this server
const helmet = require('helmet');//adds security headers protects against common attacks
const morgan = require('morgan');//logs every request so we can see what is happening
const authRoutes = require('./src/modules/auth/auth.routes');
const { createUsersTable } = require('./src/modules/auth/auth.model');


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


createUsersTable().then(() => {
  console.log('✅ Users table ready');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app;