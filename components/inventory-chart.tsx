"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { Product } from "@/lib/types"

interface InventoryChartProps {
  products: Product[]
}

export function InventoryChart({ products }: InventoryChartProps) {
  // Prepare data for category distribution
  const categoryData = products.reduce(
    (acc, product) => {
      const categoryName = product.category?.name || "Uncategorized"
      const existing = acc.find((item) => item.name === categoryName)
      if (existing) {
        existing.value += product.stockQuantity
        existing.products += 1
      } else {
        acc.push({
          name: categoryName,
          value: product.stockQuantity,
          products: 1,
        })
      }
      return acc
    },
    [] as Array<{ name: string; value: number; products: number }>,
  )

  // Prepare data for stock levels
  const stockLevelData = [
    {
      name: "In Stock",
      value: products.filter((p) => p.stockQuantity > p.minStockLevel).length,
      fill: "#22c55e",
    },
    {
      name: "Low Stock",
      value: products.filter((p) => p.stockQuantity <= p.minStockLevel && p.stockQuantity > 0).length,
      fill: "#f59e0b",
    },
    {
      name: "Out of Stock",
      value: products.filter((p) => p.stockQuantity === 0).length,
      fill: "#ef4444",
    },
  ]

  const chartConfig = {
    value: {
      label: "Stock Quantity",
    },
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Stock by Category</CardTitle>
          <CardDescription>Total stock quantity per category</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [`${value} units`, name === "value" ? "Stock Quantity" : name]}
                    />
                  }
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stock Status Distribution</CardTitle>
          <CardDescription>Products by stock status</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockLevelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stockLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(value, name) => [`${value} products`, name]} />}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex justify-center gap-4 mt-4">
            {stockLevelData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
