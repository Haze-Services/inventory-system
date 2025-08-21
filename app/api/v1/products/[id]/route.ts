import { type NextRequest, NextResponse } from "next/server"
import type { Product } from "@/lib/types"

// Mock data - same as in products/route.ts (in real app, this would come from database)
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    sku: "WH-001",
    description: "High-quality wireless headphones with noise cancellation",
    category: "Electronics",
    supplier: "TechCorp",
    realPrice: 150.0,
    purchasePrice: 80.0,
    sellingPrice: 120.0,
    priceCorrection: 0,
    stock: 25,
    minStock: 5,
    maxStock: 100,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Gaming Mouse",
    sku: "GM-002",
    description: "Ergonomic gaming mouse with RGB lighting",
    category: "Electronics",
    supplier: "GameGear",
    realPrice: 80.0,
    purchasePrice: 45.0,
    sellingPrice: 65.0,
    priceCorrection: 5.0,
    stock: 15,
    minStock: 3,
    maxStock: 50,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    name: "Office Chair",
    sku: "OC-003",
    description: "Comfortable ergonomic office chair",
    category: "Furniture",
    supplier: "OfficeMax",
    realPrice: 300.0,
    purchasePrice: 180.0,
    sellingPrice: 250.0,
    priceCorrection: -10.0,
    stock: 8,
    minStock: 2,
    maxStock: 20,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-22"),
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const product = mockProducts.find((p) => p.id === id)

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Add calculated fields
    const productWithCalculations = {
      ...product,
      totalProfit: product.sellingPrice + product.priceCorrection - product.purchasePrice,
      profitMargin:
        ((product.sellingPrice + product.priceCorrection - product.purchasePrice) / product.purchasePrice) * 100,
      finalPrice: product.sellingPrice + product.priceCorrection,
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const productIndex = mockProducts.findIndex((p) => p.id === id)

    if (productIndex === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Update product
    const updatedProduct = {
      ...mockProducts[productIndex],
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    }

    mockProducts[productIndex] = updatedProduct

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const productIndex = mockProducts.findIndex((p) => p.id === id)

    if (productIndex === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Remove product
    const deletedProduct = mockProducts.splice(productIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedProduct,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 })
  }
}
