import type { Product, Category, Supplier, Warranty, WarrantyPayment } from "./types"

const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options)
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    const error = new Error(errorBody.error || "An error occurred while fetching the data.")
    throw error
  }
  return res.json()
}

export const apiClient = {
  // Products
  getProducts: (filters?: any) => {
    const params = new URLSearchParams(filters).toString()
    return fetcher(`/api/v1/products?${params}`)
  },
  getProduct: (id: string) => fetcher(`/api/v1/products/${id}`),
  createProduct: (data: Omit<Product, "id" | "created_at" | "updated_at" | "total_profit">) =>
    fetcher("/api/v1/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  updateProduct: (id: string, data: Partial<Product>) =>
    fetcher(`/api/v1/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  deleteProduct: (id: string) =>
    fetcher(`/api/v1/products/${id}`, {
      method: "DELETE",
    }),

  // Categories
  getCategories: () => fetcher("/api/v1/categories"),

  // Suppliers
  getSuppliers: () => fetcher("/api/v1/suppliers"),

  // Warranties
  getWarranties: (filters?: { search?: string, productId?: string }) => {
    const params = new URLSearchParams(filters as any).toString()
    return fetcher(`/api/v1/warranties?${params}`)
  },
  getWarranty: (id: string) => fetcher(`/api/v1/warranties/${id}`),
  createWarranty: (data: any) =>
    fetcher("/api/v1/warranties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  updateWarranty: (id: string, data: Partial<Warranty>) =>
    fetcher(`/api/v1/warranties/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  deleteWarranty: (id: string) =>
    fetcher(`/api/v1/warranties/${id}`, {
      method: "DELETE",
    }),
  createWarrantyPayment: (warrantyId: string, data: Omit<WarrantyPayment, "id" | "warranty_id" | "created_at" | "payment_date">) =>
    fetcher(`/api/v1/warranties/${warrantyId}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
}