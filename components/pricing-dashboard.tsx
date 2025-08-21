"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ScatterChart, Scatter } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react"
import type { Product } from "@/lib/types"

interface PricingDashboardProps {
  products: Product[]
}

export function PricingDashboard({ products }: PricingDashboardProps) {
  // Calculate pricing metrics
  const totalProducts = products.length
  const averageMargin =
    products.length > 0
      ? products.reduce((sum, p) => sum + ((p.sellingPrice - p.purchasePrice) / p.sellingPrice) * 100, 0) /
        products.length
      : 0

  const highMarginProducts = products.filter(
    (p) => ((p.sellingPrice - p.purchasePrice) / p.sellingPrice) * 100 > 50,
  ).length

  const lowMarginProducts = products.filter(
    (p) => ((p.sellingPrice - p.purchasePrice) / p.sellingPrice) * 100 < 20,
  ).length

  const totalPotentialRevenue = products.reduce((sum, p) => sum + p.sellingPrice * p.stockQuantity, 0)
  const totalCostValue = products.reduce((sum, p) => sum + p.purchasePrice * p.stockQuantity, 0)
  const totalPotentialProfit = totalPotentialRevenue - totalCostValue

  // Prepare data for margin distribution chart
  const marginRanges = [
    { range: "0-20%", count: 0, color: "#ef4444" },
    { range: "20-40%", count: 0, color: "#f59e0b" },
    { range: "40-60%", count: 0, color: "#10b981" },
    { range: "60%+", count: 0, color: "#3b82f6" },
  ]

  products.forEach((product) => {
    const margin = ((product.sellingPrice - product.purchasePrice) / product.sellingPrice) * 100
    if (margin < 20) marginRanges[0].count++
    else if (margin < 40) marginRanges[1].count++
    else if (margin < 60) marginRanges[2].count++
    else marginRanges[3].count++
  })

  // Prepare scatter plot data for price vs margin analysis
  const scatterData = products.map((product) => ({
    price: product.sellingPrice,
    margin: ((product.sellingPrice - product.purchasePrice) / product.sellingPrice) * 100,
    name: product.name,
  }))

  const stats = [
    {
      title: "Average Margin",
      value: `${averageMargin.toFixed(1)}%`,
      description: "Across all products",
      icon: Percent,
      trend: averageMargin > 30 ? "up" : averageMargin > 15 ? null : "down",
    },
    {
      title: "High Margin Products",
      value: highMarginProducts.toString(),
      description: "Products with >50% margin",
      icon: TrendingUp,
      trend: null,
    },
    {
      title: "Low Margin Products",
      value: lowMarginProducts.toString(),
      description: "Products with <20% margin",
      icon: TrendingDown,
      trend: lowMarginProducts > 0 ? "warning" : null,
    },
    {
      title: "Potential Profit",
      value: `$${totalPotentialProfit.toLocaleString()}`,
      description: "Total profit if all sold",
      icon: DollarSign,
      trend: null,
    },
  ]

  const chartConfig = {
    count: {
      label: "Products",
    },
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
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
                    Review
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Margin Distribution</CardTitle>
            <CardDescription>Products grouped by profit margin ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marginRanges}>
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [`${value} products`, name === "count" ? "Products" : name]}
                      />
                    }
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price vs Margin Analysis</CardTitle>
            <CardDescription>Relationship between selling price and profit margin</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={scatterData}>
                  <XAxis
                    dataKey="price"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tick={{ fontSize: 12 }}
                    label={{ value: "Selling Price ($)", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis
                    dataKey="margin"
                    type="number"
                    tick={{ fontSize: 12 }}
                    label={{ value: "Margin (%)", angle: -90, position: "insideLeft" }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, props) => [
                          name === "price" ? `$${value}` : `${value.toFixed(1)}%`,
                          name === "price" ? "Price" : "Margin",
                        ]}
                        labelFormatter={(label, payload) => payload?.[0]?.payload?.name || "Product"}
                      />
                    }
                  />
                  <Scatter dataKey="margin" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
