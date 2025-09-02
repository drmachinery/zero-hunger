import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user || user.role !== "food-provider") {
      return NextResponse.json({ error: "Food provider authentication required" }, { status: 401 })
    }

    const { title, description, category, quantity, unit, expiryDate, pickupLocation, pickupTimeStart, pickupTimeEnd } =
      await request.json()

    // Validate input
    if (
      !title ||
      !description ||
      !category ||
      !quantity ||
      !unit ||
      !expiryDate ||
      !pickupLocation ||
      !pickupTimeStart ||
      !pickupTimeEnd
    ) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Create food donation
    const foodDonation = {
      id: Math.random().toString(36).substr(2, 9),
      providerId: user.id,
      title,
      description,
      category,
      quantity: Number(quantity),
      unit,
      expiryDate,
      pickupLocation,
      pickupTimeStart,
      pickupTimeEnd,
      status: "available",
      createdAt: new Date().toISOString(),
    }

    // In production, save to database

    return NextResponse.json({
      success: true,
      foodDonation,
      message: "Food donation listed successfully",
    })
  } catch (error) {
    console.error("Food donation creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return mock food donations - in production, fetch from database
    const mockFoodDonations = [
      {
        id: "food-1",
        providerId: "provider-1",
        title: "Fresh Vegetables - Daily Surplus",
        description: "Daily surplus of fresh vegetables including tomatoes, onions, carrots, and leafy greens.",
        category: "fresh-produce",
        quantity: 50,
        unit: "kg",
        expiryDate: "2024-01-25T00:00:00Z",
        pickupLocation: "Green Valley Market, Westlands, Nairobi",
        pickupTimeStart: "18:00",
        pickupTimeEnd: "20:00",
        status: "available",
        createdAt: "2024-01-24T10:00:00Z",
      },
    ]

    return NextResponse.json({
      foodDonations: mockFoodDonations,
      count: mockFoodDonations.length,
    })
  } catch (error) {
    console.error("Get food donations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
