-- Drop table if it already exists (optional)
DROP TABLE IF EXISTS orders;

-- Create the table
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer TEXT,
    amount REAL,
    order_date DATE
);

-- Insert sample data
INSERT INTO orders (customer, amount, order_date) VALUES
('Alice', 5000, '2024-03-01'),
('Bob', 8000, '2024-03-05'),
('Alice', 3000, '2024-03-15'),
('Charlie', 7000, '2024-02-20'),
('Alice', 10000, '2024-02-28'),
('Bob', 4000, '2024-02-10'),
('Charlie', 9000, '2024-03-22'),
('Alice', 2000, '2024-03-30');

-- 1. Total sales volume for March 2024
SELECT SUM(amount) AS total_march_sales
FROM orders
WHERE strftime('%Y-%m', order_date) = '2024-03';

-- 2. Customer who spent the most overall
SELECT customer, SUM(amount) AS total_spent
FROM orders
GROUP BY customer
ORDER BY total_spent DESC
LIMIT 1;

-- 3. Average order value for the last 3 months from now (dynamic)
SELECT AVG(amount) AS avg_order_last_3_months
FROM orders
WHERE order_date >= date('now', '-3 months');

-- 3 (alternative): Average order value for Jan–Mar 2024 (fixed range)
SELECT AVG(amount) AS avg_order_fixed_range
FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-03-31';
