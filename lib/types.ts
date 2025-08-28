export interface Product {
  id: string
  name: string
  description?: string
  sku: string
  real_price: number
  purchase_price: number
  selling_price: number
  price_correction: number
  total_profit: number
  stock_quantity: number
  min_stock_level: number
  max_stock_level?: number
  category_id?: string
  category?: Category
  supplier_id?: string
  supplier?: Supplier
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Supplier {
  id: string
  name: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export interface Warranty {
  id: string
  product_id: string
  product?: Product // Optional, for joined queries
  customer_name: string
  customer_email?: string
  customer_phone?: string
  purchase_date: string // ISO date string
  warranty_period_months: number
  expiry_date: string // ISO date string
  status: "active" | "expired" | "claimed" | "void"
  notes?: string
  created_at: string
  updated_at: string
  payment?: WarrantyPayment // Optional, for joined queries
}

export interface WarrantyPayment {
  id: string
  warranty_id: string
  amount: number
  payment_method: string
  transaction_id?: string
  payment_date: string // ISO date string
  status: "completed" | "pending" | "failed"
  created_at: string
}