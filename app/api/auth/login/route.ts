import { type NextRequest, NextResponse } from "next/server"
import { createToken, setAuthCookie, type User } from "@/lib/auth"

// Mock user database - in production, use a real database
const mockUsers: Record<string, User & { password: string }> = {
  "donor@example.com": {
    id: "1",
    email: "donor@example.com",
    firstName: "John",
    lastName: "Donor",
    phone: "+1234567890",
    role: "donor",
    verified: true,
    createdAt: "2024-01-01T00:00:00Z",
    password: "password123", // In production, this would be hashed
  },
  "ngo@example.com": {
    id: "2",
    email: "ngo@example.com",
    firstName: "Jane",
    lastName: "NGO",
    phone: "+1234567891",
    role: "ngo",
    verified: true,
    createdAt: "2024-01-01T00:00:00Z",
    password: "password123",
  },
  "admin@example.com": {
    id: "3",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    phone: "+1234567892",
    role: "admin",
    verified: true,
    createdAt: "2024-01-01T00:00:00Z",
    password: "admin123",
  },
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json({ error: "Email, password, and role are required" }, { status: 400 })
    }

    // Find user
    const user = mockUsers[email.toLowerCase()]
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check password (in production, use bcrypt)
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check role matches
    if (user.role !== role) {
      return NextResponse.json({ error: "Invalid role for this account" }, { status: 401 })
    }

    // Create token
    const token = await createToken(user)

    // Set cookie
    await setAuthCookie(token)

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
