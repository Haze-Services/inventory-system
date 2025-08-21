"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CategoriesTable } from "@/components/categories-table"
import { CategoryForm } from "@/components/category-form"
import type { Category } from "@/lib/types"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchCategories = async (search?: string) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (search) params.append("search", search)

      const response = await fetch(`/api/v1/categories?${params}`)
      const result = await response.json()

      if (result.success) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAdd = () => {
    setEditingCategory(null)
    setShowForm(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const response = await fetch(`/api/v1/categories/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchCategories(searchQuery)
      }
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  const handleSubmit = async (data: { name: string; description: string }) => {
    try {
      const url = editingCategory ? `/api/v1/categories/${editingCategory.id}` : "/api/v1/categories"

      const method = editingCategory ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingCategory(null)
        fetchCategories(searchQuery)
      }
    } catch (error) {
      console.error("Error saving category:", error)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    fetchCategories(query)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCategory(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-600">Manage your product categories</p>
        </div>

        {showForm ? (
          <CategoryForm
            category={editingCategory || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        ) : (
          <CategoriesTable
            categories={categories}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
