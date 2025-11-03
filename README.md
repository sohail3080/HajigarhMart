# HajigarhMart Backend API - Rural E-Commerce & Delivery Platform

A comprehensive Node.js/Express backend API for a rural e-commerce and delivery platform designed for areas where major companies haven't established presence. Built with MongoDB, featuring four distinct user roles and complete order management with real-time delivery tracking.

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # ⚙️ Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   └── index.js         # App configuration
│   │
│   ├── constants/           # 📋 Application constants
│   │   └── index.js         # User roles, order statuses, delivery statuses, etc.
│   │
│   ├── controllers/         # 🎮 Route controllers (handle HTTP requests)
│   │   ├── user.controller.js       # User authentication & profile
│   │   ├── shop.controller.js       # Shop management
│   │   ├── product.controller.js    # Product CRUD
│   │   ├── order.controller.js      # Order management
│   │   ├── delivery.controller.js   # Delivery operations
│   │   ├── review.controller.js     # Reviews & ratings
│   │   └── admin.controller.js      # Admin dashboard & analytics
│   │
│   ├── middleware/          # 🔧 Custom middleware
│   │   ├── auth.js          # JWT authentication & role-based authorization
│   │   ├── asyncHandler.js  # Async error wrapper
│   │   ├── errorHandler.js  # Global error handler
│   │   └── notFound.js      # 404 handler
│   │
│   ├── models/              # 📊 Database models (Mongoose schemas)
│   │   ├── User.model.js        # Users (4 roles: admin, shop_owner, customer, delivery)
│   │   ├── Shop.model.js        # Shops with geolocation
│   │   ├── Product.model.js     # Products
│   │   ├── Order.model.js       # Orders with status tracking
│   │   ├── Delivery.model.js    # Delivery assignments & tracking
│   │   ├── Review.model.js      # Reviews (shop, product, delivery)
│   │   └── Transaction.model.js # Financial transactions
│   │
│   ├── routes/              # 🛣️ API routes
│   │   ├── index.js         # Main router
│   │   ├── user.routes.js   # User endpoints
│   │   ├── shop.routes.js   # Shop endpoints
│   │   ├── product.routes.js # Product endpoints
│   │   ├── order.routes.js  # Order endpoints
│   │   ├── delivery.routes.js # Delivery endpoints
│   │   ├── review.routes.js # Review endpoints
│   │   └── admin.routes.js  # Admin endpoints
│   │
│   ├── services/            # 💼 Business logic layer
│   │   ├── user.service.js      # User business logic
│   │   ├── shop.service.js      # Shop operations
│   │   ├── product.service.js   # Product operations
│   │   ├── order.service.js     # Order processing
│   │   ├── delivery.service.js  # Delivery management
│   │   ├── review.service.js    # Review handling
│   │   └── admin.service.js     # Admin analytics
│   │
│   ├── utils/               # 🛠️ Utility functions
│   │   ├── apiFeatures.js       # Search, filter, pagination
│   │   ├── errorResponse.js     # Custom error class
│   │   ├── logger.js            # Winston logger
│   │   └── responseHandler.js   # Standardized responses
│   │
│   ├── validators/          # ✅ Input validation (express-validator)
│   │   ├── user.validator.js
│   │   ├── shop.validator.js
│   │   ├── product.validator.js
│   │   ├── order.validator.js
│   │   └── review.validator.js
│   │
│   └── server.js            # 🚀 Application entry point
│
├── public/uploads/          # 📁 File upload directory
├── logs/                    # 📝 Application logs
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies & scripts
└── README.md               # Complete documentation
```

## 🎯 Platform Overview

### Four User Roles

1. **Admin (Platform Owner)**
   - Manage all shops, users, and platform operations
   - Approve/reject shop and delivery personnel registrations
   - Monitor financial transactions and commissions
   - View comprehensive analytics and reports
   - Manage commission rates

2. **Shop Owners**
   - Register and manage their shops
   - List and manage products with inventory
   - Receive and process customer orders
   - Track order status and deliveries
   - View sales analytics and revenue reports
   - Respond to customer reviews

3. **Customers (Buyers)**
   - Browse nearby shops and products
   - Place orders with multiple payment options (COD/Online)
   - Track order and delivery status in real-time
   - Rate and review shops, products, and delivery personnel
   - Manage delivery addresses

4. **Delivery Personnel**
   - Register as delivery partners
   - Accept/reject delivery assignments
   - Update delivery status in real-time
   - Provide live location tracking
   - View delivery history and earnings
   - Toggle availability status

## 🚀 Key Features

### Technical Features
- **RESTful API** design with proper HTTP methods
- **MVC Architecture** with dedicated service layer
- **JWT Authentication** with role-based authorization
- **MongoDB** with Mongoose ODM and geospatial queries
- **Input Validation** with express-validator
- **Centralized Error Handling**
- **Security** with Helmet.js, CORS, and password hashing
- **Logging** with Winston and Morgan
- **Real-time Location** tracking for deliveries

### Business Features
- **Geolocation-based** shop discovery
- **Multi-step Order Tracking** (9 stages)
- **Delivery Management** with verification codes
- **Commission System** for platform revenue
- **Review & Rating System** (shops, products, deliveries)
- **Financial Analytics** and reporting
- **Approval Workflow** for shops and delivery personnel
- **Stock Management** with automatic inventory updates

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

### 👤 User Routes (`/api/users`)
```
POST   /register            - Register new user (customer/shop_owner/delivery)
POST   /login               - Login user
GET    /me                  - Get current user (Protected)
PUT    /profile             - Update user profile (Protected)
GET    /                    - Get all users (Admin)
DELETE /:id                 - Delete user (Admin)
```

### 🏪 Shop Routes (`/api/shops`)
```
# Public
GET    /                    - Get all shops (with filters)
GET    /nearby              - Get nearby shops (requires lat/long)
GET    /:id                 - Get single shop details

