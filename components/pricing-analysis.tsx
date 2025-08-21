"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign } from "lucide-react"
import type { Product } from "@/lib/types"

interface PricingAnalysisProps {
  products: Product[]
  onEditProduct: (product: Product) => void
}

export function PricingAnalysis({ products, onEditProduct }: PricingAnalysisProps) {
  // Analyze pricing issues
  const lowMarginProducts = products
    .filter((p) => {
      const margin = ((p.sellingPrice - p.purchasePrice) / p.sellingPrice) * 100
      return margin < 20
    })
    .sort((a, b) => {
      const marginA = ((a.sellingPrice - a.purchasePrice) / a.sellingPrice) * 100
      const marginB = ((b.sellingPrice - b.purchasePrice) / b.sellingPrice) * 100
      return marginA - marginB
    })

  const highMarginProducts = products
    .filter((p) => {
      const margin = ((p.sellingPrice - p.purchasePrice) / p.sellingPrice) * 100
      return margin > 70
    })
    .sort((a, b) => {
      const marginA = ((a.sellingPrice - a.purchasePrice) / a.sellingPrice) * 100
      const marginB = ((b.sellingPrice - b.purchasePrice) / b.sellingPrice) * 100
      return marginB - marginA
    })

  const negativeMarginProducts = products.filter((p) => p.sellingPrice < p.purchasePrice)

  const getMarginBadge = (product: Product) => {
    const margin = ((product.sellingPrice - product.purchasePrice) / product.sellingPrice) * 100
    if (margin < 0) return { variant: "destructive" as const, label: "Loss" }
    if (margin < 10) return { variant: "destructive" as const, label: "Very Low" }
    if (margin < 20) return { variant: "secondary" as const, label: "Low" }
    if (margin < 40) return { variant: "default" as const, label: "Good" }
    if (margin < 60) return { variant: "default" as const, label: "High" }
    return { variant: "default" as const, label: "Very High" }
  }

  const formatMargin = (product: Product) => {
    const margin = ((product.sellingPrice - product.purchasePrice) / product.sellingPrice) * 100
    return margin.toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Negative Margins Alert */}
      {negativeMarginProducts.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Products Selling at a Loss
            </CardTitle>
            <CardDescription>These products have selling prices lower than purchase prices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {negativeMarginProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-destructive/5"
                >
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Purchase: ${product.purchasePrice.toFixed(2)} | Selling: ${product.sellingPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-destructive font-medium">
                      -${(product.purchasePrice - product.sellingPrice).toFixed(2)} loss
                    </div>
                    <Button size="sm" variant="outline" onClick={() => onEditProduct(product)}>
                      Fix Pricing
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Low Margin Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-500" />
              Low Margin Products
            </CardTitle>
            <CardDescription>Products with margins below 20% (showing top 10)</CardDescription>
          </CardHeader>
          <CardContent>
            {lowMarginProducts.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>All products have healthy margins!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowMarginProducts.slice(0, 10).map((product) => {
                  const badge = getMarginBadge(product)
                  return (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${product.purchasePrice.toFixed(2)} → ${product.sellingPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={badge.variant}>{formatMargin(product)}%</Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          ${product.totalProfit.toFixed(2)} profit
                        </div>
                      </div>
                    </div>
                  )
                })}
                {lowMarginProducts.length > 10 && (
                  <div className="text-center text-sm text-muted-foreground">
                    +{lowMarginProducts.length - 10} more products
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* High Margin Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              High Margin Products
            </CardTitle>
            <CardDescription>Products with margins above 70% (showing top 10)</CardDescription>
          </CardHeader>
          <CardContent>
            {highMarginProducts.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No products with very high margins.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {highMarginProducts.slice(0, 10).map((product) => {
                  const badge = getMarginBadge(product)
                  return (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${product.purchasePrice.toFixed(2)} → ${product.sellingPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={badge.variant}>{formatMargin(product)}%</Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          ${product.totalProfit.toFixed(2)} profit
                        </div>
                      </div>
                    </div>
                  )
                })}
                {highMarginProducts.length > 10 && (
                  <div className="text-center text-sm text-muted-foreground">
                    +{highMarginProducts.length - 10} more products
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Pricing Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Pricing Analysis</CardTitle>
          <CardDescription>Complete pricing breakdown for all products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Purchase Price</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Real Price</TableHead>
                  <TableHead>Correction</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const badge = getMarginBadge(product)
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>${product.purchasePrice.toFixed(2)}</TableCell>
                      <TableCell>${product.sellingPrice.toFixed(2)}</TableCell>
                      <TableCell>${product.realPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        {product.priceCorrection !== 0 ? (
                          <span className={product.priceCorrection > 0 ? "text-green-600" : "text-red-600"}>
                            {product.priceCorrection > 0 ? "+" : ""}${product.priceCorrection.toFixed(2)}
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="font-medium">${product.totalProfit.toFixed(2)}</TableCell>
                      <TableCell>{formatMargin(product)}%</TableCell>
                      <TableCell>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
