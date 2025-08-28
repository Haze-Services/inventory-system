import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: warranty_id } = params
    const paymentData = await request.json()

    if (!warranty_id) {
        return NextResponse.json({ success: false, error: "Warranty ID is required" }, { status: 400 })
    }

    const { data: payment, error } = await supabase
      .from('warranty_payments')
      .insert([{
        ...paymentData,
        warranty_id,
        payment_date: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json({
      success: true,
      data: payment,
      message: "Payment created successfully"
    })

  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to create payment"
    }, { status: 500 })
  }
}