# Shop Owner
POST   /                    - Register new shop (Shop Owner)
PUT    /:id                 - Update shop details (Shop Owner)
PATCH  /:id/toggle-status   - Toggle shop open/close (Shop Owner)
GET    /:id/stats           - Get shop statistics (Shop Owner)

# Admin
PATCH  /:id/approve         - Approve shop (Admin)
PATCH  /:id/reject          - Reject shop with reason (Admin)
DELETE /:id                 - Delete shop (Admin)
```

### 📦 Product Routes (`/api/products`)
```
# Public
GET    /                    - Get all products (with filters)
GET    /shop/:shopId        - Get products by shop
GET    /:id                 - Get single product

# Shop Owner
POST   /                    - Create product (Shop Owner)
PUT    /:id                 - Update product (Shop Owner)
DELETE /:id                 - Delete product (Shop Owner)
```

### 🛒 Order Routes (`/api/orders`)
```
# Customer
POST   /                    - Create new order (Customer)
GET    /my-orders           - Get customer's orders (Customer)

# Shop Owner
GET    /shop-orders         - Get shop orders (Shop Owner)
PATCH  /:id/status          - Update order status (Shop Owner/Admin)
PATCH  /:id/assign-delivery - Assign delivery person (Shop Owner/Admin)

# Common
GET    /:id                 - Get single order details (Protected)
PATCH  /:id/cancel          - Cancel order (Customer/Shop/Admin)

# Admin
GET    /                    - Get all orders (Admin)
```

### 🚚 Delivery Routes (`/api/deliveries`)
```
# Delivery Personnel
GET    /my-deliveries       - Get assigned deliveries (Delivery)
GET    /stats               - Get delivery statistics (Delivery)
PATCH  /toggle-availability - Toggle availability (Delivery)
PATCH  /:id/accept          - Accept delivery (Delivery)
PATCH  /:id/reject          - Reject delivery with reason (Delivery)
PATCH  /:id/status          - Update delivery status (Delivery)
PATCH  /:id/location        - Update current location (Delivery)
PATCH  /:id/complete        - Complete delivery (Delivery)

