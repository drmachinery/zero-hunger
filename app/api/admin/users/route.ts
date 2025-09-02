import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { mockAdminUsers } from "@/lib/admin-data"

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let filteredUsers = [...mockAdminUsers]

    // Filter by role
    if (role && role !== "all") {
      filteredUsers = filteredUsers.filter((u) => u.role === role)
    }

    // Filter by status
    if (status && status !== "all") {
      filteredUsers = filteredUsers.filter((u) => u.status === status)
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (u) =>
          u.firstName.toLowerCase().includes(searchLower) ||
          u.lastName.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower),
      )
    }

    return NextResponse.json({
      users: filteredUsers,
      total: filteredUsers.length,
      summary: {
        total: mockAdminUsers.length,
        active: mockAdminUsers.filter((u) => u.status === "active").length,
        suspended: mockAdminUsers.filter((u) => u.status === "suspended").length,
        pending: mockAdminUsers.filter((u) => u.status === "pending").length,
        byRole: {
          donor: mockAdminUsers.filter((u) => u.role === "donor").length,
          ngo: mockAdminUsers.filter((u) => u.role === "ngo").length,
          "food-provider": mockAdminUsers.filter((u) => u.role === "food-provider").length,
          admin: mockAdminUsers.filter((u) => u.role === "admin").length,
        },
      },
    })
  } catch (error) {
    console.error("Admin users fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { userId, action, reason } = await request.json()

    if (!userId || !action) {
      return NextResponse.json({ error: "User ID and action are required" }, { status: 400 })
    }

    // In production, update the database
    // For now, simulate the action
    const targetUser = mockAdminUsers.find((u) => u.id === userId)
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let newStatus = targetUser.status
    switch (action) {
      case "suspend":
        newStatus = "suspended"
        break
      case "activate":
        newStatus = "active"
        break
      case "verify":
        // Update verification status
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `User ${action}ed successfully`,
      user: { ...targetUser, status: newStatus },
    })
  } catch (error) {
    console.error("Admin user action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
