import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { title, description, skills, hoursAvailable, location, availability } = await request.json()

    // Validate input
    if (!title || !description || !skills || !hoursAvailable || !location || !availability) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Create service donation
    const serviceDonation = {
      id: Math.random().toString(36).substr(2, 9),
      donorId: user.id,
      title,
      description,
      skills: Array.isArray(skills) ? skills : [skills],
      hoursAvailable: Number(hoursAvailable),
      location,
      availability,
      status: "available",
      createdAt: new Date().toISOString(),
    }

    // In production, save to database

    return NextResponse.json({
      success: true,
      serviceDonation,
      message: "Service offering created successfully",
    })
  } catch (error) {
    console.error("Service creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return mock service donations - in production, fetch from database
    const mockServiceDonations = [
      {
        id: "service-1",
        donorId: "donor-1",
        title: "Nutrition Education Workshops",
        description: "Offering free nutrition education workshops for communities.",
        skills: ["Nutrition Education", "Community Health", "Workshop Facilitation"],
        hoursAvailable: 20,
        location: "Nairobi and surrounding areas",
        availability: "Weekends and evenings",
        status: "available",
        createdAt: "2024-01-20T00:00:00Z",
      },
    ]

    return NextResponse.json({
      serviceDonations: mockServiceDonations,
      count: mockServiceDonations.length,
    })
  } catch (error) {
    console.error("Get service donations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
