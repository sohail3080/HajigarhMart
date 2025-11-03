# API Documentation - HajigarhMart Rural E-Commerce Platform

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication
All protected routes require JWT token in Authorization header:
```http
Authorization: Bearer <your_jwt_token>
```

---

## 👤 User Management

### Register User

**Customer Registration:**
```http
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "customer",
  "address": {
    "street": "123 Main St",
    "city": "Hajigarh",
    "state": "State",
    "pincode": "123456",
    "coordinates": {
      "latitude": 28.7041,
      "longitude": 77.1025
    }
  }
}
```

**Shop Owner Registration:**
```http
POST /users/register
Content-Type: application/json

{
  "name": "Shop Owner Name",
  "email": "owner@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "shop_owner",
  "address": {
    "street": "Market Street",
    "city": "Hajigarh",
    "state": "State",
    "pincode": "123456",
    "coordinates": {
      "latitude": 28.7041,
      "longitude": 77.1025
    }
  }
}

Note: Shop owner needs admin approval. approvalStatus will be 'pending'
```

**Delivery Personnel Registration:**
```http
POST /users/register
Content-Type: application/json

{
  "name": "Delivery Person Name",
  "email": "delivery@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "delivery",
  "vehicleType": "bike",  // Required: bike, scooter, bicycle, car, other
  "vehicleNumber": "DL01AB1234",
  "drivingLicense": "DL1234567890",
  "address": {
    "street": "Home Address",
    "city": "Hajigarh",
    "state": "State",
    "pincode": "123456",
    "coordinates": {
      "latitude": 28.7041,
      "longitude": 77.1025
    }
  }
}

Note: Delivery personnel needs admin approval. approvalStatus will be 'pending'
```

**Success Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "customer",
      "approvalStatus": "approved",  // or "pending" for shop_owner/delivery
      "address": { ... },
      "vehicleType": "bike"  // Only for delivery personnel
    },
    "token": "jwt_token_here"
  }
}
```

### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (Approved User):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "customer",
      "approvalStatus": "approved",
      "address": { ... },
      "shop": "shop_id",  // Only for shop_owner with approved shop
      "avatar": "avatar_url",
      "vehicleType": "bike",  // Only for delivery personnel
      "isAvailable": true  // Only for delivery personnel
    },
    "token": "jwt_token_here"
  }
}
```

**Response for Pending Approval (Shop Owner/Delivery):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "shop_owner",
      "approvalStatus": "pending"
    },
    "token": "jwt_token_here",
    "message": "Your account is pending approval from admin"
  }
}
```

**Error Response (Rejected Account):**
```json
{
  "success": false,
  "error": "Your account has been rejected. Reason: Incomplete documentation"
}
```

---

## 🏪 Shop Management

### Register Shop (Shop Owner)
```http
POST /shops
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Local Grocery Store",
  "description": "Fresh vegetables and groceries",
  "category": "Grocery",  // Grocery, Medical, Electronics, etc.
  "phone": "9876543210",
  "email": "shop@example.com",
  "address": {
    "street": "Market Road",
    "city": "Hajigarh",
    "state": "State",
    "pincode": "123456",
    "landmark": "Near Post Office",
    "coordinates": {
      "latitude": 28.7041,
      "longitude": 77.1025
    }
  },
  "timings": {
    "openTime": "09:00",
    "closeTime": "21:00",
    "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  }
}
```

### Get Nearby Shops
```http
GET /shops/nearby?latitude=28.7041&longitude=77.1025&radius=10

Response: {
  "success": true,
  "data": {
    "shops": [ ... ],
    "count": 5
  }
}
```

---

## 📦 Product Management

### Create Product (Shop Owner)
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Fresh Tomatoes",
  "description": "Locally grown fresh tomatoes",
  "price": 50,
  "discountPrice": 45,
  "category": "Groceries",
  "stock": 100,
  "unit": "kg",
  "minOrderQuantity": 1,
  "maxOrderQuantity": 50,
  "images": [
    {
      "public_id": "img_123",
      "url": "https://example.com/image.jpg"
    }
  ]
}
```

### Get Shop Products
```http
GET /products/shop/:shopId?page=1&limit=20&search=tomato&category=Groceries
```

---

## 🛒 Order Management

### Create Order (Customer)
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shop": "shop_id",
  "items": [
    {
      "product": "product_id",
      "quantity": 2
    }
  ],
  "deliveryAddress": {
    "street": "123 Home St",
    "city": "Hajigarh",
    "state": "State",
    "pincode": "123456",
    "landmark": "Near Temple",
    "coordinates": {
      "latitude": 28.7041,
      "longitude": 77.1025
    }
  },
  "contactPhone": "9876543210",
  "paymentMethod": "cod",  // cod or online
  "specialInstructions": "Ring the doorbell twice"
}

Response: {
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderNumber": "ORD1234567890",
    "orderStatus": "placed",
    "pricing": {
      "itemsTotal": 100,
      "deliveryFee": 30,
      "platformFee": 2,
      "tax": 5,
      "total": 137
    },
    ...
  }
}
```

### Get Customer Orders
```http
GET /orders/my-orders?page=1&limit=10&status=placed

