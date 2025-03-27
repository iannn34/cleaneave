-- Code for the initialization of the tables present in the database
-- tables present in the database are:
-- 1. users
-- 2. roles
-- 3. orders
-- 4. order_items
-- 5. products
-- 6. tokens

-- Drop the tables if they exist
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS tokens CASCADE;


-- Create roles table
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (name)
    VALUES ('staff'), ('customer'),('admin');

-- Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    contact INT NOT NULL,
    role_id INT NOT NULL REFERENCES roles(role_id) DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adding the verified field to my users table
ALTER TABLE users
    ADD verified BOOLEAN DEFAULT FALSE;

-- Create products table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unit_price INT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

-- Create orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    total_price INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'processing',
    pickup_time TIMESTAMP NOT NULL,
    delivery_time TIMESTAMP NOT NULL,
    location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Changing the data type of the location column to jsonb from text
-- for efficient storage of location date
ALTER TABLE orders
    ALTER COLUMN location TYPE JSONB USING location::JSONB;

-- Create order_items table
CREATE TABLE order_items (
    item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(order_id),
    product_id INT NOT NULL REFERENCES products(product_id),
    quantity INT NOT NULL,
    total_unit_price INT NOT NULL,
    service TEXT NOT NULL
);

-- Create token table
CREATE TABLE tokens (
    token_id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '3 hours'
);

-- Adding reference to user id for every token
-- For enhanced security while verifying emails
ALTER TABLE tokens
    ADD COLUMN user_id INTEGER REFERENCES users NOT NULL DEFAULT 0;

