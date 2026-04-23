# 📚 MERN Learning Management System (LMS)

A full-stack Learning Management System built using the MERN stack (MongoDB, Express.js, React, Node.js). The platform enables users to browse, purchase, and learn courses, while admins can manage users, courses, and coupons.

---

## 🚀 Features

### 👤 User Features

* User registration & login (JWT authentication)
* Browse available courses
* Enroll in courses via Razorpay payment gateway
* Track course progress
* Dashboard with enrolled courses

### 🛠️ Admin Features

* Create, update, delete courses
* Manage users (roles & suspension)
* Create and manage discount coupons
* Monitor payments

---

## 🏗️ Tech Stack

**Frontend**

* React (Vite)
* Tailwind CSS
* Axios
* React Router

**Backend**

* Node.js
* Express.js
* MongoDB (Mongoose)

**Authentication**

* JWT (JSON Web Tokens)
* bcryptjs

**Payments**

* Razorpay Integration

---

## 📂 Project Structure

```
mern-app/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── index.html
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/kvishv/LMS.git
cd LMS
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

Run backend:

```bash
npm start
```

---

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Authentication Flow

* User logs in → JWT token generated
* Token stored in localStorage
* Axios interceptor attaches token to requests
* Protected routes verify token via middleware

---

## 💳 Payment Flow

1. User clicks "Buy Course"
2. Backend creates Razorpay order
3. Payment processed on frontend
4. Backend verifies signature (HMAC SHA256)
5. Course enrollment activated

---

## 📊 Database Design

### Collections:

* Users
* Courses
* Payments
* Coupons

Optimized using:

* ObjectId references
* Embedded progress tracking

---

## 🛡️ Security Features

* Password hashing (bcrypt)
* JWT authentication
* Role-based access control
* Payment verification (Razorpay signature)