# Common
GET    /:id                 - Get delivery details (Protected)

# Admin
GET    /                    - Get all deliveries (Admin)
```

### ⭐ Review Routes (`/api/reviews`)
```
# Public
GET    /shop/:shopId        - Get shop reviews
GET    /product/:productId  - Get product reviews
GET    /delivery/:deliveryPersonId - Get delivery person reviews

# Customer
POST   /                    - Create review (Customer)
PUT    /:id                 - Update review (Customer)
DELETE /:id                 - Delete review (Customer/Admin)

# Shop Owner
POST   /:id/respond         - Respond to review (Shop Owner)

# Authenticated
PATCH  /:id/helpful         - Mark review as helpful (Protected)
```

### 👨‍💼 Admin Routes (`/api/admin`)
```
GET    /dashboard           - Get dashboard statistics (Admin)
GET    /approvals           - Get pending approvals (Admin)
PATCH  /users/:id/approve   - Approve user (Admin)
PATCH  /users/:id/reject    - Reject user (Admin)
GET    /reports/financial   - Get financial reports (Admin)
GET    /analytics           - Get platform analytics (Admin)
PATCH  /shops/:id/commission - Update shop commission rate (Admin)
```

## 🔐 Authentication & Authorization

### Authentication
The API uses JWT (JSON Web Tokens) for authentication. After login or registration, include the token in all protected routes:

```http
Authorization: Bearer <your_jwt_token>
```

### User Roles & Permissions

| Role | Permissions |
|------|------------|
| **Admin** | Full platform access, approve/reject registrations, view all data, manage commissions |
| **Shop Owner** | Manage own shop, products, and orders; view analytics; respond to reviews |
| **Customer** | Browse shops, place orders, track deliveries, write reviews |
| **Delivery** | Accept/reject deliveries, update status, track earnings |

### Approval Workflow
- **Shop Owners** and **Delivery Personnel** require admin approval after registration
- Status: `pending` → `approved` or `rejected`
- Users with `pending` or `rejected` status cannot access protected features

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
Handle HTTP requests and responses. They receive requests, call appropriate services, and send standardized responses.

### Services
Contain all business logic and interact with models. This keeps controllers thin and maintains separation of concerns. Services handle:
- Data validation and processing
- Complex business rules
- Database operations
- Integration with other services

### Models
Define database schemas using Mongoose with:
- Field validation and constraints
- Virtual fields and methods
- Pre/post hooks for data processing
- Instance and static methods

### Middleware
Handle cross-cutting concerns:
- **Authentication**: JWT token verification
- **Authorization**: Role-based access control
- **Error Handling**: Centralized error processing
- **Logging**: Request/response logging

### Validators
Use express-validator to:
- Validate user input
- Sanitize data
- Provide clear error messages
- Prevent injection attacks

### Utils
Reusable helper functions for:
- Response formatting
- Error handling
- API features (search, filter, pagination)
- Logging

## 🔄 Order & Delivery Flow

### Order Lifecycle
```
1. placed          → Customer places order
2. confirmed       → Shop confirms the order
3. preparing       → Shop is preparing items
4. ready           → Order ready for pickup
5. assigned        → Delivery person assigned
6. picked_up       → Delivery person picked up order
7. out_for_delivery → On the way to customer
8. delivered       → Successfully delivered
   OR cancelled    → Order cancelled
```

### Delivery Lifecycle
```
1. assigned         → Delivery assigned to personnel
2. accepted         → Delivery person accepts
   OR rejected      → Delivery person rejects
3. arrived_at_shop  → Reached shop location
4. picked_up        → Picked up order from shop
5. in_transit       → On the way to customer
6. arrived          → Reached customer location
7. delivered        → Delivery completed
   OR failed        → Delivery failed
