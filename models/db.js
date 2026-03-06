const mysql = require('mysql2');

const db = mysql.createConnection({
  host:     process.env.MYSQLHOST,
  user:     process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLNAME
});

db.connect(err => {
  if (err) console.error("MySQL connection error:", err);
  else console.log("MySQL Connected");
});

module.exports = db;
