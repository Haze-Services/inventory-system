import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const { data: warranty, error } = await supabase
      .from('warranties')
      .select(`
        *,
        product:products(name, sku)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    if (!warranty) {
      return NextResponse.json({ success: false, error: "Warranty not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: warranty,
    })
  } catch (error) {
    console.error("Error fetching warranty:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch warranty" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const updates = await request.json()

    delete updates.id
    delete updates.created_at
    delete updates.updated_at
    delete updates.product

    const { data: warranty, error } = await supabase
      .from('warranties')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        product:products(name, sku)
      `)
      .single()

    if (error) throw error

    if (!warranty) {
      return NextResponse.json({ success: false, error: "Warranty not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: warranty,
      message: "Warranty updated successfully",
    })
  } catch (error) {
    console.error("Error updating warranty:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to update warranty"
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const { data: warranty, error } = await supabase
      .from('warranties')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    if (!warranty) {
      return NextResponse.json({ success: false, error: "Warranty not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: warranty,
      message: "Warranty deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting warranty:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete warranty"
    }, { status: 500 })
  }
}
