const mongoose = require('mongoose');

// Handle MongoDB connection for serverless (Vercel)
let isConnected = false;

const connectDB = async () => {
  // If already connected, return
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  try {
    // Mongoose connection options for serverless
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000, // Close sockets after 45s
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    isConnected = conn.connections[0].readyState === 1;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    
    // Don't exit process in serverless environment
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;

