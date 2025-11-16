import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        supplier:suppliers(*),
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) throw error

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderData = await request.json()

    // Remove computed fields
    delete orderData.id
    delete orderData.created_at
    delete orderData.order_number
    delete orderData.supplier
    delete orderData.items

    // Update order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update({
        ...orderData,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (orderError) throw orderError

    // If items are provided, update them
    if (orderData.newItems) {
      // Delete existing items
      await supabase
        .from('order_items')
        .delete()
        .eq('order_id', params.id)

      // Insert new items
      const orderItems = orderData.newItems.map((item: any) => ({
        order_id: params.id,
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

      // Update total amount
      const totalAmount = orderItems.reduce((sum, item) => sum + item.total_price, 0)
      
      await supabase
        .from('orders')
        .update({ total_amount: totalAmount })
        .eq('id', params.id)
    }

    // Fetch updated order with relations
    const { data: updatedOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        supplier:suppliers(*),
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', params.id)
      .single()

    if (fetchError) throw fetchError

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "Order updated successfully"
    })

  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to update order"
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete order items first (cascade)
    await supabase
      .from('order_items')
      .delete()
      .eq('order_id', params.id)

    // Delete the order
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete order"
    }, { status: 500 })
  }
}