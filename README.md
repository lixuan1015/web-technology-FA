# 🎒 Campus Lost & Found Management System

A full-stack web application for Quest International University that digitalizes the campus lost and found process.

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Security](#security)

---

## ✨ Features

- User registration and login with bcrypt password hashing
- Submit Lost or Found item reports
- View all Lost / Found items with search filter
- Update item status (Active → Claimed)
- Delete own reports (owner-only enforcement)
- Fully responsive, student-friendly UI

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL (via mysql2) |
| Security | bcrypt, parameterized queries, XSS sanitization, security headers |

---

## 📁 Project Structure

```
web-technology-FA/
├── models/
│   └── db.js              # MySQL connection
├── routes/
│   ├── auth.js            # Signup & Login routes
│   └── items.js           # CRUD routes for items
├── public/
│   ├── login.html
│   ├── signup.html
│   ├── home.html
│   ├── lost-form.html
│   ├── found-form.html
│   ├── lost-list.html
│   ├── found-list.html
│   ├── auth.js            # Frontend auth logic
│   └── style.css
├── .env                   # Environment variables (not committed)
├── .env.example           # Template for environment variables
├── package.json
├── schema.sql             # Database schema & sample data
└── server.js              # Express app entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v14+
- MySQL (via DBeaver or XAMPP)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/lixuan1015/web-technology-FA.git
cd web-technology-FA

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your MySQL credentials

# 4. Set up the database
# Open DBeaver, connect to MySQL, and run schema.sql

# 5. Start the server
npm start
```

Open your browser at `http://localhost:3000`

---

## 🗄 Database Setup

Run `schema.sql` in DBeaver:

```sql
CREATE DATABASE IF NOT EXISTS lostfound;
USE lostfound;

CREATE TABLE users (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(100) NOT NULL,
  email    VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category    ENUM('Lost','Found') NOT NULL,
  location    VARCHAR(255) NOT NULL,
  date        DATE NOT NULL,
  contact     VARCHAR(100) NOT NULL,
  status      ENUM('Active','Claimed') DEFAULT 'Active',
  user_id     INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/items/lost` | Get all lost items |
| GET | `/api/items/found` | Get all found items |
| GET | `/api/items/:id` | Get single item |
| POST | `/api/items` | Create new item |
| PUT | `/api/items/:id` | Update item status |
| DELETE | `/api/items/:id` | Delete item (owner only) |

---

## 🔒 Security

- **Passwords** hashed with bcrypt (salt rounds: 10)
- **SQL Injection** prevented via parameterized queries (`?` placeholders)
- **XSS Prevention** via server-side input sanitization and response escaping
- **Input Validation** on all fields server-side (type, length, format checks)
- **Security Headers** set on every response (X-XSS-Protection, X-Frame-Options, X-Content-Type-Options)
- **Credentials** stored in `.env` (never committed to version control)
- **Owner-only delete** enforced at database query level

---

## 📄 License

This project was developed as a Final Assessment for BIT1107/BIT2164/BCS2024 – Web Technologies / Web Application at Quest International University.
