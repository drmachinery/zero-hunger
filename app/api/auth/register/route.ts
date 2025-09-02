import { type NextRequest, NextResponse } from "next/server"
import { createToken, setAuthCookie, type User } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, password, role } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !phone || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate role
    const validRoles = ["donor", "ngo", "food-provider"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Check if user already exists (mock check)
    // In production, check your database
    if (email === "existing@example.com") {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Create new user (mock creation)
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      firstName,
      lastName,
      phone,
      role: role as any,
      verified: false, // Would require email verification in production
      createdAt: new Date().toISOString(),
    }

    // Create token
    const token = await createToken(newUser)

    // Set cookie
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      user: newUser,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
