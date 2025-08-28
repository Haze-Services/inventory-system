-- Seed data for testing the inventory system

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and accessories'),
('Clothing', 'Apparel and fashion items'),
('Home & Garden', 'Home improvement and garden supplies'),
('Books', 'Books and educational materials'),
('Sports', 'Sports equipment and accessories')
ON CONFLICT (name) DO NOTHING;

-- Insert sample suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES
('TechSupply Co.', 'John Smith', 'john@techsupply.com', '+1-555-0101', '123 Tech Street, Silicon Valley, CA'),
('Fashion Wholesale', 'Maria Garcia', 'maria@fashionwholesale.com', '+1-555-0102', '456 Fashion Ave, New York, NY'),
('HomeGoods Direct', 'David Johnson', 'david@homegoods.com', '+1-555-0103', '789 Home Blvd, Chicago, IL'),
('BookWorld Distribution', 'Sarah Wilson', 'sarah@bookworld.com', '+1-555-0104', '321 Book Lane, Boston, MA'),
('SportsPro Supply', 'Mike Brown', 'mike@sportspro.com', '+1-555-0105', '654 Sports Way, Denver, CO');

-- Insert sample products
INSERT INTO products (
  name, description, sku, real_price, purchase_price, selling_price, 
  stock_quantity, min_stock_level, category_id, supplier_id
) VALUES
(
  'Wireless Bluetooth Headphones',
  'High-quality wireless headphones with noise cancellation',
  'WBH-001',
  79.99,
  45.00,
  89.99,
  25,
  5,
  (SELECT id FROM categories WHERE name = 'Electronics'),
  (SELECT id FROM suppliers WHERE name = 'TechSupply Co.')
),
(
  'Cotton T-Shirt - Blue',
  'Comfortable cotton t-shirt in blue color',
  'CTS-BLU-001',
  12.99,
  8.00,
  19.99,
  50,
  10,
  (SELECT id FROM categories WHERE name = 'Clothing'),
  (SELECT id FROM suppliers WHERE name = 'Fashion Wholesale')
),
(
  'Garden Hose 50ft',
  'Durable 50-foot garden hose with spray nozzle',
  'GH-50-001',
  29.99,
  18.00,
  39.99,
  15,
  3,
  (SELECT id FROM categories WHERE name = 'Home & Garden'),
  (SELECT id FROM suppliers WHERE name = 'HomeGoods Direct')
),
(
  'Programming Fundamentals Book',
  'Comprehensive guide to programming fundamentals',
  'PFB-001',
  34.99,
  20.00,
  49.99,
  30,
  5,
  (SELECT id FROM categories WHERE name = 'Books'),
  (SELECT id FROM suppliers WHERE name = 'BookWorld Distribution')
),
(
  'Basketball Official Size',
  'Official size basketball for indoor/outdoor use',
  'BB-OFF-001',
  24.99,
  15.00,
  34.99,
  20,
  5,
  (SELECT id FROM categories WHERE name = 'Sports'),
  (SELECT id FROM suppliers WHERE name = 'SportsPro Supply')
);

-- Insert sample stock movements
INSERT INTO stock_movements (product_id, movement_type, quantity, reference_number, notes) VALUES
(
  (SELECT id FROM products WHERE sku = 'WBH-001'),
  'IN',
  25,
  'PO-2024-001',
  'Initial stock from supplier'
),
(
  (SELECT id FROM products WHERE sku = 'CTS-BLU-001'),
  'IN',
  50,
  'PO-2024-002',
  'Initial stock from supplier'
),
(
  (SELECT id FROM products WHERE sku = 'WBH-001'),
  'OUT',
  3,
  'SALE-001',
  'Sold to customer'
);

-- Insert sample warranties
INSERT INTO warranties (product_id, customer_name, customer_email, purchase_date, warranty_period_months) VALUES
(
  (SELECT id FROM products WHERE sku = 'WBH-001'),
  'Alice Johnson',
  'alice.j@example.com',
  '2024-05-01',
  12
),
(
  (SELECT id FROM products WHERE sku = 'CTS-BLU-001'),
  'Bob Williams',
  'bob.w@example.com',
  '2024-04-15',
  6
);

-- Insert sample warranty payments
INSERT INTO warranty_payments (warranty_id, amount, payment_method, transaction_id)
SELECT id, 10.00, 'Credit Card', 'txn_12345abcde' FROM warranties WHERE customer_email = 'alice.j@example.com';
