const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./backend/config/db');
const appointmentRoutes = require('./backend/routes/appointments');
const { errorHandler, notFoundHandler } = require('./backend/middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      database: 'Connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'ERROR', 
      message: 'Server is running but database is unreachable',
      timestamp: new Date().toISOString(),
    });
  }
});

// Routes
app.use('/api/appointments', appointmentRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use(notFoundHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});