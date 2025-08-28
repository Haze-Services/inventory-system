'use client'

import { Suspense, useState } from 'react'
import { WarrantyForm, WarrantyFormData } from '@/components/warranty-form'
import { WarrantyPaymentForm, WarrantyPaymentFormData } from '@/components/warranty-payment-form'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ProtectedRoute } from '@/components/protected-route'
import { toast } from '@/hooks/use-toast'
import type { Warranty } from '@/lib/types'
import { apiClient } from '@/lib/api-client'
import { useRouter, useSearchParams } from 'next/navigation'

function RegisterWarrantyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')

  const [showWarrantyForm, setShowWarrantyForm] = useState(true)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [currentWarrantyId, setCurrentWarrantyId] = useState<string | null>(null)

  const handleWarrantySubmit = async (warrantyData: WarrantyFormData) => {
    try {
      // Extract payment data if present, as createWarranty API doesn't expect it
      const { payment_amount, payment_method, transaction_id, ...restWarrantyData } = warrantyData;

      const response = await apiClient.createWarranty(restWarrantyData)
      if (response.success && response.data) {
        toast({
          title: 'Success',
          description: 'Warranty created successfully. Now add payment details.',
        })
        setCurrentWarrantyId(response.data.id)
        setShowWarrantyForm(false)
        setShowPaymentForm(true)
      } else {
        throw new Error(response.error || 'Failed to create warranty')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create warranty',
        variant: 'destructive',
      })
    }
  }

  const handlePaymentSubmit = async (paymentData: WarrantyPaymentFormData) => {
    if (!currentWarrantyId) {
      toast({
        title: 'Error',
        description: 'No warranty ID found for payment.',
        variant: 'destructive',
      })
      return
    }

    try {
      const response = await apiClient.createWarrantyPayment(currentWarrantyId, paymentData)
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Warranty payment registered successfully.',
        })
        router.push('/dashboard/warranties')
      } else {
        throw new Error(response.error || 'Failed to register payment')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to register payment',
        variant: 'destructive',
      })
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const initialWarrantyData = productId ? { product_id: productId } as Partial<Warranty> : undefined;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className='container mx-auto py-6 px-4'>
          <WarrantyPaymentForm
            product_id={productId || ''}
            onSubmit={handlePaymentSubmit}
            onCancel={handleCancel}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default function RegisterWarranty() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterWarrantyPage />
    </Suspense>
  )
}
