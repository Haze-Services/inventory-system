// Mock data for development (replace with Supabase queries later)
import type { Product, Category, Supplier } from "./types"

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    description: "Electronic devices and accessories",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Clothing",
    description: "Apparel and fashion items",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Home & Garden",
    description: "Home improvement and garden supplies",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Books",
    description: "Books and educational materials",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Sports",
    description: "Sports equipment and accessories",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "TechSupply Co.",
    contactPerson: "John Smith",
    email: "john@techsupply.com",
    phone: "+1-555-0101",
    address: "123 Tech Street, Silicon Valley, CA",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Fashion Wholesale",
    contactPerson: "Maria Garcia",
    email: "maria@fashionwholesale.com",
    phone: "+1-555-0102",
    address: "456 Fashion Ave, New York, NY",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "HomeGoods Direct",
    contactPerson: "David Johnson",
    email: "david@homegoods.com",
    phone: "+1-555-0103",
    address: "789 Home Blvd, Chicago, IL",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    sku: "WBH-001",
    realPrice: 79.99,
    purchasePrice: 45.0,
    sellingPrice: 89.99,
    priceCorrection: 0,
    totalProfit: 44.99,
    stockQuantity: 25,
    minStockLevel: 5,
    maxStockLevel: 100,
    categoryId: "1",
    category: mockCategories[0],
    supplierId: "1",
    supplier: mockSuppliers[0],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Cotton T-Shirt - Blue",
    description: "Comfortable cotton t-shirt in blue color",
    sku: "CTS-BLU-001",
    realPrice: 12.99,
    purchasePrice: 8.0,
    sellingPrice: 19.99,
    priceCorrection: 0,
    totalProfit: 11.99,
    stockQuantity: 50,
    minStockLevel: 10,
    maxStockLevel: 200,
    categoryId: "2",
    category: mockCategories[1],
    supplierId: "2",
    supplier: mockSuppliers[1],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Garden Hose 50ft",
    description: "Durable 50-foot garden hose with spray nozzle",
    sku: "GH-50-001",
    realPrice: 29.99,
    purchasePrice: 18.0,
    sellingPrice: 39.99,
    priceCorrection: 0,
    totalProfit: 21.99,
    stockQuantity: 15,
    minStockLevel: 3,
    maxStockLevel: 50,
    categoryId: "3",
    category: mockCategories[2],
    supplierId: "3",
    supplier: mockSuppliers[2],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Programming Fundamentals Book",
    description: "Comprehensive guide to programming fundamentals",
    sku: "PFB-001",
    realPrice: 34.99,
    purchasePrice: 20.0,
    sellingPrice: 49.99,
    priceCorrection: 0,
    totalProfit: 29.99,
    stockQuantity: 30,
    minStockLevel: 5,
    maxStockLevel: 100,
    categoryId: "4",
    category: mockCategories[3],
    supplierId: "3",
    supplier: mockSuppliers[2],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Basketball Official Size",
    description: "Official size basketball for indoor/outdoor use",
    sku: "BB-OFF-001",
    realPrice: 24.99,
    purchasePrice: 15.0,
    sellingPrice: 34.99,
    priceCorrection: 0,
    totalProfit: 19.99,
    stockQuantity: 2,
    minStockLevel: 5,
    maxStockLevel: 30,
    categoryId: "5",
    category: mockCategories[4],
    supplierId: "1",
    supplier: mockSuppliers[0],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

// Mock API functions (replace with Supabase later)
export const productApi = {
  getAll: async (): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockProducts
  },

  getById: async (id: string): Promise<Product | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockProducts.find((p) => p.id === id) || null
  },

  create: async (product: Omit<Product, "id" | "createdAt" | "updatedAt" | "totalProfit">): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      totalProfit: product.sellingPrice - product.purchasePrice + product.priceCorrection,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockProducts.push(newProduct)
    return newProduct
  },

  update: async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) return null

    const updatedProduct = {
      ...mockProducts[index],
      ...updates,
      totalProfit:
        (updates.sellingPrice || mockProducts[index].sellingPrice) -
        (updates.purchasePrice || mockProducts[index].purchasePrice) +
        (updates.priceCorrection || mockProducts[index].priceCorrection),
      updatedAt: new Date().toISOString(),
    }
    mockProducts[index] = updatedProduct
    return updatedProduct
  },

  delete: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) return false
    mockProducts.splice(index, 1)
    return true
  },
}

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockCategories
  },

  getById: async (id: string): Promise<Category | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockCategories.find((c) => c.id === id) || null
  },

  create: async (category: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockCategories.push(newCategory)
    return newCategory
  },

  update: async (id: string, updates: Partial<Category>): Promise<Category | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockCategories.findIndex((c) => c.id === id)
    if (index === -1) return null

    const updatedCategory = {
      ...mockCategories[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    mockCategories[index] = updatedCategory
    return updatedCategory
  },

  delete: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = mockCategories.findIndex((c) => c.id === id)
    if (index === -1) return false
    mockCategories.splice(index, 1)
    return true
  },

  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockProducts.filter((p) => p.categoryId === categoryId)
  },
}

export const supplierApi = {
  getAll: async (): Promise<Supplier[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockSuppliers
  },

  getById: async (id: string): Promise<Supplier | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockSuppliers.find((s) => s.id === id) || null
  },

  create: async (supplier: Omit<Supplier, "id" | "createdAt" | "updatedAt">): Promise<Supplier> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockSuppliers.push(newSupplier)
    return newSupplier
  },

  update: async (id: string, updates: Partial<Supplier>): Promise<Supplier | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockSuppliers.findIndex((s) => s.id === id)
    if (index === -1) return null

    const updatedSupplier = {
      ...mockSuppliers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    mockSuppliers[index] = updatedSupplier
    return updatedSupplier
  },

  delete: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = mockSuppliers.findIndex((s) => s.id === id)
    if (index === -1) return false
    mockSuppliers.splice(index, 1)
    return true
  },

  getProductsBySupplier: async (supplierId: string): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockProducts.filter((p) => p.supplierId === supplierId)
  },
}
