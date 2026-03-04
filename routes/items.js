const express = require('express');
const router = express.Router();
const db = require('../models/db');

//Helper: strip HTML tags to prevent XSS 
function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>"'`]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '`': '&#x60;'
  }[c]));
}

//CREATE item 
router.post('/', (req, res) => {
  let { title, description, category, location, date, contact, user_id } = req.body;

  if (!title || !description || !category || !location || !date || !contact || !user_id)
    return res.status(400).json({ message: "All fields are required" });

  if (!['Lost', 'Found'].includes(category))
    return res.status(400).json({ message: "Invalid category" });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    return res.status(400).json({ message: "Invalid date format" });

  if (title.length > 255)
    return res.status(400).json({ message: "Title too long" });

  title       = sanitize(title.trim());
  description = sanitize(description.trim());
  location    = sanitize(location.trim());
  contact     = sanitize(contact.trim());

  db.query(
    `INSERT INTO items (title, description, category, location, date, contact, user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, category, location, date, contact, user_id],
    (err) => {
      if (err) {
        console.error("DB insert error:", err);
        return res.status(500).json({ message: "Error saving item" });
      }
      res.json({ message: "Item Added" });
    }
  );
});

//GET Lost items 
router.get('/lost', (req, res) => {
  db.query(
    "SELECT * FROM items WHERE category = 'Lost' ORDER BY id DESC",
    (err, result) => {
      if (err) { console.error(err); return res.status(500).json([]); }
      res.json(result);
    }
  );
});

//GET Found items 
router.get('/found', (req, res) => {
  db.query(
    "SELECT * FROM items WHERE category = 'Found' ORDER BY id DESC",
    (err, result) => {
      if (err) { console.error(err); return res.status(500).json([]); }
      res.json(result);
    }
  );
});

//GET single item 
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

  db.query("SELECT * FROM items WHERE id = ?", [id], (err, result) => {
    if (err) { console.error(err); return res.status(500).json({ message: "Server error" }); }
    if (result.length === 0) return res.status(404).json({ message: "Item not found" });
    res.json(result[0]);
  });
});

//UPDATE status
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

  const { status } = req.body;
  if (!status || !['Active', 'Claimed'].includes(status))
    return res.status(400).json({ message: "Invalid status value" });

  db.query(
    "UPDATE items SET status = ? WHERE id = ?",
    [status, id],
    (err) => {
      if (err) { console.error(err); return res.status(500).json({ message: "Error updating" }); }
      res.json({ message: "Updated" });
    }
  );
});

// DELETE (owner only) 
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

  const userId = parseInt(req.body.user_id);
  if (!userId || isNaN(userId))
    return res.status(401).json({ message: "Not authorized" });

  db.query(
    "DELETE FROM items WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, result) => {
      if (err) { console.error(err); return res.status(500).json({ message: "Error deleting" }); }
      if (result.affectedRows === 0)
        return res.status(403).json({ message: "Not authorized to delete this item" });
      res.json({ message: "Deleted" });
    }
  );
});

module.exports = router;
