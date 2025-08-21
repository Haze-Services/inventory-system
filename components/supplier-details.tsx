"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Mail, Phone, MapPin, Package, Edit } from "lucide-react"
import type { Supplier, Product } from "@/lib/types"

interface SupplierDetailsProps {
  supplier: Supplier
  products: Product[]
  onEdit: () => void
}

export function SupplierDetails({ supplier, products, onEdit }: SupplierDetailsProps) {
  const totalProducts = products.length
  const totalStockValue = products.reduce((sum, p) => sum + p.purchasePrice * p.stockQuantity, 0)
  const lowStockProducts = products.filter((p) => p.stockQuantity <= p.minStockLevel).length

  return (
    <div className="space-y-6">
      {/* Supplier Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {supplier.name}
            </CardTitle>
            <CardDescription>Supplier Information</CardDescription>
          </div>
          <Button onClick={onEdit} size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                <p className="text-sm">{supplier.contactPerson || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">
                  {supplier.email ? (
                    <a
                      href={`mailto:${supplier.email}`}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Mail className="h-3 w-3" />
                      {supplier.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-sm">
                  {supplier.phone ? (
                    <a href={`tel:${supplier.phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {supplier.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-sm">
                  {supplier.address ? (
                    <span className="flex items-start gap-1">
                      <MapPin className="h-3 w-3 mt-0.5" />
                      {supplier.address}
                    </span>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Products from this supplier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalStockValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total inventory value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">Products needing restock</p>
          </CardContent>
        </Card>
      </div>

      {/* Products from this Supplier */}
      <Card>
        <CardHeader>
          <CardTitle>Products from {supplier.name}</CardTitle>
          <CardDescription>All products supplied by this vendor</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No products from this supplier yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${product.purchasePrice.toFixed(2)}</div>
                    <Badge variant={product.stockQuantity <= product.minStockLevel ? "secondary" : "default"}>
                      {product.stockQuantity} in stock
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
