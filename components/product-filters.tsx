"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X, Package, DollarSign, AlertTriangle } from "lucide-react"

interface ProductFiltersProps {
  onFiltersChange: (filters: any) => void
  categories: string[]
  suppliers: string[]
}

export function ProductFilters({ onFiltersChange, categories, suppliers }: ProductFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    supplier: "",
    stockStatus: "",
    priceRange: "",
    sortBy: "name",
    sortOrder: "asc" as "asc" | "desc",
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const updateFilters = (newFilters: any) => {
    setFilters(newFilters)

    // Convert UI filters to API filters
    const apiFilters: any = {
      search: newFilters.search || undefined,
      category: newFilters.category || undefined,
      supplier: newFilters.supplier || undefined,
      sortBy: newFilters.sortBy,
      sortOrder: newFilters.sortOrder,
    }

    // Handle stock status filters
    if (newFilters.stockStatus === "lowStock") apiFilters.lowStock = true
    if (newFilters.stockStatus === "outOfStock") apiFilters.outOfStock = true
    if (newFilters.stockStatus === "inStock") apiFilters.inStock = true

    // Handle price range
    if (newFilters.priceRange) apiFilters.priceRange = newFilters.priceRange

    onFiltersChange(apiFilters)
  }

  const handleQuickFilter = (type: string, value: string) => {
    const newFilters = { ...filters }
    const filterKey = type === "stock" ? "stockStatus" : type

    if (newFilters[filterKey as keyof typeof newFilters] === value) {
      // Remove filter if already active
      newFilters[filterKey as keyof typeof newFilters] = ""
      setActiveFilters((prev) => prev.filter((f) => f !== `${type}:${value}`))
    } else {
      // Add/update filter
      newFilters[filterKey as keyof typeof newFilters] = value
      setActiveFilters((prev) => {
        const filtered = prev.filter((f) => !f.startsWith(`${type}:`))
        return [...filtered, `${type}:${value}`]
      })
    }

    updateFilters(newFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      category: "",
      supplier: "",
      stockStatus: "",
      priceRange: "",
      sortBy: "name",
      sortOrder: "asc" as "asc" | "desc",
    }
    setActiveFilters([])
    updateFilters(clearedFilters)
  }

  const removeFilter = (filterToRemove: string) => {
    const [type, value] = filterToRemove.split(":")
    handleQuickFilter(type, value)
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      {/* Search and Sort */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>

        <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ ...filters, sortBy: value })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="stock">Stock</SelectItem>
            <SelectItem value="profit">Profit</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => updateFilters({ ...filters, sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" })}
        >
          {filters.sortOrder === "asc" ? "↑" : "↓"}
        </Button>
      </div>

      {/* Quick Filter Buttons */}
      <div className="space-y-3">
        {/* Stock Status Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <Package className="h-4 w-4" />
            Stock Status:
          </span>
          <Button
            variant={filters.stockStatus === "lowStock" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("stock", "lowStock")}
            className="flex items-center gap-1"
          >
            <AlertTriangle className="h-3 w-3" />
            Low Stock
          </Button>
          <Button
            variant={filters.stockStatus === "outOfStock" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("stock", "outOfStock")}
            className="flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Out of Stock
          </Button>
          <Button
            variant={filters.stockStatus === "inStock" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("stock", "inStock")}
            className="flex items-center gap-1"
          >
            <Package className="h-3 w-3" />
            In Stock
          </Button>
        </div>

        {/* Price Range Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            Price Range:
          </span>
          <Button
            variant={filters.priceRange === "under50" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("priceRange", "under50")}
          >
            Under $50
          </Button>
          <Button
            variant={filters.priceRange === "50to100" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("priceRange", "50to100")}
          >
            $50 - $100
          </Button>
          <Button
            variant={filters.priceRange === "over100" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("priceRange", "over100")}
          >
            Over $100
          </Button>
        </div>

        {/* Category and Supplier Dropdowns */}
        <div className="flex gap-4">
          <Select value={filters.category} onValueChange={(value) => updateFilters({ ...filters, category: value })}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allCategories">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.supplier} onValueChange={(value) => updateFilters({ ...filters, supplier: value })}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allSuppliers">All Suppliers</SelectItem>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier} value={supplier}>
                  {supplier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          {activeFilters.map((filter) => {
            const [type, value] = filter.split(":")
            return (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                {value.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeFilter(filter)} />
              </Badge>
            )
          })}
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-red-600 hover:text-red-700">
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
