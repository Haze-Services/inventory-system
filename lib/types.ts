import { UUID } from "crypto"

// Type definitions for the inventory system
export interface Category {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
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

export interface Product {
  id: string
  name: string
  description?: string
  sku: string
  real_price?: number
  purchase_price: number
  selling_price: number
  price_correction?: number
  total_profit?: number
  stock_quantity: number
  min_stock_level: number
  max_stock_level?: number
  category_id?: string
  supplier_id?: string
  is_active: boolean
  created_at?: Date
  updated_at?: Date
  // Virtual fields from joins
  category?: { name: string }
  supplier?: { name: string }
}

export interface StockMovement {
  id: string
  productId: string
  movementType: "IN" | "OUT" | "ADJUSTMENT"
  quantity: number
  referenceNumber?: string
  notes?: string
  createdAt: string
  createdBy?: string
}
