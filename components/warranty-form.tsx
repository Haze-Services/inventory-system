'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { Warranty, Product } from '@/lib/types'
import { apiClient } from '@/lib/api-client'

interface WarrantyFormProps {
  warranty?: Partial<Warranty>
  onSubmit: (warranty: Omit<Warranty, 'id' | 'created_at' | 'updated_at' | 'expiry_date' | 'product'>) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

const validateWarranty = (data: any) => {
  const errors: string[] = []

  if (!data.product_id) {
    errors.push('Product is required')
  }
  if (!data.customer_name?.trim()) {
    errors.push('Customer name is required')
  }
  if (!data.purchase_date) {
    errors.push('Purchase date is required')
  }
  if (!data.warranty_period_months || isNaN(Number(data.warranty_period_months))) {
    errors.push('Warranty period is required and must be a number')
  }

  return errors
}

export function WarrantyForm({ warranty, onSubmit, onCancel, loading = false }: WarrantyFormProps) {
  const [formData, setFormData] = useState({
    product_id: warranty?.product_id || '',
    customer_name: warranty?.customer_name || '',
    customer_email: warranty?.customer_email || '',
    customer_phone: warranty?.customer_phone || '',
    purchase_date: warranty?.purchase_date ? new Date(warranty.purchase_date).toISOString().split('T')[0] : '',
    warranty_period_months: warranty?.warranty_period_months?.toString() || '',
    status: warranty?.status || 'active',
    notes: warranty?.notes || '',
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

    try {
      const warrantyData = {
        ...formData,
        warranty_period_months: Number.parseInt(formData.warranty_period_months),
      }

      const validationErrors = validateWarranty(warrantyData)
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '))
        return
      }

      await onSubmit(warrantyData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save warranty')
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle>{warranty ? 'Edit Warranty' : 'Add New Warranty'}</CardTitle>
        <CardDescription>
          {warranty ? 'Update warranty information' : 'Enter warranty details'}
        </CardDescription>
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

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='warranty_period_months'>Warranty Period (Months) *</Label>
                <Input
                  id='warranty_period_months'
                  type='number'
                  value={formData.warranty_period_months}
                  onChange={(e) => handleInputChange('warranty_period_months', e.target.value)}
                  placeholder='e.g., 12'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='status'>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='expired'>Expired</SelectItem>
                    <SelectItem value='claimed'>Claimed</SelectItem>
                    <SelectItem value='void'>Void</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='notes'>Notes</Label>
              <Textarea
                id='notes'
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder='Enter any notes about the warranty'
                rows={3}
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
              {loading ? 'Saving...' : warranty ? 'Update Warranty' : 'Create Warranty'}
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
