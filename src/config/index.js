module.exports = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  mongoUri: process.env.MONGODB_URI,
  
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  
  // Cookie Configuration
  cookieExpire: process.env.COOKIE_EXPIRE || 30,
  
  // Email Configuration
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpEmail: process.env.SMTP_EMAIL,
  smtpPassword: process.env.SMTP_PASSWORD,
  fromEmail: process.env.FROM_EMAIL,
  fromName: process.env.FROM_NAME,
  
  // File Upload Configuration
  maxFileUpload: process.env.MAX_FILE_UPLOAD || 1000000, // 1MB
  fileUploadPath: process.env.FILE_UPLOAD_PATH || './public/uploads',
  
  // Pagination
  defaultPageSize: 10,
  maxPageSize: 100,
};

