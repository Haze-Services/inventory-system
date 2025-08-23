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
import { apiClient } from "@/lib/api-client"

interface ProductFormProps {
  product?: Product
  onSubmit: (product: Omit<Product, "id" | "created_at" | "updated_at" | "total_profit">) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

const validateProduct = (data: any) => {
  const errors: string[] = []

  console.log("Validating product data:", data)

  if (!data.name?.trim()) {
    errors.push("Product name is required")
  }

  if (!data.sku?.trim()) {
    errors.push("SKU is required")
  }

  if (!data.real_price || isNaN(Number(data.real_price))) {
    errors.push("Real price is required and must be a number")
  }

  if (!data.purchase_price || isNaN(Number(data.purchase_price))) {
    errors.push("Purchase price is required and must be a number")
  }

  if (!data.selling_price || isNaN(Number(data.selling_price))) {
    errors.push("Selling price is required and must be a number")
  }

  if (!data.stock_quantity || isNaN(Number(data.stock_quantity))) {
    errors.push("Stock quantity is required and must be a number")
  }

  if (!data.min_stock_level || isNaN(Number(data.min_stock_level))) {
    errors.push("Minimum stock level is required and must be a number")
  }

  return errors
}

// Add this helper function at the top of the file
const getCategoryIdByName = (categories: Array<{ id: string, name: string }>, name: string) => {
  const category = categories.find(c => c.name.toLowerCase() === name.toLowerCase())
  return category?.id || ''
}

export function ProductForm({ product, onSubmit, onCancel, loading = false }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    sku: product?.sku || "",
    real_price: product?.real_price?.toString() || "",
    purchase_price: product?.purchase_price?.toString() || "",
    selling_price: product?.selling_price?.toString() || "",
    price_correction: product?.price_correction?.toString() || "0",
    stock_quantity: product?.stock_quantity?.toString() || "0",
    min_stock_level: product?.min_stock_level?.toString() || "0",
    max_stock_level: product?.max_stock_level?.toString() || "",
    category_id: product?.category_id || "",
    supplier_id: product?.supplier_id || "",
    is_active: product?.is_active ?? true,
  })
  const [categories, setCategories] = useState<Array<{ id: string, name: string }>>([])
  const [suppliers, setSuppliers] = useState<Array<{ id: string, name: string }>>([])
  const [error, setError] = useState("")

  // Calculate total profit in real-time
  const totalProfit =
    (Number.parseFloat(formData.selling_price) || 0) -
    (Number.parseFloat(formData.purchase_price) || 0) +
    (Number.parseFloat(formData.price_correction) || 0)

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesResponse = await apiClient.getCategories()
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data as Array<{ id: string, name: string }>)
        } else {
          throw new Error(categoriesResponse.error || "Failed to load categories")
        }

        const suppliersResponse = await apiClient.getSuppliers()
        if (suppliersResponse.success) {
          setSuppliers(suppliersResponse.data as Array<{ id: string, name: string }>)
        }
      } catch (err) {
        console.error('Error loading data:', err)
        setError(err instanceof Error ? err.message : "Failed to load form data")
      }
    }

    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description,
        sku: formData.sku.trim(),
        real_price: Number.parseFloat(formData.real_price),
        purchase_price: Number.parseFloat(formData.purchase_price),
        selling_price: Number.parseFloat(formData.selling_price),
        price_correction: Number.parseFloat(formData.price_correction) || 0,
        stock_quantity: Number.parseInt(formData.stock_quantity),
        min_stock_level: Number.parseInt(formData.min_stock_level),
        max_stock_level: formData.max_stock_level ? Number.parseInt(formData.max_stock_level) : undefined,
        category_id: formData.category_id || undefined,
        supplier_id: formData.supplier_id || undefined,
        is_active: formData.is_active,
      }

      // Validate before submitting
      const validationErrors = validateProduct(productData)
      if (validationErrors.length > 0) {
        setError(validationErrors.join(", "))
        return
      }

      await onSubmit(productData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product")
    }
  }

  type InputValue = string | number | boolean;

  const handleInputChange = (field: string, value: InputValue) => {
    setFormData((prev) => {
      // Handle category selection
      if (field === 'category_id') {
        // If value is a category name, convert it to ID
        const categoryId = typeof value === 'string'
          ? getCategoryIdByName(categories, value)
          : value.toString()
        console.log(`Setting category: name=${value}, id=${categoryId}`)
        return { ...prev, [field]: categoryId }
      }

      // Handle supplier selection
      if (field === 'supplier_id') {
        return { ...prev, [field]: value || '' }
      }

      // Handle numeric fields
      if (field.includes('price') ||
        field.includes('quantity') ||
        field.includes('stock_level')) {
        const numericValue = value === '' ? '0' : value.toString()
        return { ...prev, [field]: numericValue }
      }

      // Handle boolean fields
      if (typeof value === 'boolean') {
        return { ...prev, [field]: value }
      }

      // Handle all other fields
      return { ...prev, [field]: value }
    })
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
                  value={formData.real_price}
                  onChange={(e) => handleInputChange("real_price", e.target.value)}
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
                  value={formData.purchase_price}
                  onChange={(e) => handleInputChange("purchase_price", e.target.value)}
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
                  value={formData.selling_price}
                  onChange={(e) => handleInputChange("selling_price", e.target.value)}
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
                  value={formData.price_correction}
                  onChange={(e) => handleInputChange("price_correction", e.target.value)}
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
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange("stock_quantity", e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStockLevel">Min Stock Level *</Label>
                <Input
                  id="minStockLevel"
                  type="number"
                  value={formData.min_stock_level}
                  onChange={(e) => handleInputChange("min_stock_level", e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStockLevel">Max Stock Level</Label>
                <Input
                  id="maxStockLevel"
                  type="number"
                  value={formData.max_stock_level}
                  onChange={(e) => handleInputChange("max_stock_level", e.target.value)}
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
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={categories.find(c => c.id === formData.category_id)?.name || ''}
                  onValueChange={(name) => handleInputChange("category_id", name)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select value={formData.supplier_id} onValueChange={(value) => handleInputChange("supplier_id", value)}>
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
