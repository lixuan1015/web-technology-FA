const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcrypt');

function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>"'`]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '`': '&#x60;'
  }[c]));
}

router.post('/signup', async (req, res) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ message: "Invalid email format" });

  if (password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters" });

  if (name.length > 100)
    return res.status(400).json({ message: "Name too long" });

  name  = sanitize(name.trim());
  email = email.trim().toLowerCase();

  try {
    const hashed = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashed],  
      (err) => {
        if (err) return res.status(400).json({ message: "Email already exists" });
        res.json({ message: "User created" });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/login', (req, res) => {
  let { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields required" });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ message: "Invalid email format" });

  email = email.trim().toLowerCase();

  db.query(
    "SELECT * FROM users WHERE email = ?", 
    [email],
    async (err, result) => {
      if (err) { console.error(err); return res.status(500).json({ message: "Server error" }); }

      if (result.length === 0)
        return res.status(400).json({ message: "Invalid email or password" }); // vague on purpose

      const valid = await bcrypt.compare(password, result[0].password);
      if (!valid)
        return res.status(400).json({ message: "Invalid email or password" });

      res.json({ userId: result[0].id, name: result[0].name });
    }
  );
});

module.exports = router;
