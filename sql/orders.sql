-- PostgreSQL
-- Drop table if it already exists (optional, for re-runs)
DROP TABLE IF EXISTS orders;

-- Create the orders table with auto-incrementing primary key
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer TEXT,
    amount REAL,
    order_date DATE
);

-- Insert sample sales data
INSERT INTO orders (customer, amount, order_date) VALUES
('Alice', 5000, '2024-03-01'),
('Bob', 8000, '2024-03-05'),
('Alice', 3000, '2024-03-15'),
('Charlie', 7000, '2024-02-20'),
('Alice', 10000, '2024-02-28'),
('Bob', 4000, '2024-02-10'),
('Charlie', 9000, '2024-03-22'),
('Alice', 2000, '2024-03-30');


-- ✅ 1. Calculate the total sales volume for March 2024
SELECT SUM(amount) AS total_march_sales
FROM orders
WHERE order_date >= '2024-03-01' AND order_date <= '2024-03-31';

-- ✅ 2. Find the customer who spent the most overall
SELECT customer, SUM(amount) AS total_spent
FROM orders
GROUP BY customer
ORDER BY total_spent DESC
LIMIT 1;

-- ✅ 3. Calculate the average order value for the last 3 months (relative to today)
SELECT AVG(amount) AS avg_order_last_3_months
FROM orders
WHERE order_date >= current_date - interval '3 months';

-- ✅ (Alternative to #3) Calculate the average order value for January to March 2024
SELECT AVG(amount) AS avg_order_last_3_months
FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-03-31';
