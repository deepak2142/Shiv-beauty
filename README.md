# 🌸 Shiv Beauty Center — Full Stack E-Commerce Website

A complete e-commerce website for **Shiv Beauty Center** with product showcase, user accounts, cart, checkout with UPI/WhatsApp payment, and an admin panel.

---

## 🗂️ Project Structure

```
shiv-beauty/
├── server/          ← Node.js + Express + MongoDB backend
└── client/          ← React frontend
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

---

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env and fill in your values
npm run dev
```

**`.env` variables:**
| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Any random secret string |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |

> **Important:** After starting, manually create your admin user by calling the register API once:
> ```
> POST http://localhost:5000/api/auth/register
> Body: { "name": "Admin", "email": "admin@shivbeauty.com", "password": "Admin@123" }
> ```
> Then in MongoDB, update that user's `role` field to `"admin"`.

---

### 3. Frontend Setup

```bash
cd client
npm install
npm start
```

The React app will run on `http://localhost:3000` and proxy API requests to `http://localhost:5000`.

---

## 🌐 Pages

| Route | Description |
|---|---|
| `/` | Homepage with featured products & UPI/WhatsApp section |
| `/products` | Product listing with search, category filter, sort |
| `/products/:id` | Product detail with image gallery, buy/cart/WhatsApp |
| `/cart` | Shopping cart |
| `/checkout` | Order placement with UPI & WhatsApp payment |
| `/orders` | User's order history |
| `/login` | Login page |
| `/register` | Sign up page |
| `/admin` | Admin dashboard (stats) |
| `/admin/products` | Add, edit, delete products |
| `/admin/orders` | Manage & update order statuses |

---

## 💳 Payment Flow

1. **UPI:** Customer pays to `shivbeauty@upi`, enters transaction ID in checkout
2. **WhatsApp:** Redirect to WhatsApp with order details; payment via UPI scanner
3. **Admin** confirms payment by updating order's `paymentStatus` to `paid`

---

## 📦 Features

- ✅ Product listing with search, category, sort
- ✅ Multi-image product gallery (up to 6 photos per product)
- ✅ Price + discount display
- ✅ User sign up / login (JWT)
- ✅ Shopping cart (persisted in localStorage)
- ✅ Checkout with shipping address
- ✅ UPI payment + transaction ID entry
- ✅ WhatsApp order redirect
- ✅ My Orders page
- ✅ Admin: Dashboard with stats
- ✅ Admin: Add/edit/delete products with image upload
- ✅ Admin: View & manage all orders + update statuses

---

## 🔧 Customization

- Change **UPI ID**: Search for `shivbeauty@upi` and replace throughout
- Change **WhatsApp number**: Search for `919999999999` and replace with your number (91 + 10-digit number)
- Change **store name**: Already set to "Shiv Beauty Center" everywhere

---

## 🚀 Production Deployment

1. Build React: `cd client && npm run build`
2. Serve `client/build` as static files from Express (add to `server/index.js`)
3. Deploy to platforms like **Render**, **Railway**, or **VPS**
4. Use **MongoDB Atlas** for cloud database
