// Type definitions for the inventory system
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

export interface Product {
  id: string
  name: string
  description?: string
  sku: string
  realPrice: number // Precio real
  purchasePrice: number // Precio compra
  sellingPrice: number // Precio venta
  priceCorrection: number // Price correction
  totalProfit: number // Calculated: sellingPrice - purchasePrice + priceCorrection
  stockQuantity: number
  minStockLevel: number
  maxStockLevel?: number
  categoryId?: string
  category?: Category
  supplierId?: string
  supplier?: Supplier
  isActive: boolean
  createdAt: string
  updatedAt: string
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
