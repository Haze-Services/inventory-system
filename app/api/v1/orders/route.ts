import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const supplierId = searchParams.get("supplierId")
    const status = searchParams.get("status")
    const sortBy = searchParams.get("sortBy") || "created_at"
    const order = searchParams.get("order") || "desc"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    let query = supabase
      .from('orders')
      .select(`
        *,
        supplier:suppliers(*),
        items:order_items(
          *,
          product:products(*)
        )
      `, { count: 'exact' })

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,notes.ilike.%${search}%`)
    }

    if (supplierId) {
      query = query.eq('supplier_id', supplierId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: orders, error, count } = await query
      .order(sortBy, { ascending: order === 'asc' })
      .range((page - 1) * limit, page * limit - 1)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: orders,
      total: count,
      page,
      limit,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Validate required fields
    if (!orderData.supplier_id) {
      return NextResponse.json({
        success: false,
        error: "Supplier is required"
      }, { status: 400 })
    }

    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json({
        success: false,
        error: "At least one order item is required"
      }, { status: 400 })
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Calculate total amount
    const totalAmount = orderData.items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.unit_price), 0
    )

    // Remove computed fields
    delete orderData.id
    delete orderData.created_at
    delete orderData.updated_at
    delete orderData.supplier

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        ...orderData,
        order_number: orderNumber,
        total_amount: totalAmount,
        status: orderData.status || 'pending',
        order_date: orderData.order_date || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = orderData.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price,
      created_at: new Date().toISOString()
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // Fetch the complete order with relations
    const { data: completeOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        supplier:suppliers(*),
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', order.id)
      .single()

    if (fetchError) throw fetchError

    return NextResponse.json({
      success: true,
      data: completeOrder,
      message: "Order created successfully"
    })

  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order"
    }, { status: 500 })
  }
}