"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search, Plus, Edit, Trash2, ShieldCheck, ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/types"
import { useRouter } from "next/navigation"

interface ProductsTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onAdd: () => void
  loading?: boolean
}

export function ProductsTable({ products, onEdit, onDelete, onAdd, loading = false }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  ) as Product[]

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity <= 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (product.stock_quantity <= product.min_stock_level) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-64 h-10 bg-muted animate-pulse rounded"></div>
          <div className="w-32 h-10 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="border rounded-lg">
          <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Purchase Price</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  {searchTerm
                    ? "No products found matching your search."
                    : "No products found. Add your first product to get started."}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product)
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>{product.category?.name || "—"}</TableCell>
                    <TableCell>{product.supplier?.name || "—"}</TableCell>
                    <TableCell>${(product.purchase_price || 0).toFixed(2)}</TableCell>
                    <TableCell>${(product.selling_price || 0).toFixed(2)}</TableCell>
                    <TableCell className="text-green-600 font-medium">
                      ${product.total_profit?.toFixed(2) ?? ((product.selling_price || 0) - (product.purchase_price || 0)).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{product.stock_quantity} units</div>
                        <div className="text-muted-foreground">Min: {product.min_stock_level}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/orders/new?productId=${product.id}`)}>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Create Order
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/warranties/register?productId=${product.id}`)}>
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Register Warranty
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(product)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {filteredProducts.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      )}
    </div>
  )
}
