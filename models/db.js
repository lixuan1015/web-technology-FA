const mysql = require("mysql2");
const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect(err => {
  if (err) console.error("MySQL connection error:", err);
  else console.log("MySQL Connected");
});

module.exports = db;
