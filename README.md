# 🎨 Imo Crafts — E-Commerce Platform

A full-stack e-commerce platform for **Imo Crafts**, a handmade crafts business based in Sri Lanka. The platform converts a social-media-first business into a professional online storefront with a customer-facing shop, an admin management panel, and a Firebase-powered backend.

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Made with](https://img.shields.io/badge/made%20with-React%20%7C%20Node.js%20%7C%20Firebase-orange)

---

## 📖 About the Project

Imo Crafts sells handmade gifts, event decorations, home decor, and custom craft items. Previously operating only through Facebook, this project gives the business:

- A mobile-friendly **online storefront** with product catalogue, search, and categories
- A **Cash on Delivery (COD)** checkout flow with coupon code support
- An **admin dashboard** to manage products, orders, customers, inventory, inquiries, media, promotions, and reviews
- A **custom order inquiry** system for personalized craft requests
- Automated **email notifications** for order confirmations and low stock alerts
- Integration with **Firebase** (Auth, Firestore) and **Cloudinary** (image storage & optimization)
- **SEO optimization** with dynamic meta tags, Open Graph, and JSON-LD structured data

---

## 🏗️ Project Structure

```
imo-crafts/
├── backend/                   # Express.js REST API
│   ├── src/
│   │   ├── config/            # Firebase Admin & Cloudinary config
│   │   ├── controllers/       # Route logic
│   │   │   ├── productController.js
│   │   │   ├── orderController.js
│   │   │   ├── customerController.js
│   │   │   ├── inquiryController.js
│   │   │   ├── promotionController.js   # Coupon validation
│   │   │   ├── payhereController.js     # PayHere hash generation
│   │   │   ├── adminUserController.js   # Role-based user management
│   │   │   └── uploadController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js        # verifyAdmin + requireRole()
│   │   ├── routes/            # API route definitions
│   │   └── services/
│   │       └── emailService.js          # Nodemailer low stock alerts
│   └── postman/               # Postman API collection
│
├── frontend/                  # Customer-facing storefront (React + Vite)
│   └── src/
│       ├── components/
│       │   ├── layout/        # Navbar, Footer
│       │   ├── ui/            # ProductCard, LoadingSpinner, etc.
│       │   └── SEO.jsx        # Dynamic meta tags + structured data
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx          # Cart + coupon discount state
│       ├── firebase/          # Firebase client config
│       └── pages/customer/
│           ├── Landing.jsx
│           ├── Home.jsx       # Testimonials section
│           ├── Shop.jsx
│           ├── ProductDetail.jsx
│           ├── Cart.jsx
│           ├── Checkout.jsx   # Coupon apply + order confirmation email
│           ├── CustomOrder.jsx
│           ├── Reviews.jsx    # Customer reviews page
│           ├── About.jsx
│           └── Contact.jsx
│
└── admin/                     # Admin dashboard (React + Vite)
    └── src/
        ├── components/
        │   └── layout/
        │       ├── AdminSidebar.jsx     # Role-filtered navigation
        │       └── AdminNavbar.jsx
        ├── context/
        │   └── AuthContext.jsx          # Role-aware auth + hasPermission()
        ├── firebase/          # Firebase client config
        └── pages/admin/
            ├── Dashboard.jsx  # Role-aware stats & widgets
            ├── Products.jsx
            ├── Orders.jsx
            ├── Customers.jsx
            ├── Inventory.jsx  # Low stock alerts + filter tabs
            ├── Inquiries.jsx
            ├── Media.jsx
            ├── Promotions.jsx # Coupon code management
            ├── Reviews.jsx    # Approve / reject customer reviews
            ├── Reports.jsx
            └── Users.jsx      # Role-based admin user management
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router v7, Axios |
| **Admin Panel** | React 19, Vite, Tailwind CSS, Firebase Auth |
| **Backend** | Node.js, Express.js 5 |
| **Database** | Firebase Cloud Firestore |
| **Authentication** | Firebase Authentication (Email/Password + Custom Claims) |
| **Image Storage** | Cloudinary |
| **Email** | EmailJS (order confirmations) + Nodemailer (admin alerts) |
| **SEO** | react-helmet-async |
| **Payment** | PayHere (Visa / Mastercard / Amex) |
| **Icons** | Lucide React |

---

## ✨ Features

### 🛍️ Customer Storefront

- **No login required** to browse — guests can view all products, categories, reviews, about, and contact pages
- Login / Register required only for: Add to Cart, Checkout, Place Order, Custom Order, Write Review
- Login page with "Continue as Guest →" option
- Browse products by category (Handmade Gifts, Event & Party, Home Decor, Custom Orders)
- Search and sort products (latest, price low–high, high–low)
- Product detail pages with image gallery and quantity selector
- Shopping cart with persistent localStorage
- **Coupon code** input at checkout with real-time discount calculation
- Cash on Delivery (COD) checkout with district-based delivery
- **Card / Online Payment** via PayHere (Visa, Mastercard, Amex) — sandbox & production support
- **Order confirmation email** sent via EmailJS with itemised order details
- Custom order inquiry form with **email acknowledgment**
- **Customer reviews** page — write, rate, and browse testimonials
- About, Contact, and FAQ pages
- **SEO** — dynamic meta tags, Open Graph, Twitter Card, JSON-LD structured data on all pages

### 🔐 Admin Panel

- Secure login via Firebase Authentication
- **Role-based access** — sidebar and API endpoints filtered by user role
- **Dashboard** — role-aware stats: Super Admin sees all metrics + revenue; Staff sees orders/customers; Inventory Manager sees stock levels + low stock alerts + quick actions; Content Manager sees product count + quick actions
- **Products** — add, edit, delete with Cloudinary image uploads
- **Orders** — view and update status (Pending → Confirmed → Processing → Delivered)
- **Customers** — view records and order history
- **Inventory** — stock level stats, filter tabs (Out/Low/In Stock), color-coded rows, **automatic low stock email alert** when stock ≤ 5
- **Inquiries** — manage custom order requests
- **Media** — upload and manage images via Cloudinary
- **Promotions** — create coupon codes with discount type (%, fixed), minimum order amount, and expiry dates
- **Reviews** — approve / reject / delete customer-submitted reviews
- **Reports** — export order data to CSV, best-selling products
- **Users** — create team members, assign roles, update or delete

### ⚙️ Backend API

- RESTful endpoints for products, orders, customers, inquiries, promotions, admin users, and image uploads
- Firebase Admin SDK for secure Firestore access
- `verifyAdmin` + `requireRole(...roles)` middleware for fine-grained route protection
- Coupon validation endpoint (`POST /api/promotions/validate`) with date range and minimum order checks
- Low stock email alerts via Nodemailer on inventory update
- Cloudinary integration for image upload/delete

---

## 🔑 Role-Based Permissions

| Role | Dashboard | Products | Orders | Customers | Inventory | Inquiries | Media | Promotions | Reviews | Reports | Users |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Super Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Staff** | ✅ | — | ✅ | ✅ | — | ✅ | — | — | — | — | — |
| **Inventory Manager** | ✅ | ✅ | — | — | ✅ | — | — | — | — | — | — |
| **Content Manager** | ✅ | ✅ | — | — | — | — | ✅ | ✅ | ✅ | — | — |

Roles are stored as **Firebase custom claims** and verified server-side on every protected request.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm
- Firebase project (Firestore + Authentication enabled)
- Cloudinary account
- Gmail account with App Password (for low stock alerts)
- EmailJS account (for order confirmation emails)

### 1. Clone the repository
```bash
git clone https://github.com/chamika217/Imo-Crafts-Ecommerce-Platform.git
cd Imo-Crafts-Ecommerce-Platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS origins
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Email (Gmail App Password — for low stock alerts)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-digit-app-password
ADMIN_EMAIL=admin@yourdomain.com

# PayHere Payment Gateway
# Get sandbox credentials from https://sandbox.payhere.lk
PAYHERE_MERCHANT_ID=1228172
PAYHERE_MERCHANT_SECRET=your-merchant-secret
PAYHERE_SANDBOX=true
```

Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...

VITE_API_URL=http://localhost:5000/api

# EmailJS (order confirmation emails)
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...

# PayHere Payment Gateway
# Use 1228172 for sandbox testing
# Get live Merchant ID from https://www.payhere.lk
VITE_PAYHERE_MERCHANT_ID=1228172
```

Run:
```bash
npm run dev
```

### 4. Admin Panel Setup
```bash
cd ../admin
npm install
```

Create a `.env` in `admin/` with the same Firebase config and:
```env
VITE_API_URL=http://localhost:5000/api
```

Run:
```bash
npm run dev
```

---

## 💳 PayHere Payment Setup

### Sandbox Testing
No registration needed for sandbox. Use these test credentials:

| Field | Value |
|---|---|
| Merchant ID | `1228172` (default in `.env`) |
| Test Card | `4916217501611292` |
| CVV | `100` |
| Expiry | `02/27` |
| OTP | `123456` |

### Going Live
1. Register at [payhere.lk](https://www.payhere.lk) and get your **Merchant ID**
2. Update `VITE_PAYHERE_MERCHANT_ID` in `frontend/.env`
3. In `Checkout.jsx` change `sandbox: true` → `sandbox: false`
4. Add your deployed backend URL as **Notify URL** in PayHere dashboard: `https://your-api.com/api/orders/payhere-notify`

---

## 📧 EmailJS Template Variables

Update your EmailJS template (`template_xxxxx`) to use these variables:

| Variable | Description |
|---|---|
| `{{customer_name}}` | Customer full name |
| `{{customer_email}}` | Customer email |
| `{{order_id}}` | Short order ID |
| `{{order_items}}` | Line-by-line items list |
| `{{subtotal}}` | Cart subtotal |
| `{{discount_line}}` | Coupon discount line (empty if no coupon) |
| `{{coupon_code}}` | Applied coupon code |
| `{{order_total}}` | Final total after discount |
| `{{delivery_address}}` | Delivery address |
| `{{district}}` | Delivery district |
| `{{phone}}` | Customer phone |
| `{{payment_method}}` | Payment method |

---

## 🔌 API Endpoints

### Products
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List all products |
| GET | `/api/products/featured` | Public | Featured products |
| GET | `/api/products/:id` | Public | Single product |
| POST | `/api/products` | inventoryManager+ | Create product |
| PUT | `/api/products/:id` | inventoryManager+ | Update product |
| DELETE | `/api/products/:id` | inventoryManager+ | Delete product |

### Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | Public | Place order |
| GET | `/api/orders` | staff+ | All orders |
| PUT | `/api/orders/:id` | staff+ | Update status |
| DELETE | `/api/orders/:id` | superAdmin | Delete order |

### Promotions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/promotions/validate` | Public | Validate coupon code |

### PayHere
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/payhere/hash` | Public | Generate MD5 payment hash (server-side) |
| POST | `/api/orders/payhere-notify` | Public | PayHere server callback on payment success |

### Admin Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin-users` | superAdmin | List users |
| POST | `/api/admin-users` | superAdmin | Create user |
| PUT | `/api/admin-users/:uid` | superAdmin | Update role |
| DELETE | `/api/admin-users/:uid` | superAdmin | Delete user |

---

## 📂 Firestore Collections

| Collection | Purpose |
|---|---|
| `products` | Product catalogue |
| `orders` | Customer COD orders (includes coupon info) |
| `customers` | Customer contact records |
| `customInquiries` | Custom order requests |
| `adminUsers` | Admin team members with roles |
| `promotions` | Discount campaigns with coupon codes |
| `reviews` | Customer reviews (approved/pending) |

---

## 🔄 Recent Updates

### June 2026
- ✅ **Coupon Codes** — Admin can create coupon codes (% or fixed discount, min order, expiry). Customers apply at checkout with live discount preview.
- ✅ **Order Confirmation Emails** — EmailJS sends itemised confirmation on order placed; custom inquiry acknowledgment on inquiry submit.
- ✅ **Low Stock Alerts** — Automatic email to admin when product stock drops to ≤ 5 units. Inventory page redesigned with stats cards, filter tabs, and color-coded rows.
- ✅ **Reviews / Testimonials** — Customer review page with star ratings. Admin approval workflow. Top 3 approved reviews shown on Home page.
- ✅ **SEO Meta Tags** — `react-helmet-async` SEO component on all pages. Product pages include JSON-LD `Product` + `BreadcrumbList` structured data.
- ✅ **Role-Based Permissions** — 4 roles (Super Admin, Staff, Inventory Manager, Content Manager) via Firebase custom claims. Sidebar and API routes filtered per role. Admin Users management page.
- ✅ **Card Payment (PayHere)** — Visa/Mastercard/Amex via PayHere. COD and Card selectable at checkout. Sandbox mode for testing included.
- ✅ **Guest Access** — Customers can browse, view products, read reviews without logging in. Login required only for Add to Cart, Checkout, Place Order, Custom Order submit, and Write Review. Login page has "Continue as Guest" option.
- ✅ **Role-Based Dashboard** — Dashboard stats and widgets dynamically filtered by role. Staff sees orders/customers, Inventory Manager sees stock levels + quick actions, Content Manager sees product count + quick actions, Super Admin sees everything including revenue.
- ✅ **PayHere Hash Security** — MD5 hash generated server-side (`POST /api/payhere/hash`) so merchant secret is never exposed to the client.

---

## 👨‍💻 Developer

**Chamika Dilshan**
Project assigned by **Pixzora Lab**

---

## 📄 License

This project is licensed under the MIT License.
