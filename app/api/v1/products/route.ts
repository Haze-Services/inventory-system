import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const categoryId = searchParams.get("categoryId")
    const sortBy = searchParams.get("sortBy") || "name"
    const order = searchParams.get("order") || "asc"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    let query = supabase
      .from('products')
      .select('*, categories(*)', { count: 'exact' })

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data: products, error, count } = await query
      .order(sortBy, { ascending: order === 'asc' })
      .range((page - 1) * limit, page * limit - 1)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: products,
      total: count,
      page,
      limit,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    console.log("Creating product with data:", productData)

    // Validate required fields
    if (!productData.name?.trim()) {
      return NextResponse.json({
        success: false,
        error: "Name is required"
      }, { status: 400 })
    }

    if (!productData.category_id) {
      return NextResponse.json({
        success: false,
        error: "Category is required"
      }, { status: 400 })
    }

    // Remove any computed or read-only fields
    delete productData.id
    delete productData.created_at
    delete productData.updated_at
    delete productData.total_profit
    delete productData.category
    delete productData.supplier

    // Insert the new product
    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product created successfully"
    })

  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to create product"
    }, { status: 500 })
  }
}
