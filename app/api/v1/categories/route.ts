import { type NextRequest, NextResponse } from "next/server"
import { mockCategories } from "@/lib/mock-data"
import type { Category } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    let categories = [...mockCategories]

    // Apply search filter
    if (search) {
      categories = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(search.toLowerCase()) ||
          category.description?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return NextResponse.json({
      success: true,
      data: categories,
      total: categories.length,
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 })
    }

    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name,
      description: description || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockCategories.push(newCategory)

    return NextResponse.json(
      {
        success: true,
        data: newCategory,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 })
  }
}