Response: {
  "success": true,
  "data": {
    "orders": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

### Update Order Status (Shop Owner)
```http
PATCH /orders/:orderId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed",  // placed, confirmed, preparing, ready, etc.
  "note": "Order is being prepared"
}
```

### Cancel Order
```http
PATCH /orders/:orderId/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Customer requested cancellation"
}
```

---

## 🚚 Delivery Management

### Assign Delivery (Shop Owner/Admin)
```http
PATCH /orders/:orderId/assign-delivery
Authorization: Bearer <token>
Content-Type: application/json

{
  "deliveryPersonId": "delivery_person_id"
}
```

### Accept Delivery (Delivery Personnel)
```http
PATCH /deliveries/:deliveryId/accept
Authorization: Bearer <token>
```

### Reject Delivery (Delivery Personnel)
```http
PATCH /deliveries/:deliveryId/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Too far from current location"
}
```

### Update Delivery Status (Delivery Personnel)
```http
PATCH /deliveries/:deliveryId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "picked_up",  // accepted, arrived_at_shop, picked_up, in_transit, arrived, delivered
  "note": "Picked up from shop"
}
```

### Update Location (Delivery Personnel)
```http
PATCH /deliveries/:deliveryId/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 28.7041,
  "longitude": 77.1025
}
```

### Complete Delivery (Delivery Personnel)
```http
PATCH /deliveries/:deliveryId/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "verificationCode": "1234",
  "proofOfDelivery": {
    "signature": "base64_signature",
    "photo": "image_url"
  }
}
```

### Toggle Availability (Delivery Personnel)
```http
PATCH /deliveries/toggle-availability
Authorization: Bearer <token>

Response: {
  "success": true,
  "data": {
    "isAvailable": true
  }
}
```

---

## ⭐ Review System

### Create Review (Customer)
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "order": "order_id",
  "reviewType": "shop",  // shop, product, or delivery
  "rating": 5,
  "comment": "Great service and quality products!",
  "product": "product_id"  // Only for product reviews
}
```

### Get Shop Reviews
```http
GET /reviews/shop/:shopId?page=1&limit=10
```

### Respond to Review (Shop Owner)
```http
POST /reviews/:reviewId/respond
Authorization: Bearer <token>
Content-Type: application/json

{
  "comment": "Thank you for your feedback!"
}
```

---

## 👨‍💼 Admin Operations

### Get Dashboard Statistics
```http
GET /admin/dashboard
Authorization: Bearer <admin_token>

Response: {
  "success": true,
  "data": {
    "users": {
      "customers": 150,
      "shopOwners": 25,
      "deliveryPersonnel": 30
    },
    "shops": {
      "total": 25,
      "pending": 3
    },
    "orders": {
      "total": 500,
      "active": 45,
      "completed": 420
    },
    "revenue": {
      "totalRevenue": 50000,
      "totalPlatformFees": 1200
    }
  }
}
```

### Get Pending Approvals
```http
GET /admin/approvals
Authorization: Bearer <admin_token>

Response: {
  "success": true,
  "data": {
    "shops": [ ... ],
    "users": [ ... ]
  }
}
```

### Approve Shop/User
```http
PATCH /admin/users/:userId/approve
PATCH /shops/:shopId/approve
Authorization: Bearer <admin_token>
```

### Reject Shop/User
```http
PATCH /admin/users/:userId/reject
PATCH /shops/:shopId/reject
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "reason": "Incomplete documentation"
}
```

### Get Financial Reports
```http
GET /admin/reports/financial?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <admin_token>
```

### Update Shop Commission
```http
PATCH /admin/shops/:shopId/commission
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "commission": 7  // Percentage
}
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 📱 Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🔄 Order Status Flow

```
placed → confirmed → preparing → ready → assigned → picked_up → out_for_delivery → delivered
                                                                               ↓
                                                                          cancelled
```

## 🚚 Delivery Status Flow

```
assigned → accepted → arrived_at_shop → picked_up → in_transit → arrived → delivered
              ↓
          rejected
              ↓
            failed
```

---

## 🌍 Geolocation Notes

- Coordinates format: `[longitude, latitude]` for MongoDB
- API format: `{ latitude: number, longitude: number }`
- Distance calculation uses haversine formula
- Radius in kilometers

---

## 💡 Best Practices for Frontend

1. **Store JWT token securely** (AsyncStorage in React Native)
2. **Include token in all protected requests**
3. **Handle token expiration** (redirect to login)
4. **Implement real-time location updates** for delivery tracking
5. **Cache nearby shops** for better performance
6. **Implement pull-to-refresh** for order lists
7. **Show loading states** during API calls
8. **Handle offline scenarios** gracefully
9. **Validate input** before sending to API
10. **Use pagination** for long lists

---

## 🔔 Suggested Push Notifications

- **For Customers**: Order confirmed, delivery assigned, out for delivery, delivered
- **For Shop Owners**: New order, order cancelled, review received
- **For Delivery Personnel**: New delivery assigned, delivery accepted by another person
- **For Admin**: New shop registration, new delivery personnel registration

---

## 📞 Support

For API issues or questions, contact: support@hajigarhmart.com

