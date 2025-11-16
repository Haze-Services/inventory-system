# Database Setup for Orders System

## Error Resolution
The error you encountered (`Could not find the table 'public.orders'`) occurs because the orders tables don't exist in your Supabase database yet.

## Setup Instructions

### 1. Access Supabase Dashboard
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to the **SQL Editor** in the left sidebar

### 2. Run the Database Schema
1. Open the file `database_setup_orders.sql` in this directory
2. Copy the entire SQL content
3. Paste it into the Supabase SQL Editor
4. Click **Run** to execute the script

### 3. Verify Tables Created
After running the script, you should see two new tables:
- `public.orders`
- `public.order_items`

You can verify by going to **Database** > **Tables** in the Supabase dashboard.

### 4. Check Table Structure

**Orders Table:**
- `id` (UUID, Primary Key)
- `order_number` (VARCHAR, Unique)
- `supplier_id` (UUID, Foreign Key to suppliers)
- `status` (VARCHAR, with constraints)
- `order_date`, `expected_delivery_date`, `actual_delivery_date`
- `total_amount` (DECIMAL)
- `notes` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

**Order Items Table:**
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key to orders)
- `product_id` (UUID, Foreign Key to products)
- `quantity` (INTEGER)
- `unit_price`, `total_price` (DECIMAL)
- `created_at` (TIMESTAMP)

### 5. Security Settings
The script includes Row Level Security (RLS) setup but leaves it commented out. If you need to enable RLS:

1. Uncomment the RLS policy lines in the SQL file
2. Adjust the policies based on your authentication requirements
3. Re-run the script

### 6. Test the System
After creating the tables:
1. Restart your Next.js development server (`npm run dev`)
2. Navigate to `/dashboard/orders`
3. Try creating a new order
4. The error should be resolved

### 7. Troubleshooting

**If you still get errors:**
- Ensure your Supabase URL and keys are correctly set in `.env.local`
- Check that the `suppliers` and `products` tables exist (required for foreign keys)
- Verify table permissions in Supabase dashboard

**Common Issues:**
- Foreign key constraints may fail if referenced tables don't exist
- Make sure your `suppliers` and `products` tables use UUID primary keys
- Check that your Supabase project has the necessary permissions

### 8. Optional: Add Sample Data
The SQL file includes commented sample data. Uncomment and modify it if you want to test with sample orders.

## Next Steps
Once the tables are created, your orders system should work perfectly with:
- Creating new orders from products page
- Managing orders in the dashboard
- Tracking order status and delivery dates
- Full CRUD operations via the API