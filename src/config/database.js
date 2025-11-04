const mongoose = require('mongoose');

// Handle MongoDB connection for serverless (Vercel)
let isConnected = false;

const connectDB = async () => {
  // If already connected, return
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    throw new Error('❌ MONGODB_URI is not defined in environment variables');
  }

  try {
    // Mongoose connection options for serverless
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout after 10s (increased for serverless)
      socketTimeoutMS: 45000, // Close sockets after 45s
      maxPoolSize: 10, // Maximum number of connections
      minPoolSize: 1, // Minimum number of connections
    };

    console.log('🔄 Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    isConnected = conn.connections[0].readyState === 1;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error:`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    
    // Provide helpful error messages
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('   💡 Possible causes:');
      console.error('      - MongoDB URI is incorrect');
      console.error('      - Network connectivity issues');
    } else if (error.message.includes('Authentication failed')) {
      console.error('   💡 Possible causes:');
      console.error('      - Wrong database username or password');
      console.error('      - Database user doesn\'t have proper permissions');
    } else if (error.message.includes('timed out')) {
      console.error('   💡 Possible causes:');
      console.error('      - MongoDB Atlas IP whitelist doesn\'t include 0.0.0.0/0');
      console.error('      - Cluster is paused or inaccessible');
      console.error('      - Network firewall blocking connection');
    }
    
    // Don't exit process in serverless environment
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    } else {
      throw error; // Re-throw in production to be caught by error handlers
    }
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`📡 Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('📡 Mongoose disconnected from MongoDB');
  isConnected = false;
});

module.exports = connectDB;

