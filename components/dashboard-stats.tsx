"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Package, AlertTriangle, DollarSign, ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/types"

interface DashboardStatsProps {
  products: Product[]
}

export function DashboardStats({ products }: DashboardStatsProps) {
  // Calculate metrics
  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.isActive).length
  const lowStockProducts = products.filter((p) => p.stockQuantity <= p.minStockLevel).length
  const outOfStockProducts = products.filter((p) => p.stockQuantity === 0).length

  const totalInventoryValue = products.reduce((sum, p) => sum + p.purchasePrice * p.stockQuantity, 0)
  const totalSellingValue = products.reduce((sum, p) => sum + p.sellingPrice * p.stockQuantity, 0)
  const potentialProfit = products.reduce((sum, p) => sum + p.totalProfit * p.stockQuantity, 0)

  const averageProfit = products.length > 0 ? potentialProfit / totalInventoryValue : 0

  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      description: `${activeProducts} active products`,
      icon: Package,
      trend: null,
    },
    {
      title: "Low Stock Alerts",
      value: lowStockProducts.toString(),
      description: `${outOfStockProducts} out of stock`,
      icon: AlertTriangle,
      trend: lowStockProducts > 0 ? "warning" : null,
    },
    {
      title: "Inventory Value",
      value: `$${totalInventoryValue.toLocaleString()}`,
      description: "Total purchase value",
      icon: DollarSign,
      trend: null,
    },
    {
      title: "Potential Revenue",
      value: `$${totalSellingValue.toLocaleString()}`,
      description: `${(averageProfit * 100).toFixed(1)}% avg profit margin`,
      icon: ShoppingCart,
      trend: averageProfit > 0.3 ? "up" : averageProfit > 0.1 ? null : "down",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{stat.description}</span>
              {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
              {stat.trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
              {stat.trend === "warning" && (
                <Badge variant="secondary" className="text-xs">
                  Alert
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
