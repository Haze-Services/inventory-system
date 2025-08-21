"use client"

import { useState, useEffect } from "react"
import { SuppliersTable } from "@/components/suppliers-table"
import { SupplierForm } from "@/components/supplier-form"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import type { Supplier } from "@/lib/types"
import { supplierApi } from "@/lib/mock-data"

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = async () => {
    try {
      setLoading(true)
      const data = await supplierApi.getAll()
      setSuppliers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load suppliers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingSupplier(null)
    setShowForm(true)
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setShowForm(true)
  }

  const handleDelete = (supplier: Supplier) => {
    setDeletingSupplier(supplier)
  }

  const confirmDelete = async () => {
    if (!deletingSupplier) return

    try {
      await supplierApi.delete(deletingSupplier.id)
      setSuppliers((prev) => prev.filter((s) => s.id !== deletingSupplier.id))
      toast({
        title: "Success",
        description: "Supplier deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete supplier",
        variant: "destructive",
      })
    } finally {
      setDeletingSupplier(null)
    }
  }

  const handleFormSubmit = async (supplierData: Omit<Supplier, "id" | "createdAt" | "updatedAt">) => {
    try {
      setFormLoading(true)
      if (editingSupplier) {
        const updated = await supplierApi.update(editingSupplier.id, supplierData)
        if (updated) {
          setSuppliers((prev) => prev.map((s) => (s.id === editingSupplier.id ? updated : s)))
          toast({
            title: "Success",
            description: "Supplier updated successfully",
          })
        }
      } else {
        const created = await supplierApi.create(supplierData)
        setSuppliers((prev) => [...prev, created])
        toast({
          title: "Success",
          description: "Supplier created successfully",
        })
      }
      setShowForm(false)
      setEditingSupplier(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save supplier",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingSupplier(null)
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container mx-auto py-6 px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Supplier Management</h1>
            <p className="text-muted-foreground">Manage your suppliers and their contact information</p>
          </div>

          <SuppliersTable
            suppliers={suppliers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            loading={loading}
          />

          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
                <DialogDescription>
                  {editingSupplier
                    ? "Update supplier information and contact details"
                    : "Enter supplier details and contact information"}
                </DialogDescription>
              </DialogHeader>
              <SupplierForm
                supplier={editingSupplier || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                loading={formLoading}
              />
            </DialogContent>
          </Dialog>

          <AlertDialog open={!!deletingSupplier} onOpenChange={() => setDeletingSupplier(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{deletingSupplier?.name}"? This action cannot be undone and may
                  affect associated products.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
