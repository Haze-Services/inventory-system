import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "product_id"
    const order = searchParams.get("order") || "asc"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    let query = supabase
      .from('warranties')
      .select('*, products(name, sku)', { count: 'exact' })

    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,notes.ilike.%${search}%`)
    }

    const { data: warranties, error, count } = await query
      .order(sortBy, { ascending: order === 'asc' })
      .range((page - 1) * limit, page * limit - 1)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: warranties,
      total: count,
      page,
      limit,
    })
  } catch (error) {
    console.error("Error fetching warranties:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch warranties" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const warrantyData = await request.json()

    console.log("Creating warranty with data:", warrantyData)

    if (!warrantyData.product_id) {
      return NextResponse.json({
        success: false,
        error: "Product is required"
      }, { status: 400 })
    }

    delete warrantyData.id
    delete warrantyData.created_at
    delete warrantyData.updated_at
    delete warrantyData.product

    const { data: warranty, error } = await supabase
      .from('warranties')
      .insert([{
        ...warrantyData,
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
      data: warranty,
      message: "Warranty created successfully"
    })

  } catch (error) {
    console.error("Error creating warranty:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to create warranty"
    }, { status: 500 })
  }
}
