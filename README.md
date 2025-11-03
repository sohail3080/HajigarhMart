# HajigarhMart Backend API

A professional Node.js/Express backend API for HajigarhMart E-commerce Platform with MongoDB.

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # Database connection
│   │   └── index.js         # App configuration
│   ├── constants/           # Application constants
│   │   └── index.js         # Constants definitions
│   ├── controllers/         # Route controllers
│   │   ├── user.controller.js
│   │   └── product.controller.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # Authentication & authorization
│   │   ├── asyncHandler.js  # Async error handler
│   │   ├── errorHandler.js  # Global error handler
│   │   └── notFound.js      # 404 handler
│   ├── models/              # Database models
│   │   ├── User.model.js
│   │   └── Product.model.js
│   ├── routes/              # API routes
│   │   ├── index.js         # Main router
│   │   ├── user.routes.js
│   │   └── product.routes.js
│   ├── services/            # Business logic
│   │   ├── user.service.js
│   │   └── product.service.js
│   ├── utils/               # Utility functions
│   │   ├── apiFeatures.js   # API features (search, filter, etc.)
│   │   ├── errorResponse.js # Custom error class
│   │   ├── logger.js        # Winston logger
│   │   └── responseHandler.js # Response helpers
│   ├── validators/          # Input validation
│   │   ├── user.validator.js
│   │   └── product.validator.js
│   └── server.js            # App entry point
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore file
├── package.json             # Dependencies & scripts
└── README.md                # Documentation
```

## 🚀 Features

- **RESTful API** design
- **MVC Architecture** with service layer
- **JWT Authentication** & Role-based authorization
- **MongoDB** with Mongoose ODM
- **Input Validation** with express-validator
- **Error Handling** centralized error handling
- **Security** with Helmet.js
- **Logging** with Winston and Morgan
- **CORS** enabled
- **Environment Configuration** with dotenv

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` file with your configuration:
- Set your MongoDB URI
- Set a secure JWT secret
- Configure other environment variables as needed

4. **Create logs directory** (optional, will be created automatically)
```bash
mkdir logs
```

## 🏃 Running the Application

### Development mode (with auto-reload)
```bash
npm run dev
```

### Production mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or your specified PORT)

## 📚 API Endpoints

### Health Check
```
GET /health - Check server status
```

### User Routes
```
POST   /api/users/register   - Register new user
POST   /api/users/login      - Login user
GET    /api/users/me         - Get current user (Protected)
PUT    /api/users/profile    - Update user profile (Protected)
GET    /api/users            - Get all users (Admin)
DELETE /api/users/:id        - Delete user (Admin)
```

### Product Routes
```
GET    /api/products         - Get all products (Public)
GET    /api/products/:id     - Get single product (Public)
POST   /api/products         - Create product (Admin)
PUT    /api/products/:id     - Update product (Admin)
DELETE /api/products/:id     - Delete product (Admin)
POST   /api/products/:id/reviews - Add product review (Protected)
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Helmet.js for security headers
- Input validation and sanitization
- CORS configuration
- Error handling without exposing sensitive data

## 📦 Key Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT implementation
- **express-validator**: Input validation
- **helmet**: Security headers
- **cors**: CORS middleware
- **dotenv**: Environment variables
- **morgan**: HTTP request logger
- **winston**: Application logger

## 🏗️ Architecture Patterns

### Controllers
Handle HTTP requests and responses. They receive requests, call appropriate services, and send responses.

### Services
Contain business logic and interact with models. Keep controllers thin and services fat.

### Models
Define database schemas and model methods using Mongoose.

### Middleware
Handle cross-cutting concerns like authentication, error handling, and logging.

### Validators
Validate and sanitize user input before it reaches controllers.

### Utils
Reusable utility functions and helpers.

## 🧪 Testing

```bash
npm test
```

(Add your test framework and configure tests as needed)

## 📝 Environment Variables

See `.env.example` for all available environment variables and their descriptions.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

[Your Name]

## 🙏 Acknowledgments

- Express.js team
- MongoDB & Mongoose
- All contributors

---

**Note**: Remember to change the JWT_SECRET and other sensitive information in production!

