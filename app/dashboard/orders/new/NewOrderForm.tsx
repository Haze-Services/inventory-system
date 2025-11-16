"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Product, Supplier } from "@/lib/types"

interface OrderItem {
  product_id: string
  product?: Product
  quantity: number
  unit_price: number
  total_price: number
}

export default function NewOrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')

  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    supplier_id: "",
    expected_delivery_date: "",
    notes: "",
    status: "pending"
  })

  const [orderItems, setOrderItems] = useState<OrderItem[]>([{
    product_id: "",
    quantity: 1,
    unit_price: 0,
    total_price: 0
  }])

  useEffect(() => {
    fetchSuppliers()
    fetchProducts()
  }, [])

  useEffect(() => {
    if (productId && products.length > 0) {
      const selectedProduct = products.find(p => p.id === productId)
      if (selectedProduct) {
        // Pre-fill the form with the selected product
        setOrderItems([{
          product_id: selectedProduct.id,
          product: selectedProduct,
          quantity: 1,
          unit_price: selectedProduct.purchase_price,
          total_price: selectedProduct.purchase_price
        }])

        // Auto-select the supplier if the product has one
        if (selectedProduct.supplier_id) {
          setFormData(prev => ({
            ...prev,
            supplier_id: selectedProduct.supplier_id
          }))
        }
      }
    }
  }, [productId, products])

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/v1/suppliers')
      const result = await response.json()
      if (result.success) {
        setSuppliers(result.data)
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/v1/products?limit=1000')
      const result = await response.json()
      if (result.success) {
        setProducts(result.data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setOrderItems(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }

      if (field === 'product_id') {
        const product = products.find(p => p.id === value)
        if (product) {
          updated[index].unit_price = product.purchase_price
          updated[index].product = product
        }
      }

      if (field === 'quantity' || field === 'unit_price') {
        updated[index].total_price = updated[index].quantity * updated[index].unit_price
      }

      return updated
    })
  }

  const addItem = () => {
    setOrderItems(prev => [...prev, {
      product_id: "",
      quantity: 1,
      unit_price: 0,
      total_price: 0
    }])
  }

  const removeItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(prev => prev.filter((_, i) => i !== index))
    }
  }

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total_price, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const orderData = {
        ...formData,
        items: orderItems.filter(item => item.product_id && item.quantity > 0)
      }

      if (!orderData.supplier_id) {
        alert("Please select a supplier")
        return
      }

      if (orderData.items.length === 0) {
        alert("Please add at least one item")
        return
      }

      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/dashboard/orders/${result.data.id}`)
      } else {
        alert(result.error || "Failed to create order")
      }
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Failed to create order")
    } finally {
      setSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Order</h1>
          <p className="text-muted-foreground">
            {productId ? 'Order pre-filled with selected product' : 'Order products from suppliers'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supplier">Supplier *</Label>
                <Select value={formData.supplier_id} onValueChange={(value) => handleInputChange('supplier_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expected_delivery_date">Expected Delivery Date</Label>
                <Input
                  type="date"
                  value={formData.expected_delivery_date}
                  onChange={(e) => handleInputChange('expected_delivery_date', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                placeholder="Order notes..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Order Items</CardTitle>
            <Button type="button" onClick={addItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                      <Label htmlFor={`product-${index}`}>Product</Label>
                      <Select
                        value={item.product_id}
                        onValueChange={(value) => handleItemChange(index, 'product_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - {formatCurrency(product.purchase_price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`unit_price-${index}`}>Unit Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div>
                        <Label>Total</Label>
                        <div className="font-medium">{formatCurrency(item.total_price)}</div>
                      </div>
                      {orderItems.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Order Amount:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard/orders">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              "Creating..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Order
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}