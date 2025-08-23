"use client"

import { useState, useEffect } from "react"
import { ProductsTable } from "@/components/products-table"
import { ProductForm } from "@/components/product-form"
import { ProductFilters } from "@/components/product-filters"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"
import { apiClient } from "@/lib/api-client"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [suppliers, setSuppliers] = useState<string[]>([])
  const [currentFilters, setCurrentFilters] = useState<any>({})

  useEffect(() => {
    loadProducts()
    loadFilterOptions()
  }, [])

  const loadProducts = async (filters?: any) => {
    try {
      setLoading(true)
      const response = await apiClient.getProducts(filters)
      if (response.success && response.data) {
        setProducts(response.data)
      } else {
        throw new Error(response.error || "Failed to load products")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadFilterOptions = async () => {
    try {
      const response = await apiClient.getProducts()
      if (response.success && response.data) {
        const uniqueCategories = [...new Set(response.data.map((p: Product) => p.category).filter(Boolean))]
        const uniqueSuppliers = [...new Set(response.data.map((p: Product) => p.supplier).filter(Boolean))]
        setCategories(uniqueCategories)
        setSuppliers(uniqueSuppliers)
      }
    } catch (error) {
      console.error("Failed to load filter options:", error)
    }
  }

  const handleFiltersChange = (filters: any) => {
    setCurrentFilters(filters)
    loadProducts(filters)
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = (product: Product) => {
    setDeletingProduct(product)
  }

  const confirmDelete = async () => {
    if (!deletingProduct) return

    try {
      const response = await apiClient.deleteProduct(deletingProduct.id)
      if (response.success) {
        setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id))
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
      } else {
        throw new Error(response.error || "Failed to delete product")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    } finally {
      setDeletingProduct(null)
    }
  }

  const handleFormSubmit = async (productData: Omit<Product, "id" | "created_at" | "updated_at" | "total_profit">) => {
    try {
      setFormLoading(true)
      if (editingProduct) {
        const response = await apiClient.updateProduct(editingProduct.id, productData)
        if (response.success && response.data) {
          setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? response.data : p)) as Product[])
          toast({
            title: "Success",
            description: "Product updated successfully",
          })
        } else {
          throw new Error(response.error || "Failed to update product")
        }
      } else {
        const response = await apiClient.createProduct(productData)
        if (response.success && response.data) {
          setProducts((prev) => [...prev, response.data] as Product[])
          toast({
            title: "Success",
            description: "Product created successfully",
          })
        } else {
          throw new Error(response.error || "Failed to create product")
        }
      }
      setShowForm(false)
      setEditingProduct(null)
      loadProducts(currentFilters) // Reload with current filters instead of just loadFilterOptions
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container mx-auto py-6 px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-muted-foreground">Manage your store inventory and product information</p>
          </div>

          <div className="mb-6">
            <ProductFilters onFiltersChange={handleFiltersChange} categories={categories} suppliers={suppliers} />
          </div>

          <ProductsTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            loading={loading}
          />

          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                <DialogDescription>
                  {editingProduct
                    ? "Update product information and pricing"
                    : "Enter product details and pricing information"}
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                product={editingProduct || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                loading={formLoading}
              />
            </DialogContent>
          </Dialog>

          <AlertDialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{deletingProduct?.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
