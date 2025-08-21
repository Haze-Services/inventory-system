"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import type { Product, Category, Supplier } from "@/lib/types"
import type { AnalyticsFilters } from "./analytics-filters"

interface AdvancedAnalyticsChartsProps {
  products: Product[]
  categories: Category[]
  suppliers: Supplier[]
  filters: AnalyticsFilters
}

export function AdvancedAnalyticsCharts({ products, categories, suppliers, filters }: AdvancedAnalyticsChartsProps) {
  // Filter products based on current filters
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.categoryId || "")) {
      return false
    }

    // Supplier filter
    if (filters.suppliers.length > 0 && !filters.suppliers.includes(product.supplierId || "")) {
      return false
    }

    // Price range filter
    if (product.sellingPrice < filters.priceRange.min || product.sellingPrice > filters.priceRange.max) {
      return false
    }

    // Stock range filter
    if (product.stockQuantity < filters.stockRange.min || product.stockQuantity > filters.stockRange.max) {
      return false
    }

    // Margin range filter
    const margin = ((product.sellingPrice - product.purchasePrice) / product.sellingPrice) * 100
    if (margin < filters.marginRange.min || margin > filters.marginRange.max) {
      return false
    }

    return true
  })

  // Chart 1: Category Performance Analysis
  const categoryPerformanceData = categories
    .map((category) => {
      const categoryProducts = filteredProducts.filter((p) => p.categoryId === category.id)
      const totalValue = categoryProducts.reduce((sum, p) => sum + p.sellingPrice * p.stockQuantity, 0)
      const totalCost = categoryProducts.reduce((sum, p) => sum + p.purchasePrice * p.stockQuantity, 0)
      const totalStock = categoryProducts.reduce((sum, p) => sum + p.stockQuantity, 0)
      const avgMargin =
        categoryProducts.length > 0
          ? categoryProducts.reduce((sum, p) => sum + ((p.sellingPrice - p.purchasePrice) / p.sellingPrice) * 100, 0) /
            categoryProducts.length
          : 0

      return {
        name: category.name,
        products: categoryProducts.length,
        totalValue,
        totalCost,
        profit: totalValue - totalCost,
        totalStock,
        avgMargin,
      }
    })
    .filter((item) => item.products > 0)

  // Chart 2: Supplier Distribution
  const supplierData = suppliers
    .map((supplier) => {
      const supplierProducts = filteredProducts.filter((p) => p.supplierId === supplier.id)
      const totalValue = supplierProducts.reduce((sum, p) => sum + p.sellingPrice * p.stockQuantity, 0)

      return {
        name: supplier.name,
        products: supplierProducts.length,
        value: totalValue,
        fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
      }
    })
    .filter((item) => item.products > 0)

  // Chart 3: Price Distribution
  const priceRanges = [
    { range: "$0-25", min: 0, max: 25, count: 0, fill: "#ef4444" },
    { range: "$25-50", min: 25, max: 50, count: 0, fill: "#f59e0b" },
    { range: "$50-100", min: 50, max: 100, count: 0, fill: "#10b981" },
    { range: "$100-200", min: 100, max: 200, count: 0, fill: "#3b82f6" },
    { range: "$200+", min: 200, max: Number.POSITIVE_INFINITY, count: 0, fill: "#8b5cf6" },
  ]

  filteredProducts.forEach((product) => {
    const range = priceRanges.find((r) => product.sellingPrice >= r.min && product.sellingPrice < r.max)
    if (range) range.count++
  })

  // Chart 4: Stock Level Trends (mock time series data)
  const stockTrendData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))

    return {
      date: date.toISOString().split("T")[0],
      totalStock: filteredProducts.reduce((sum, p) => sum + p.stockQuantity, 0) + Math.random() * 100 - 50,
      lowStock:
        filteredProducts.filter((p) => p.stockQuantity <= p.minStockLevel).length + Math.floor(Math.random() * 5),
      outOfStock: filteredProducts.filter((p) => p.stockQuantity === 0).length + Math.floor(Math.random() * 3),
    }
  })

  // Chart 5: Profit Margin vs Price Scatter
  const marginPriceData = filteredProducts.map((product) => ({
    price: product.sellingPrice,
    margin: ((product.sellingPrice - product.purchasePrice) / product.sellingPrice) * 100,
    name: product.name,
    stock: product.stockQuantity,
  }))

  // Chart 6: Category Radar Chart
  const radarData = categories
    .slice(0, 6)
    .map((category) => {
      const categoryProducts = filteredProducts.filter((p) => p.categoryId === category.id)
      const avgPrice =
        categoryProducts.length > 0
          ? categoryProducts.reduce((sum, p) => sum + p.sellingPrice, 0) / categoryProducts.length
          : 0
      const avgStock =
        categoryProducts.length > 0
          ? categoryProducts.reduce((sum, p) => sum + p.stockQuantity, 0) / categoryProducts.length
          : 0
      const avgMargin =
        categoryProducts.length > 0
          ? categoryProducts.reduce((sum, p) => sum + ((p.sellingPrice - p.purchasePrice) / p.sellingPrice) * 100, 0) /
            categoryProducts.length
          : 0

      return {
        category: category.name,
        price: Math.min(avgPrice / 10, 100), // Normalize to 0-100
        stock: Math.min(avgStock, 100),
        margin: avgMargin,
        products: Math.min(categoryProducts.length * 10, 100),
      }
    })
    .filter((item) => item.products > 0)

  const chartConfig = {
    value: { label: "Value" },
    count: { label: "Count" },
    profit: { label: "Profit" },
    margin: { label: "Margin" },
  }

  return (
    <div className="grid gap-6">
      {/* Row 1: Category Performance & Supplier Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Revenue and profit by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryPerformanceData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="totalValue" fill="#3b82f6" name="Revenue" />
                  <Bar dataKey="profit" fill="#10b981" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supplier Distribution</CardTitle>
            <CardDescription>Products by supplier</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={supplierData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="products"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {supplierData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Price Distribution & Stock Trends */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Price Distribution</CardTitle>
            <CardDescription>Products grouped by price ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceRanges.filter((r) => r.count > 0)}>
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#8b5cf6" name="Products" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Level Trends</CardTitle>
            <CardDescription>Stock levels over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stockTrendData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="totalStock"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Total Stock"
                  />
                  <Area
                    type="monotone"
                    dataKey="lowStock"
                    stackId="2"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                    name="Low Stock"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Scatter Plot & Radar Chart */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Price vs Margin Analysis</CardTitle>
            <CardDescription>Relationship between price and profit margin</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={marginPriceData}>
                  <XAxis
                    dataKey="price"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tick={{ fontSize: 12 }}
                    name="Price"
                  />
                  <YAxis dataKey="margin" type="number" tick={{ fontSize: 12 }} name="Margin %" />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          name === "price" ? `$${value}` : `${value.toFixed(1)}%`,
                          name === "price" ? "Price" : "Margin",
                        ]}
                      />
                    }
                  />
                  <Scatter dataKey="margin" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Comparison</CardTitle>
            <CardDescription>Multi-dimensional category analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} />
                  <Radar name="Performance" dataKey="margin" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
