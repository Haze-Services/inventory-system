import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Product } from "@/lib/types"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name),
        supplier:suppliers(name)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Add calculated fields
    const productWithCalculations = {
      ...product,
      total_profit: product.selling_price + product.price_correction - product.purchase_price,
      profit_margin:
        ((product.selling_price + product.price_correction - product.purchase_price) / product.purchase_price) * 100,
      final_price: product.selling_price + product.price_correction,
    }

    return NextResponse.json({
      success: true,
      data: productWithCalculations,
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    // Remove any computed or read-only fields
    delete productData.id
    delete productData.created_at
    delete productData.updated_at
    delete productData.total_profit
    delete productData.category
    delete productData.supplier

    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product created successfully"
    })

  } catch (error) {
    console.error("Error creating product:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create product"
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const updates = await request.json()

    console.log(updates)

    // Remove read-only fields
    delete updates.id
    delete updates.created_at
    delete updates.updated_at
    delete updates.total_profit

    const { data: product, error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        category:categories(name),
        supplier:suppliers(name)
      `)
      .single()

    if (error) throw error

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product updated successfully",
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to update product"
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const { data: product, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete product"
    }, { status: 500 })
  }
}
