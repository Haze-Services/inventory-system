"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp, TrendingDown, RotateCcw } from "lucide-react"
import type { Product } from "@/lib/types"

interface RecentActivityProps {
  products: Product[]
}

export function RecentActivity({ products }: RecentActivityProps) {
  // Mock recent activities (in a real app, this would come from stock_movements table)
  const recentActivities = [
    {
      id: "1",
      type: "IN" as const,
      product: products[0],
      quantity: 50,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      reference: "PO-2024-001",
    },
    {
      id: "2",
      type: "OUT" as const,
      product: products[1],
      quantity: 5,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      reference: "SALE-001",
    },
    {
      id: "3",
      type: "ADJUSTMENT" as const,
      product: products[2],
      quantity: 3,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      reference: "ADJ-001",
    },
    {
      id: "4",
      type: "OUT" as const,
      product: products[3],
      quantity: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      reference: "SALE-002",
    },
    {
      id: "5",
      type: "IN" as const,
      product: products[4],
      quantity: 25,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      reference: "PO-2024-002",
    },
  ]

  const getActivityIcon = (type: "IN" | "OUT" | "ADJUSTMENT") => {
    switch (type) {
      case "IN":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "OUT":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "ADJUSTMENT":
        return <RotateCcw className="h-4 w-4 text-blue-500" />
    }
  }

  const getActivityLabel = (type: "IN" | "OUT" | "ADJUSTMENT") => {
    switch (type) {
      case "IN":
        return "Stock In"
      case "OUT":
        return "Stock Out"
      case "ADJUSTMENT":
        return "Adjustment"
    }
  }

  const getActivityVariant = (type: "IN" | "OUT" | "ADJUSTMENT") => {
    switch (type) {
      case "IN":
        return "default" as const
      case "OUT":
        return "secondary" as const
      case "ADJUSTMENT":
        return "outline" as const
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    }
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    }
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest stock movements and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getActivityIcon(activity.type)}
                <div>
                  <div className="font-medium">{activity.product?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {activity.type === "ADJUSTMENT" ? "Adjusted to" : activity.type === "IN" ? "Added" : "Removed"}{" "}
                    {activity.quantity} units
                  </div>
                  <div className="text-xs text-muted-foreground">Ref: {activity.reference}</div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={getActivityVariant(activity.type)}>{getActivityLabel(activity.type)}</Badge>
                <div className="text-xs text-muted-foreground mt-1">{formatTimeAgo(activity.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
