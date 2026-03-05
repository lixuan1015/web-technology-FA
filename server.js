const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Basic security headers (XSS, clickjacking, MIME sniffing)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

//Default route 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// API routes 
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/items', require('./routes/items'));

// 404 handler 
app.use((req, res) => {
  res.status(404).json({ message: "404 - Page Not Found" });
});

//Global error handler 
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

//Start server 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
