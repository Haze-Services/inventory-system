import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import type { Category } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    let query = supabase.from('categories').select('*')

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: categories, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: categories,
      total: count,
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

    const newCategory: Partial<Category> = {
      name,
      description: description || "",
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([newCategory])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 })
  }
}
