"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardStats } from "@/components/dashboard-stats"
import { LowStockAlerts } from "@/components/low-stock-alerts"
import { InventoryChart } from "@/components/inventory-chart"
import { RecentActivity } from "@/components/recent-activity"
import { ProtectedRoute } from "@/components/protected-route"
import type { Product } from "@/lib/types"
import { productApi } from "@/lib/mock-data"

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productApi.getAll()
        setProducts(data)
      } catch (error) {
        console.error("Failed to load products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="container mx-auto py-6 px-4">
            <div className="space-y-6">
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
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your store inventory and performance</p>
          </div>

          <div className="space-y-6">
            {/* Stats Cards */}
            <DashboardStats products={products} />

            {/* Charts */}
            <InventoryChart products={products} />

            {/* Alerts and Activity */}
            <div className="grid gap-4 md:grid-cols-2">
              <LowStockAlerts products={products} />
              <RecentActivity products={products} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
