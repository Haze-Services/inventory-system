"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Calculator, Percent, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import type { Product, Category } from "@/lib/types"

interface BulkPricingToolsProps {
  products: Product[]
  categories: Category[]
  onApplyPricing: (updates: Array<{ id: string; updates: Partial<Product> }>) => Promise<void>
}

export function BulkPricingTools({ products, categories, onApplyPricing }: BulkPricingToolsProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [updateType, setUpdateType] = useState<"percentage" | "fixed" | "margin">("percentage")
  const [priceField, setPriceField] = useState<"sellingPrice" | "purchasePrice" | "realPrice">("sellingPrice")
  const [adjustmentValue, setAdjustmentValue] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const filteredProducts = products.filter(
    (product) => filterCategory === "all" || product.categoryId === filterCategory,
  )

  const selectedProductsData = products.filter((p) => selectedProducts.includes(p.id))

  const calculateNewPrice = (product: Product, field: keyof Product, value: number, type: string) => {
    const currentPrice = product[field] as number

    switch (type) {
      case "percentage":
        return currentPrice * (1 + value / 100)
      case "fixed":
        return currentPrice + value
      case "margin":
        // Set selling price based on desired margin
        if (field === "sellingPrice") {
          return product.purchasePrice / (1 - value / 100)
        }
        return currentPrice
      default:
        return currentPrice
    }
  }

  const generatePreview = () => {
    if (!adjustmentValue || selectedProducts.length === 0) return []

    const value = Number.parseFloat(adjustmentValue)
    if (isNaN(value)) return []

    return selectedProductsData.map((product) => {
      const newPrice = calculateNewPrice(product, priceField, value, updateType)
      const updates: Partial<Product> = {
        [priceField]: newPrice,
      }

      // Recalculate total profit if selling or purchase price changes
      if (priceField === "sellingPrice" || priceField === "purchasePrice") {
        const newSellingPrice = priceField === "sellingPrice" ? newPrice : product.sellingPrice
        const newPurchasePrice = priceField === "purchasePrice" ? newPrice : product.purchasePrice
        updates.totalProfit = newSellingPrice - newPurchasePrice + product.priceCorrection
      }

      return {
        product,
        updates,
        newPrice,
        oldPrice: product[priceField] as number,
        change: newPrice - (product[priceField] as number),
        changePercent: ((newPrice - (product[priceField] as number)) / (product[priceField] as number)) * 100,
      }
    })
  }

  const preview = generatePreview()

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleProductSelect = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, productId])
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId))
    }
  }

  const handleApplyChanges = async () => {
    if (preview.length === 0) return

    try {
      setLoading(true)
      const updates = preview.map((item) => ({
        id: item.product.id,
        updates: item.updates,
      }))
      await onApplyPricing(updates)
      setSelectedProducts([])
      setAdjustmentValue("")
      setPreviewMode(false)
    } catch (error) {
      console.error("Failed to apply pricing changes:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Bulk Pricing Tools
          </CardTitle>
          <CardDescription>Apply pricing changes to multiple products at once</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Category Filter</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Price Field</Label>
              <Select value={priceField} onValueChange={(value: any) => setPriceField(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sellingPrice">Selling Price</SelectItem>
                  <SelectItem value="purchasePrice">Purchase Price</SelectItem>
                  <SelectItem value="realPrice">Real Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Update Type</Label>
              <Select value={updateType} onValueChange={(value: any) => setUpdateType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage Change</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="margin">Set Margin %</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Adjustment Value */}
          <div className="space-y-2">
            <Label>
              {updateType === "percentage" && "Percentage Change (%)"}
              {updateType === "fixed" && "Fixed Amount ($)"}
              {updateType === "margin" && "Target Margin (%)"}
            </Label>
            <div className="relative">
              <Input
                type="number"
                step="0.01"
                value={adjustmentValue}
                onChange={(e) => setAdjustmentValue(e.target.value)}
                placeholder={
                  updateType === "percentage"
                    ? "e.g., 10 for +10%"
                    : updateType === "fixed"
                      ? "e.g., 5.00 for +$5.00"
                      : "e.g., 30 for 30% margin"
                }
                className="pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {updateType === "percentage" || updateType === "margin" ? (
                  <Percent className="h-4 w-4" />
                ) : (
                  <DollarSign className="h-4 w-4" />
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Product Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Select Products</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">Select All ({filteredProducts.length})</span>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto border rounded-lg">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => handleProductSelect(product.id, !!checked)}
                    />
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Current {priceField.replace(/([A-Z])/g, " $1").toLowerCase()}: $
                        {(product[priceField] as number).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{product.category?.name || "Uncategorized"}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Preview Changes</Label>
                <Badge variant="secondary">{preview.length} products</Badge>
              </div>

              <div className="max-h-48 overflow-y-auto border rounded-lg">
                {preview.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                    <div>
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ${item.oldPrice.toFixed(2)} → ${item.newPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`flex items-center gap-1 text-sm font-medium ${
                          item.change > 0
                            ? "text-green-600"
                            : item.change < 0
                              ? "text-red-600"
                              : "text-muted-foreground"
                        }`}
                      >
                        {item.change > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : item.change < 0 ? (
                          <TrendingDown className="h-3 w-3" />
                        ) : null}
                        {item.change > 0 ? "+" : ""}${item.change.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.changePercent > 0 ? "+" : ""}
                        {item.changePercent.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Alert>
                <AlertDescription>
                  This will update {preview.length} products. Changes will recalculate profit margins automatically.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button onClick={handleApplyChanges} disabled={loading}>
                  {loading ? "Applying Changes..." : "Apply Changes"}
                </Button>
                <Button variant="outline" onClick={() => setPreviewMode(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
