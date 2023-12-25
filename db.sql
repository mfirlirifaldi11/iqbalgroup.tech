-- Database: iqbalgroup.tech

-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS iqbalgroup.tech;

-- Gunakan database yang dibuat
USE iqbalgroup.tech;

-- Buat tabel roles
CREATE TABLE roles (
  role_id INT(11) NOT NULL AUTO_INCREMENT,
  role_name VARCHAR(50) NOT NULL,
  PRIMARY KEY (role_id)
);

-- Buat tabel users
CREATE TABLE users (
  user_id INT(11) NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT(11) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) DEFAULT NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY username (username),
  UNIQUE KEY email (email),
  KEY role_id (role_id),
  CONSTRAINT users_ibfk_3 FOREIGN KEY (role_id) REFERENCES roles (role_id)
);

-- Buat tabel wifi_servers
CREATE TABLE wifi_servers (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) DEFAULT NULL,
  ip VARCHAR(15) DEFAULT NULL,
  port INT(11) DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE attendances (
  attendance_id INT(11) NOT NULL,
  user_id INT(11) DEFAULT NULL,
  date_attended DATE NOT NULL,
  time_in TIME DEFAULT NULL,
  time_out TIME DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  photo_path VARCHAR(255) DEFAULT NULL,
  latitude DOUBLE DEFAULT NULL,
  longitude DOUBLE DEFAULT NULL,
  PRIMARY KEY (attendance_id),
  KEY user_id (user_id),
  CONSTRAINT attendances_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (user_id)
);


-- Buat tabel maintenance_schedules
CREATE TABLE maintenance_schedules (
  schedule_id INT(11) NOT NULL,
  user_id INT(11) DEFAULT NULL,
  frequency ENUM('daily', 'weekly', 'monthly') NOT NULL,
  day_of_week INT(11) DEFAULT NULL,
  day_of_month INT(11) DEFAULT NULL,
  time_scheduled TIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (schedule_id),
  KEY user_id (user_id),
  CONSTRAINT maintenance_schedules_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Buat tabel notifications
CREATE TABLE notifications (
  notification_id INT(11) NOT NULL,
  user_id INT(11) DEFAULT NULL,
  ticket_id INT(11) DEFAULT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (notification_id),
  KEY user_id (user_id),
  KEY ticket_id (ticket_id),
  CONSTRAINT notifications_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (user_id),
  CONSTRAINT notifications_ibfk_2 FOREIGN KEY (ticket_id) REFERENCES tickets (ticket_id)
);

-- Buat tabel tickets
CREATE TABLE tickets (
  ticket_id INT(11) NOT NULL,
  user_id INT(11) DEFAULT NULL,
  service_type ENUM('pemasangan', 'pemeliharaan') NOT NULL,
  date_requested DATE NOT NULL,
  time_requested TIME NOT NULL,
  status ENUM('pending', 'assigned', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
  feedback TEXT DEFAULT NULL,
  rating INT(11) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (ticket_id),
  KEY user_id (user_id),
  CONSTRAINT tickets_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (user_id)
);
