-- Utility functions for the inventory system

-- Function to update product stock after movement
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.movement_type = 'IN' THEN
    UPDATE products 
    SET stock_quantity = stock_quantity + NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
  ELSIF NEW.movement_type = 'OUT' THEN
    UPDATE products 
    SET stock_quantity = stock_quantity - NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
  ELSIF NEW.movement_type = 'ADJUSTMENT' THEN
    UPDATE products 
    SET stock_quantity = NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update stock when movements are recorded
CREATE TRIGGER trigger_update_product_stock
  AFTER INSERT ON stock_movements
  FOR EACH ROW
  EXECUTE FUNCTION update_product_stock();

-- Function to get low stock products
CREATE OR REPLACE FUNCTION get_low_stock_products()
RETURNS TABLE (
  product_id UUID,
  product_name VARCHAR(255),
  current_stock INTEGER,
  min_stock_level INTEGER,
  category_name VARCHAR(255)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.stock_quantity,
    p.min_stock_level,
    c.name
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  WHERE p.stock_quantity <= p.min_stock_level
    AND p.is_active = true
  ORDER BY p.stock_quantity ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate total inventory value
CREATE OR REPLACE FUNCTION get_inventory_value()
RETURNS TABLE (
  total_purchase_value DECIMAL(12,2),
  total_selling_value DECIMAL(12,2),
  potential_profit DECIMAL(12,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    SUM(p.purchase_price * p.stock_quantity) as total_purchase_value,
    SUM(p.selling_price * p.stock_quantity) as total_selling_value,
    SUM(p.total_profit * p.stock_quantity) as potential_profit
  FROM products p
  WHERE p.is_active = true;
END;
$$ LANGUAGE plpgsql;
