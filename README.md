# 🎨 Imo Crafts — E-Commerce Platform

A full-stack e-commerce platform for **Imo Crafts**, a handmade crafts business based in Sri Lanka. The platform converts a social-media-first business into a professional online storefront with a customer-facing shop, an admin management panel, and a Firebase-powered backend.

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Made with](https://img.shields.io/badge/made%20with-React%20%7C%20Node.js%20%7C%20Firebase-orange)

---

## 📖 About the Project

Imo Crafts sells handmade gifts, event decorations, home decor, and custom craft items. Previously operating only through Facebook, this project gives the business:

- A mobile-friendly **online storefront** with product catalogue, search, and categories
- A **Cash on Delivery (COD)** checkout flow
- An **admin dashboard** to manage products, orders, customers, inventory, inquiries, media, and promotions
- A **custom order inquiry** system for personalized craft requests
- Integration with **Firebase** (Auth, Firestore, Hosting) and **Cloudinary** (image storage & optimization)

---

## 🏗️ Project Structure

```
imo-crafts/
├── backend/          # Express.js REST API
│   ├── src/
│   │   ├── config/        # Firebase Admin & Cloudinary config
│   │   ├── controllers/    # Route logic (products, orders, customers, inquiries, upload)
│   │   ├── middleware/     # Firebase auth middleware
│   │   └── routes/         # API route definitions
│   └── postman/             # Postman API collection for testing
│
├── frontend/          # Customer-facing storefront (React + Vite)
│   └── src/
│       ├── components/     # Navbar, Footer, ProductCard, etc.
│       ├── context/        # Cart & Auth context providers
│       ├── firebase/        # Firebase client config
│       └── pages/customer/  # Home, Shop, Product Detail, Cart, Checkout, etc.
│
└── admin/             # Admin dashboard (React + Vite)
    └── src/
        ├── components/     # Sidebar, Navbar, shared UI
        ├── context/         # Auth context
        ├── firebase/         # Firebase client config
        └── pages/admin/      # Dashboard, Products, Orders, Customers, Inventory, etc.
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router, Axios |
| **Admin Panel** | React 19, Vite, Tailwind CSS, Firebase Auth |
| **Backend** | Node.js, Express.js |
| **Database** | Firebase Cloud Firestore |
| **Authentication** | Firebase Authentication (Email/Password) |
| **Image Storage & CDN** | Cloudinary |
| **Hosting** | Firebase Hosting |
| **Notifications** | React Hot Toast |
| **Icons** | Lucide React |

---

## ✨ Features

### 🛍️ Customer Storefront
- Browse products by category (Handmade Gifts, Event & Party Crafts, Home Decor, Custom Orders)
- Search and sort products (latest, price low–high, high–low)
- Product detail pages with image gallery and quantity selector
- Shopping cart with persistent storage
- Cash on Delivery (COD) checkout with district-based delivery
- Custom order inquiry form for personalized requests
- About, Contact, and FAQ pages

### 🔐 Admin Panel
- Secure login via Firebase Authentication
- **Dashboard** — overview of orders, customers, and inquiries
- **Products** — add, edit, delete products with Cloudinary image uploads
- **Orders** — view and update order status (Pending → Confirmed → Processing → Delivered)
- **Customers** — view customer records and order history
- **Inventory** — manage stock quantities and product availability
- **Inquiries** — manage custom order requests
- **Media** — upload and manage images via Cloudinary
- **Promotions** — create and manage discount campaigns
- **Reports** — export order data to CSV, view best-selling products

### ⚙️ Backend API
- RESTful endpoints for products, orders, customers, inquiries, and image uploads
- Firebase Admin SDK for secure Firestore access
- Role-protected admin routes via Firebase ID token verification
- Cloudinary integration for image upload/delete

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm
- A Firebase project (Firestore, Authentication, Hosting enabled)
- A Cloudinary account

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
Create a `.env` file in `backend/` with:
```
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="your-private-key"

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
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
Create a `.env` file in `frontend/` with your Firebase web config and:
```
VITE_API_URL=http://localhost:5000/api
```
Run the frontend:
```bash
npm run dev
```

### 4. Admin Panel Setup
```bash
cd ../admin
npm install
```
Create a `.env` file in `admin/` with the same Firebase config and:
```
VITE_API_URL=http://localhost:5000/api
```
Run the admin panel:
```bash
npm run dev
```

---

## 🔌 API Testing

A complete **Postman collection** is included at:
```
backend/postman/Imo-Crafts-API.postman_collection.json
```
Import it into Postman to test all Products, Orders, Customers, Inquiries, and Upload endpoints.

---

## 📂 Firestore Collections

| Collection | Purpose |
|---|---|
| `products` | Product catalogue items |
| `categories` | Product category hierarchy |
| `orders` | Customer COD orders |
| `customers` | Customer contact records |
| `customInquiries` | Custom order requests |
| `adminUsers` | Admin dashboard access control |
| `promotions` | Discount campaigns |

---

## 👨‍💻 Developer

**Chamika Dilshan**
Project assigned by **Pixzora Lab**

---

## 📄 License

This project is licensed under the MIT License.
