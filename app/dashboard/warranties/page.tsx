'use client'

import { useState, useEffect } from 'react'
import { WarrantiesTable } from '@/components/warranties-table'
import { WarrantyForm, WarrantyFormData } from '@/components/warranty-form'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ProtectedRoute } from '@/components/protected-route'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from '@/hooks/use-toast'
import type { Warranty } from '@/lib/types'
import { apiClient } from '@/lib/api-client'

export default function WarrantiesPage() {
  const [warranties, setWarranties] = useState<Warranty[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingWarranty, setEditingWarranty] = useState<Warranty | null>(null)
  const [deletingWarranty, setDeletingWarranty] = useState<Warranty | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    loadWarranties()
  }, [])

  const loadWarranties = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getWarranties()
      if (response.success && response.data) {
        setWarranties(response.data)
      } else {
        throw new Error(response.error || 'Failed to load warranties')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load warranties',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingWarranty(null)
    setShowForm(true)
  }

  const handleEdit = (warranty: Warranty) => {
    setEditingWarranty(warranty)
    setShowForm(true)
  }

  const handleDelete = (warranty: Warranty) => {
    setDeletingWarranty(warranty)
  }

  const confirmDelete = async () => {
    if (!deletingWarranty) return

    try {
      const response = await apiClient.deleteWarranty(deletingWarranty.id)
      if (response.success) {
        setWarranties((prev) => prev.filter((w) => w.id !== deletingWarranty.id))
        toast({
          title: 'Success',
          description: 'Warranty deleted successfully',
        })
      } else {
        throw new Error(response.error || 'Failed to delete warranty')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete warranty',
        variant: 'destructive',
      })
    } finally {
      setDeletingWarranty(null)
    }
  }

  const handleFormSubmit = async (warrantyData: WarrantyFormData) => {
    try {
      setFormLoading(true)
      // Extract payment data if present, as createWarranty/updateWarranty API doesn't expect it
      const { payment_amount, payment_method, transaction_id, ...restWarrantyData } = warrantyData;

      if (editingWarranty) {
        const response = await apiClient.updateWarranty(editingWarranty.id, restWarrantyData)
        if (response.success && response.data) {
          await loadWarranties()
          toast({
            title: 'Success',
            description: 'Warranty updated successfully',
          })
        } else {
          throw new Error(response.error || 'Failed to update warranty')
        }
      } else {
        const response = await apiClient.createWarranty(restWarrantyData)
        if (response.success && response.data) {
          await loadWarranties()
          toast({
            title: 'Success',
            description: 'Warranty created successfully',
          })
        } else {
          throw new Error(response.error || 'Failed to create warranty')
        }
      }
      setShowForm(false)
      setEditingWarranty(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save warranty',
        variant: 'destructive',
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingWarranty(null)
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className='container mx-auto py-6 px-4'>
          <div className='mb-6'>
            <h1 className='text-3xl font-bold'>Warranty Management</h1>
            <p className='text-muted-foreground'>Manage customer warranties</p>
          </div>

          <WarrantiesTable
            warranties={warranties}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            loading={loading}
          />

          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent className='max-w-2xl'>
              <DialogHeader>
                <DialogTitle>{editingWarranty ? 'Edit Warranty' : 'Add New Warranty'}</DialogTitle>
                <DialogDescription>
                  {editingWarranty ? 'Update warranty information' : 'Enter warranty details'}
                </DialogDescription>
              </DialogHeader>
              <WarrantyForm
                warranty={editingWarranty || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                loading={formLoading}
                showPaymentFields={false} // Explicitly set to false for this page
              />
            </DialogContent>
          </Dialog>

          <AlertDialog open={!!deletingWarranty} onOpenChange={() => setDeletingWarranty(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Warranty</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this warranty? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
