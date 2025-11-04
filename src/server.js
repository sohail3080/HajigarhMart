const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const apiRoutes = require('./routes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Import database connection
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL, // Add your frontend URL in env variables
        /\.vercel\.app$/, // Allow all vercel preview deployments
      ]
    : '*', // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(helmet()); // Security headers
app.use(cors(corsOptions)); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check route (no authentication required)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'HajigarhMart Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      test: '/test',
      api: '/api',
      documentation: 'See README.md'
    }
  });
});

// Test route (no database needed)
app.get('/test', (req, res) => {
  res.status(200).json({
    message: 'Test endpoint working!',
    server: 'OK',
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
    }
  });
});

// API Routes
app.use('/api', apiRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server (only in development, not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export for Vercel serverless
module.exports = app;

