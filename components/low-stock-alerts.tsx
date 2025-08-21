"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package } from "lucide-react"
import type { Product } from "@/lib/types"
import Link from "next/link"

interface LowStockAlertsProps {
  products: Product[]
}

export function LowStockAlerts({ products }: LowStockAlertsProps) {
  const lowStockProducts = products
    .filter((p) => p.stockQuantity <= p.minStockLevel && p.isActive)
    .sort((a, b) => a.stockQuantity - b.stockQuantity)
    .slice(0, 5) // Show top 5 most critical

  if (lowStockProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Stock Alerts
          </CardTitle>
          <CardDescription>Monitor products with low stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">All products are well stocked!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Stock Alerts
          <Badge variant="secondary">{lowStockProducts.length}</Badge>
        </CardTitle>
        <CardDescription>Products that need restocking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                <div className="text-sm text-muted-foreground">
                  Category: {product.category?.name || "Uncategorized"}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Badge variant={product.stockQuantity === 0 ? "destructive" : "secondary"}>
                    {product.stockQuantity === 0 ? "Out of Stock" : "Low Stock"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {product.stockQuantity} / {product.minStockLevel} min
                </div>
              </div>
            </div>
          ))}
          <div className="pt-2">
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
