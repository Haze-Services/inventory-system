'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { Product, WarrantyPayment } from '@/lib/types'
import { apiClient } from '@/lib/api-client'

export interface WarrantyPaymentFormData {
  amount: number;
  product_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  purchase_date: string;
  warranty_period_months: string;
  payment_method: string;
  transaction_id?: string;
}

interface WarrantyPaymentFormProps {
  onSubmit: (data: WarrantyPaymentFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  product_id: string | null
}

const validatePayment = (data: WarrantyPaymentFormData) => {
  const errors: string[] = []

  if (!data.amount || data.amount <= 0) {
    errors.push('Amount must be a positive number')
  }
  if (!data.payment_method) {
    errors.push('Payment method is required')
  }

  return errors
}

export function WarrantyPaymentForm({ product_id, onSubmit, onCancel, loading = false }: WarrantyPaymentFormProps) {
  const [formData, setFormData] = useState<WarrantyPaymentFormData>({
    amount: 0,
    payment_method: '',
    transaction_id: '',
    product_id: product_id || '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    purchase_date: '',
    warranty_period_months: '',
  })

  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productResponse = await apiClient.getProducts({ limit: 1000 }) // Fetch all products
        if (productResponse.success) {
          setProducts(productResponse.data as Product[])
        } else {
          throw new Error(productResponse.error || 'Failed to load products')
        }
      } catch (err) {
        console.error('Error loading products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load form data')
      }
    }

    loadProducts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validationErrors = validatePayment(formData)
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '))
      return
    }

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save payment')
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Register Warranty Payment</CardTitle>
        <CardDescription>Enter payment details for the warranty.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='product'>Product *</Label>
              <Select
                value={formData.product_id}
                onValueChange={(value) => handleInputChange('product_id', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a product' />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='customer_name'>Customer Name *</Label>
                <Input
                  id='customer_name'
                  value={formData.customer_name}
                  onChange={(e) => handleInputChange('customer_name', e.target.value)}
                  placeholder='Enter customer name'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='customer_email'>Customer Email</Label>
                <Input
                  id='customer_email'
                  type='email'
                  value={formData.customer_email}
                  onChange={(e) => handleInputChange('customer_email', e.target.value)}
                  placeholder='Enter customer email'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='customer_phone'>Customer Phone</Label>
                <Input
                  id='customer_phone'
                  value={formData.customer_phone}
                  onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                  placeholder='Enter customer phone'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='purchase_date'>Purchase Date *</Label>
                <Input
                  id='purchase_date'
                  type='date'
                  value={formData.purchase_date}
                  onChange={(e) => handleInputChange('purchase_date', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.valueAsNumber)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method *</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => handleInputChange('payment_method', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transaction_id">Transaction ID</Label>
              <Input
                id="transaction_id"
                value={formData.transaction_id}
                onChange={(e) => handleInputChange('transaction_id', e.target.value)}
                placeholder="Enter transaction ID"
              />
            </div>
          </div>

          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className='flex gap-4 pt-4'>
            <Button type='submit' disabled={loading}>
              {loading ? 'Saving...' : 'Submit Payment'}
            </Button>
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
