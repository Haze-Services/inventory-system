import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import type { Supplier } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    let query = supabase.from('suppliers').select('*')

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,address.ilike.%${search}%`)
    }

    const { data: suppliers, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: suppliers,
      total: count,
    })
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch suppliers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, address } = body

    if (!name) {
      return NextResponse.json({ success: false, error: "Supplier name is required" }, { status: 400 })
    }

    const newSupplier: Partial<Supplier> = {
      name,
      email: email || "",
      phone: phone || "",
      address: address || "",
    }

    const { data, error } = await supabase
      .from('suppliers')
      .insert([newSupplier])
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
    console.error("Error creating supplier:", error)
    return NextResponse.json({ success: false, error: "Failed to create supplier" }, { status: 500 })
  }
}