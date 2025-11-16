-- Check existing table structure to understand ID types
-- Run this first in Supabase SQL Editor to see your actual table structure

SELECT 
    table_name, 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('suppliers', 'products', 'categories', 'users') 
AND column_name = 'id'
ORDER BY table_name;

-- Also check if these tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('suppliers', 'products', 'categories', 'users')
ORDER BY table_name;