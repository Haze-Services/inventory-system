import { type NextRequest, NextResponse } from "next/server"
import { mockCategories } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const category = mockCategories.find((c) => c.id === params.id)

    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch category" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, description } = body

    const categoryIndex = mockCategories.findIndex((c) => c.id === params.id)

    if (categoryIndex === -1) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    mockCategories[categoryIndex] = {
      ...mockCategories[categoryIndex],
      name: name || mockCategories[categoryIndex].name,
      description: description !== undefined ? description : mockCategories[categoryIndex].description,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: mockCategories[categoryIndex],
    })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ success: false, error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const categoryIndex = mockCategories.findIndex((c) => c.id === params.id)

    if (categoryIndex === -1) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    mockCategories.splice(categoryIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 })
  }
}
