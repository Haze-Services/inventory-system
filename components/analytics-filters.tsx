"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import type { Category, Supplier } from "@/lib/types"

export interface AnalyticsFilters {
  categories: string[]
  suppliers: string[]
  priceRange: { min: number; max: number }
  stockRange: { min: number; max: number }
  dateRange: { from: Date | null; to: Date | null }
  marginRange: { min: number; max: number }
}

interface AnalyticsFiltersProps {
  categories: Category[]
  suppliers: Supplier[]
  filters: AnalyticsFilters
  onFiltersChange: (filters: AnalyticsFilters) => void
}

export function AnalyticsFiltersComponent({ categories, suppliers, filters, onFiltersChange }: AnalyticsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilters = (updates: Partial<AnalyticsFilters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      suppliers: [],
      priceRange: { min: 0, max: 1000 },
      stockRange: { min: 0, max: 1000 },
      dateRange: { from: null, to: null },
      marginRange: { min: 0, max: 100 },
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.suppliers.length > 0) count++
    if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) count++
    if (filters.stockRange.min > 0 || filters.stockRange.max < 1000) count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    if (filters.marginRange.min > 0 || filters.marginRange.max < 100) count++
    return count
  }

  const removeCategory = (categoryId: string) => {
    updateFilters({
      categories: filters.categories.filter((id) => id !== categoryId),
    })
  }

  const removeSupplier = (supplierId: string) => {
    updateFilters({
      suppliers: filters.suppliers.filter((id) => id !== supplierId),
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Analytics Filters
            {getActiveFiltersCount() > 0 && <Badge variant="secondary">{getActiveFiltersCount()}</Badge>}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
            {getActiveFiltersCount() > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Quick Filters */}
          <div>
            <Label className="text-sm font-medium">Quick Filters</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                variant={filters.stockRange.max <= 10 ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilters({ stockRange: { min: 0, max: 10 } })}
              >
                Low Stock (≤10)
              </Button>
              <Button
                variant={filters.stockRange.min === 0 && filters.stockRange.max === 0 ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilters({ stockRange: { min: 0, max: 0 } })}
              >
                Out of Stock
              </Button>
              <Button
                variant={filters.marginRange.max <= 20 ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilters({ marginRange: { min: 0, max: 20 } })}
              >
                Low Margin (≤20%)
              </Button>
              <Button
                variant={filters.marginRange.min >= 50 ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilters({ marginRange: { min: 50, max: 100 } })}
              >
                High Margin (≥50%)
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Categories */}
            <div>
              <Label className="text-sm font-medium">Categories</Label>
              <Select
                onValueChange={(value) => {
                  if (!filters.categories.includes(value)) {
                    updateFilters({ categories: [...filters.categories, value] })
                  }
                }}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select categories" />
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

            {/* Suppliers */}
            <div>
              <Label className="text-sm font-medium">Suppliers</Label>
              <Select
                onValueChange={(value) => {
                  if (!filters.suppliers.includes(value)) {
                    updateFilters({ suppliers: [...filters.suppliers, value] })
                  }
                }}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select suppliers" />
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

            {/* Date Range */}
            <div>
              <Label className="text-sm font-medium">Date Range</Label>
              <div className="flex gap-2 mt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {filters.dateRange.from ? format(filters.dateRange.from, "MMM dd") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from || undefined}
                      onSelect={(date) =>
                        updateFilters({
                          dateRange: { ...filters.dateRange, from: date || null },
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {filters.dateRange.to ? format(filters.dateRange.to, "MMM dd") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to || undefined}
                      onSelect={(date) =>
                        updateFilters({
                          dateRange: { ...filters.dateRange, to: date || null },
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <Label className="text-sm font-medium">Price Range ($)</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) =>
                    updateFilters({
                      priceRange: { ...filters.priceRange, min: Number(e.target.value) },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) =>
                    updateFilters({
                      priceRange: { ...filters.priceRange, max: Number(e.target.value) },
                    })
                  }
                />
              </div>
            </div>

            {/* Stock Range */}
            <div>
              <Label className="text-sm font-medium">Stock Range</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.stockRange.min}
                  onChange={(e) =>
                    updateFilters({
                      stockRange: { ...filters.stockRange, min: Number(e.target.value) },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.stockRange.max}
                  onChange={(e) =>
                    updateFilters({
                      stockRange: { ...filters.stockRange, max: Number(e.target.value) },
                    })
                  }
                />
              </div>
            </div>

            {/* Margin Range */}
            <div>
              <Label className="text-sm font-medium">Margin Range (%)</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.marginRange.min}
                  onChange={(e) =>
                    updateFilters({
                      marginRange: { ...filters.marginRange, min: Number(e.target.value) },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.marginRange.max}
                  onChange={(e) =>
                    updateFilters({
                      marginRange: { ...filters.marginRange, max: Number(e.target.value) },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.categories.length > 0 || filters.suppliers.length > 0) && (
            <div>
              <Label className="text-sm font-medium">Active Filters</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.categories.map((categoryId) => {
                  const category = categories.find((c) => c.id === categoryId)
                  return (
                    <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                      {category?.name}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeCategory(categoryId)} />
                    </Badge>
                  )
                })}
                {filters.suppliers.map((supplierId) => {
                  const supplier = suppliers.find((s) => s.id === supplierId)
                  return (
                    <Badge key={supplierId} variant="outline" className="flex items-center gap-1">
                      {supplier?.name}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeSupplier(supplierId)} />
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
