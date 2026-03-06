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

select *from users;
select *from items;

INSERT INTO items (title, description, category, location, date, contact, status, user_id)
VALUES
  ('Black Wallet',    'Lost near cafeteria',  'Lost',  'Cafeteria',    '2026-03-01', '0123456789', 'Active', NULL),
  ('Student ID Card', 'Lost in library level 2','Lost','Library',      '2026-02-28', '0198765432', 'Active', NULL),
  ('iPhone 13',       'Found at parking lot',  'Found', 'Parking Area','2026-03-02', '0112233445', 'Active', NULL),
  ('Blue Water Bottle','Found in lecture hall','Found', 'Hall A',       '2026-03-01', '0178899001', 'Active', NULL);
