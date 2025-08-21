"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { AnalyticsFiltersComponent, type AnalyticsFilters } from "@/components/analytics-filters"
import { AdvancedAnalyticsCharts } from "@/components/advanced-analytics-charts"
import { DashboardStats } from "@/components/dashboard-stats"
import { toast } from "@/hooks/use-toast"
import type { Product, Category, Supplier } from "@/lib/types"
import { productApi, categoryApi, supplierApi } from "@/lib/mock-data"

export default function AnalyticsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState<AnalyticsFilters>({
    categories: [],
    suppliers: [],
    priceRange: { min: 0, max: 1000 },
    stockRange: { min: 0, max: 1000 },
    dateRange: { from: null, to: null },
    marginRange: { min: 0, max: 100 },
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData, suppliersData] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll(),
        supplierApi.getAll(),
      ])
      setProducts(productsData)
      setCategories(categoriesData)
      setSuppliers(suppliersData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter products based on current filters
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.categoryId || "")) {
      return false
    }

    // Supplier filter
    if (filters.suppliers.length > 0 && !filters.suppliers.includes(product.supplierId || "")) {
      return false
    }

    // Price range filter
    if (product.sellingPrice < filters.priceRange.min || product.sellingPrice > filters.priceRange.max) {
      return false
    }

    // Stock range filter
    if (product.stockQuantity < filters.stockRange.min || product.stockQuantity > filters.stockRange.max) {
      return false
    }

    // Margin range filter
    const margin = ((product.sellingPrice - product.purchasePrice) / product.sellingPrice) * 100
    if (margin < filters.marginRange.min || margin > filters.marginRange.max) {
      return false
    }

    return true
  })

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="container mx-auto py-6 px-4">
            <div className="space-y-6">
              <div className="h-32 bg-muted animate-pulse rounded-lg" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-96 bg-muted animate-pulse rounded-lg" />
                <div className="h-96 bg-muted animate-pulse rounded-lg" />
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container mx-auto py-6 px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive analytics and insights for your inventory
              {filteredProducts.length !== products.length && (
                <span className="ml-2 text-sm">
                  (Showing {filteredProducts.length} of {products.length} products)
                </span>
              )}
            </p>
          </div>

          <div className="space-y-6">
            {/* Filters */}
            <AnalyticsFiltersComponent
              categories={categories}
              suppliers={suppliers}
              filters={filters}
              onFiltersChange={setFilters}
            />

            {/* Stats Overview */}
            <DashboardStats products={filteredProducts} />

            {/* Advanced Charts */}
            <AdvancedAnalyticsCharts
              products={filteredProducts}
              categories={categories}
              suppliers={suppliers}
              filters={filters}
            />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
