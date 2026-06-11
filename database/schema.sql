-- Gainz Gym Database Schema

CREATE DATABASE IF NOT EXISTS gainz_gym;
USE gainz_gym;

-- 1. Users Table (Admin authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin', -- 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Trainers Table
CREATE TABLE IF NOT EXISTS trainers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    experience_years INT NOT NULL,
    bio TEXT,
    photo_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Membership Plans Table
CREATE TABLE IF NOT EXISTS memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price INT NOT NULL, -- Price in INR
    period VARCHAR(20) DEFAULT 'month',
    features JSON NOT NULL, -- list of features as JSON array
    badge VARCHAR(50) NULL,  -- e.g. "Popular", "Best Value"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Equipment Table
CREATE TABLE IF NOT EXISTS equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    muscle_groups VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    features JSON NOT NULL,
    specs JSON NOT NULL,     
    photo_url VARCHAR(255) NOT NULL, 
    rotation_photos JSON NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Class Schedules Table
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(100) NOT NULL,
    trainer_id INT,
    day_of_week VARCHAR(15) NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    room VARCHAR(50) NOT NULL,
    intensity VARCHAR(20) NOT NULL,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Contact & Inquiry Form Table
CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    subject VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
