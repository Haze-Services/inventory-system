"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Product, Category, Supplier } from "@/lib/types"
import { categoryApi, supplierApi } from "@/lib/mock-data"

interface ProductFormProps {
  product?: Product
  onSubmit: (product: Omit<Product, "id" | "createdAt" | "updatedAt" | "totalProfit">) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function ProductForm({ product, onSubmit, onCancel, loading = false }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    sku: product?.sku || "",
    realPrice: product?.realPrice?.toString() || "",
    purchasePrice: product?.purchasePrice?.toString() || "",
    sellingPrice: product?.sellingPrice?.toString() || "",
    priceCorrection: product?.priceCorrection?.toString() || "0",
    stockQuantity: product?.stockQuantity?.toString() || "0",
    minStockLevel: product?.minStockLevel?.toString() || "0",
    maxStockLevel: product?.maxStockLevel?.toString() || "",
    categoryId: product?.categoryId || "",
    supplierId: product?.supplierId || "",
    isActive: product?.isActive ?? true,
  })
  const [error, setError] = useState("")

  // Calculate total profit in real-time
  const totalProfit =
    (Number.parseFloat(formData.sellingPrice) || 0) -
    (Number.parseFloat(formData.purchasePrice) || 0) +
    (Number.parseFloat(formData.priceCorrection) || 0)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, suppliersData] = await Promise.all([categoryApi.getAll(), supplierApi.getAll()])
        setCategories(categoriesData)
        setSuppliers(suppliersData)
      } catch (err) {
        setError("Failed to load categories and suppliers")
      }
    }
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        sku: formData.sku,
        realPrice: Number.parseFloat(formData.realPrice),
        purchasePrice: Number.parseFloat(formData.purchasePrice),
        sellingPrice: Number.parseFloat(formData.sellingPrice),
        priceCorrection: Number.parseFloat(formData.priceCorrection) || 0,
        stockQuantity: Number.parseInt(formData.stockQuantity),
        minStockLevel: Number.parseInt(formData.minStockLevel),
        maxStockLevel: formData.maxStockLevel ? Number.parseInt(formData.maxStockLevel) : undefined,
        categoryId: formData.categoryId || undefined,
        supplierId: formData.supplierId || undefined,
        isActive: formData.isActive,
      }

      await onSubmit(productData)
    } catch (err) {
      setError("Failed to save product")
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
        <CardDescription>
          {product ? "Update product information and pricing" : "Enter product details and pricing information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="Enter SKU"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pricing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="realPrice">Real Price (Precio Real) *</Label>
                <Input
                  id="realPrice"
                  type="number"
                  step="0.01"
                  value={formData.realPrice}
                  onChange={(e) => handleInputChange("realPrice", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price (Precio Compra) *</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Selling Price (Precio Venta) *</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) => handleInputChange("sellingPrice", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceCorrection">Price Correction</Label>
                <Input
                  id="priceCorrection"
                  type="number"
                  step="0.01"
                  value={formData.priceCorrection}
                  onChange={(e) => handleInputChange("priceCorrection", e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">
                Total Profit (Ganancia Total): <span className="text-green-600">${totalProfit.toFixed(2)}</span>
              </p>
            </div>
          </div>

          {/* Inventory Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Inventory Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Current Stock *</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStockLevel">Min Stock Level *</Label>
                <Input
                  id="minStockLevel"
                  type="number"
                  value={formData.minStockLevel}
                  onChange={(e) => handleInputChange("minStockLevel", e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStockLevel">Max Stock Level</Label>
                <Input
                  id="maxStockLevel"
                  type="number"
                  value={formData.maxStockLevel}
                  onChange={(e) => handleInputChange("maxStockLevel", e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          {/* Category and Supplier */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Category & Supplier</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.categoryId} onValueChange={(value) => handleInputChange("categoryId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select value={formData.supplierId} onValueChange={(value) => handleInputChange("supplierId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
