# HajigarhMart - Project Structure

## Overview
Rural E-Commerce & Delivery Platform built with Expo and React Native.

## Project Architecture

```
my-app/
├── app/                          # Expo Router screens
│   ├── _layout.tsx              # Root layout with navigation setup
│   ├── (auth)/                  # Authentication flow
│   │   ├── _layout.tsx         # Auth stack layout
│   │   ├── welcome.tsx         # Welcome/landing screen
│   │   ├── login.tsx           # Login screen
│   │   ├── register.tsx        # Registration screen
│   │   └── role-selection.tsx  # User role selection
│   │
│   ├── (customer)/              # Customer role screens
│   │   ├── _layout.tsx         # Customer tabs layout
│   │   ├── home.tsx            # Customer home/browse
│   │   ├── shops.tsx           # Browse shops
│   │   ├── orders.tsx          # Order history
│   │   ├── cart.tsx            # Shopping cart
│   │   └── profile.tsx         # Customer profile
│   │
│   ├── (shop)/                  # Shop Owner role screens
│   │   ├── _layout.tsx         # Shop tabs layout
│   │   ├── dashboard.tsx       # Shop dashboard
│   │   ├── products.tsx        # Product management
│   │   ├── orders.tsx          # Shop orders
│   │   ├── analytics.tsx       # Sales analytics
│   │   └── profile.tsx         # Shop profile
│   │
│   ├── (delivery)/              # Delivery Partner role screens
│   │   ├── _layout.tsx         # Delivery tabs layout
│   │   ├── dashboard.tsx       # Delivery dashboard
│   │   ├── deliveries.tsx      # Delivery list
│   │   ├── earnings.tsx        # Earnings & transactions
│   │   └── profile.tsx         # Delivery partner profile
│   │
│   └── (admin)/                 # Admin role screens
│       ├── _layout.tsx         # Admin tabs layout
│       ├── dashboard.tsx       # Admin dashboard
│       ├── shops.tsx           # Manage shops
│       ├── users.tsx           # Manage users
│       ├── orders.tsx          # All orders
│       └── settings.tsx        # Platform settings
│
├── components/                   # Reusable components
│   ├── ui/                      # UI primitives
│   │   ├── collapsible.tsx
│   │   ├── icon-symbol.tsx
│   │   └── icon-symbol.ios.tsx
│   ├── shared/                  # Shared components (TBD)
│   ├── customer/                # Customer-specific components (TBD)
│   ├── shop/                    # Shop-specific components (TBD)
│   ├── delivery/                # Delivery-specific components (TBD)
│   └── admin/                   # Admin-specific components (TBD)
│
├── services/                     # API services
│   └── api.service.ts           # Base API service
│
├── context/                      # React Context
│   └── AuthContext.tsx          # Authentication context
│
├── types/                        # TypeScript types
│   └── index.ts                 # All type definitions
│
├── utils/                        # Utility functions
│   ├── constants.ts             # App constants
│   └── helpers.ts               # Helper functions
│
├── hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
│
├── constants/                    # Theme constants
│   └── theme.ts
│
├── assets/                       # Static assets
│   └── images/
│
└── app.json                      # Expo configuration

```

## User Roles & Features

### 1. Customer
**Screens:**
- Home: Browse products and nearby shops
- Shops: View all shops and filter
- Orders: Track active and past orders
- Cart: Manage shopping cart
- Profile: View/edit profile, addresses

**Features:**
- Browse products by category
- Search shops and products
- Add items to cart
- Place orders (COD or Online)
- Track order status in real-time
- Rate and review shops/products

### 2. Shop Owner
**Screens:**
- Dashboard: Overview of sales, orders, products
- Products: Add/edit/delete products, manage inventory
- Orders: View and manage incoming orders
- Analytics: Sales reports, top products, insights
- Profile: Shop information, business hours

**Features:**
- List and manage products
- Accept/reject orders
- Update order status
- View sales analytics
- Manage inventory
- Update shop information

### 3. Delivery Partner
**Screens:**
- Dashboard: Active deliveries, available orders
- Deliveries: View all delivery assignments
- Earnings: Track earnings and transaction history
- Profile: Personal and vehicle information

**Features:**
- View available deliveries
- Accept delivery requests
- Track delivery route
- Update delivery status
- View earnings and payment history
- Manage availability (online/offline)

### 4. Admin
**Screens:**
- Dashboard: Platform overview, stats, activities
- Shops: Manage all shops, approve/suspend
- Users: Manage customers and delivery partners
- Orders: View all platform orders
- Settings: Platform configuration, commission rates

**Features:**
- Approve/reject shop registrations
- Manage all users and shops
- View platform-wide analytics
- Configure commission rates
- Handle complaints and support tickets
- Monitor all transactions

## Tech Stack

- **Framework:** Expo 54 with React Native
- **Navigation:** Expo Router (file-based routing)
- **Language:** TypeScript
- **State Management:** React Context API (Auth)
- **Styling:** React Native StyleSheet

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## Next Steps (Backend Integration)

1. **Set up Backend API:**
   - Create REST API endpoints for all operations
   - Implement authentication with JWT
   - Set up database (MongoDB/PostgreSQL)

2. **Update API Service:**
   - Replace mock data with actual API calls
   - Update `BASE_URL` in `services/api.service.ts`

3. **Implement Features:**
   - Real-time order tracking (WebSocket)
   - Push notifications (Expo Notifications)
   - Image upload for products
   - Maps integration for delivery
   - Payment gateway integration

4. **Add Missing Components:**
   - Loading states
   - Error handling
   - Form validation
   - Image pickers
   - Map components

## File Naming Conventions

- **Screens:** kebab-case (e.g., `role-selection.tsx`)
- **Components:** PascalCase (e.g., `AuthContext.tsx`)
- **Utilities:** kebab-case (e.g., `api.service.ts`)
- **Types:** kebab-case (e.g., `index.ts`)

## Code Organization Best Practices

1. **Separation of Concerns:** Each role has its own folder
2. **Reusability:** Shared components in `components/shared/`
3. **Type Safety:** All types defined in `types/index.ts`
4. **Consistent Styling:** Use constants from `utils/constants.ts`
5. **API Abstraction:** All API calls through `services/api.service.ts`

## Environment Variables

Create a `.env` file for configuration:

```env
API_BASE_URL=http://your-backend-url.com/api
GOOGLE_MAPS_API_KEY=your_google_maps_key
PAYMENT_GATEWAY_KEY=your_payment_key
```

## Contributing

1. Follow the existing folder structure
2. Use TypeScript for all new files
3. Add proper type definitions
4. Follow the style guide
5. Test on both Android and iOS

## Support & Contact

For questions or issues, contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** November 3, 2025

