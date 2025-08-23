import { Category, Product, Supplier } from "./types"

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  total?: number
}

interface ProductFilters {
  search?: string
  category?: string
  supplier?: string
  lowStock?: boolean
  outOfStock?: boolean
  inStock?: boolean
  priceRange?: "under50" | "50to100" | "over100"
  sortBy?: "name" | "price" | "stock" | "profit"
  sortOrder?: "asc" | "desc"
}

class ApiClient {
  private baseUrl = "/api/v1"

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Product endpoints
  async getProducts(filters?: ProductFilters): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams()

    if (filters?.search) params.append("search", filters.search)
    if (filters?.category) params.append("category", filters.category)
    if (filters?.supplier) params.append("supplier", filters.supplier)
    if (filters?.lowStock) params.append("lowStock", "true")
    if (filters?.outOfStock) params.append("outOfStock", "true")
    if (filters?.inStock) params.append("inStock", "true")
    if (filters?.priceRange) params.append("priceRange", filters.priceRange)
    if (filters?.sortBy) params.append("sortBy", filters.sortBy)
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder)

    const queryString = params.toString()
    const endpoint = `/products${queryString ? `?${queryString}` : ""}`

    return this.request(endpoint)
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`)
  }

  async createProduct(productData: any) {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(id: string, productData: any) {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    })
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    })
  }

  // New category and supplier endpoints
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request('/categories')
  }

  async getSuppliers(): Promise<ApiResponse<Supplier[]>> {
    return this.request('/suppliers')
  }
}

export const apiClient = new ApiClient()
