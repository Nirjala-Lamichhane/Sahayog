// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({ 
    error: 'Route not found' 
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};