```

## 💰 Revenue Model

### Commission Structure
- **Platform Fee**: 2% on all orders
- **Shop Commission**: 5% (default, adjustable by admin)
- **Delivery Fee Split**: 80% to delivery person, 20% to platform
- **Tax**: 5% on order value

### Example Calculation
```
Order Value: ₹1000
Delivery Fee: ₹30
Tax (5%): ₹50
Platform Fee (2%): ₹20

Customer Pays: ₹1100
Shop Receives: ₹1000 - ₹50 (commission) = ₹950
Platform Earns: ₹50 + ₹20 + ₹6 = ₹76
Delivery Person: ₹24
```

## 🧪 Testing

```bash
npm test
```

(Add your test framework and configure tests as needed)

## 📝 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hajigarhmart

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRE=30d

# Cookie Configuration
COOKIE_EXPIRE=30

# Email Configuration (for password reset, notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@hajigarhmart.com
FROM_NAME=HajigarhMart

# File Upload Configuration
MAX_FILE_UPLOAD=1000000
FILE_UPLOAD_PATH=./public/uploads

# Logging
LOG_LEVEL=info
```

⚠️ **Important**: Never commit `.env` file to version control!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🎨 Frontend Integration (Expo App)

This backend is designed to work with an Expo/React Native mobile application. Key integration points:

### Real-time Features
- Use WebSockets or polling for delivery location tracking
- Push notifications for order status updates
- Live shop availability status

### Geolocation
- Get user's current location for nearby shop discovery
- Calculate distance for delivery fees
- Map integration for delivery tracking

### Payment Integration
- Integrate payment gateways (Razorpay, Stripe, etc.)
- Handle COD payments
- Manage transaction callbacks

## 🔒 Security Best Practices

- ✅ Passwords hashed with bcrypt (salt rounds: 10)
- ✅ JWT tokens for stateless authentication
- ✅ Role-based access control (RBAC)
- ✅ Input validation and sanitization
- ✅ MongoDB injection prevention
- ✅ CORS configuration
- ✅ Helmet.js for security headers
- ✅ Rate limiting (recommended for production)
- ✅ HTTPS in production (recommended)

## 🚀 Deployment Recommendations

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set up MongoDB Atlas or managed database
- [ ] Configure proper CORS origins
- [ ] Enable rate limiting
- [ ] Set up monitoring (PM2, New Relic, etc.)
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Enable database indexes for performance

### Suggested Platforms
- **Backend**: Heroku, AWS EC2, DigitalOcean, Render
- **Database**: MongoDB Atlas, AWS DocumentDB
- **File Storage**: AWS S3, Cloudinary
- **Mobile App**: Expo EAS, Google Play, Apple App Store

## 📊 Database Indexes (Performance Optimization)

Add these indexes for better performance:

```javascript
// In production, create these indexes
User: { email: 1, phone: 1, role: 1 }
Shop: { 'address.coordinates': '2dsphere', approvalStatus: 1, category: 1 }
Product: { shop: 1, isActive: 1, category: 1 }
Order: { customer: 1, shop: 1, orderStatus: 1, createdAt: -1 }
Delivery: { deliveryPerson: 1, status: 1, order: 1 }
Review: { shop: 1, product: 1, deliveryPerson: 1, isActive: 1 }
```

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Ensure MongoDB is running: `mongod --version`
- Check MONGODB_URI in `.env`
- Verify network connectivity

**JWT Token Invalid**
- Check JWT_SECRET is set correctly
- Verify token format: `Bearer <token>`
- Check token expiration

**CORS Errors**
- Update CORS configuration in `server.js`
- Verify frontend origin URL

**Geolocation Not Working**
- Ensure coordinates are in [longitude, latitude] format
- Check 2dsphere index is created on Shop model

## 📞 Support & Contributing

### How to Contribute
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Reporting Issues
- Use GitHub Issues
- Provide detailed description
- Include steps to reproduce
- Share error logs if applicable

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

HajigarhMart Development Team

## 🙏 Acknowledgments

- Express.js team
- MongoDB & Mongoose community
- All open-source contributors

---

**Built with ❤️ for rural communities** 🌾

**Note**: Remember to change all secrets and sensitive information in production!

