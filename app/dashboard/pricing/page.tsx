"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PricingDashboard } from "@/components/pricing-dashboard"
import { BulkPricingTools } from "@/components/bulk-pricing-tools"
import { PricingAnalysis } from "@/components/pricing-analysis"
import { ProductForm } from "@/components/product-form"
import { ProtectedRoute } from "@/components/protected-route"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import type { Product, Category } from "@/lib/types"
import { productApi, categoryApi } from "@/lib/mock-data"

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData] = await Promise.all([productApi.getAll(), categoryApi.getAll()])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pricing data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBulkPricingUpdate = async (updates: Array<{ id: string; updates: Partial<Product> }>) => {
    try {
      const updatedProducts = [...products]

      for (const update of updates) {
        const index = updatedProducts.findIndex((p) => p.id === update.id)
        if (index !== -1) {
          const updated = await productApi.update(update.id, update.updates)
          if (updated) {
            updatedProducts[index] = updated
          }
        }
      }

      setProducts(updatedProducts)
      toast({
        title: "Success",
        description: `Updated pricing for ${updates.length} products`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update pricing",
        variant: "destructive",
      })
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
  }

  const handleFormSubmit = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt" | "totalProfit">) => {
    if (!editingProduct) return

    try {
      setFormLoading(true)
      const updated = await productApi.update(editingProduct.id, productData)
      if (updated) {
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)))
        toast({
          title: "Success",
          description: "Product pricing updated successfully",
        })
        setEditingProduct(null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product pricing",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

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
              <div className="h-96 bg-muted animate-pulse rounded-lg" />
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
            <h1 className="text-3xl font-bold">Pricing Management</h1>
            <p className="text-muted-foreground">Analyze and manage product pricing and profit margins</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bulk-tools">Bulk Tools</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <PricingDashboard products={products} />
            </TabsContent>

            <TabsContent value="bulk-tools">
              <BulkPricingTools products={products} categories={categories} onApplyPricing={handleBulkPricingUpdate} />
            </TabsContent>

            <TabsContent value="analysis">
              <PricingAnalysis products={products} onEditProduct={handleEditProduct} />
            </TabsContent>
          </Tabs>

          <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Product Pricing</DialogTitle>
                <DialogDescription>Update pricing information for {editingProduct?.name}</DialogDescription>
              </DialogHeader>
              {editingProduct && (
                <ProductForm
                  product={editingProduct}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setEditingProduct(null)}
                  loading={formLoading}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
