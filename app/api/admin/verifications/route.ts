import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { mockVerificationRequests } from "@/lib/admin-data"

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "pending"

    const filteredRequests = mockVerificationRequests.filter((req) => (status === "all" ? true : req.status === status))

    return NextResponse.json({
      verifications: filteredRequests,
      total: filteredRequests.length,
      summary: {
        pending: mockVerificationRequests.filter((r) => r.status === "pending").length,
        approved: mockVerificationRequests.filter((r) => r.status === "approved").length,
        rejected: mockVerificationRequests.filter((r) => r.status === "rejected").length,
      },
    })
  } catch (error) {
    console.error("Admin verifications fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { verificationId, action, notes } = await request.json()

    if (!verificationId || !action) {
      return NextResponse.json({ error: "Verification ID and action are required" }, { status: 400 })
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    // In production, update the database
    const verification = mockVerificationRequests.find((v) => v.id === verificationId)
    if (!verification) {
      return NextResponse.json({ error: "Verification request not found" }, { status: 404 })
    }

    const updatedVerification = {
      ...verification,
      status: action === "approve" ? "approved" : "rejected",
      reviewedBy: user.email,
      reviewedAt: new Date().toISOString(),
      notes: notes || "",
    }

    return NextResponse.json({
      success: true,
      message: `Verification ${action}d successfully`,
      verification: updatedVerification,
    })
  } catch (error) {
    console.error("Admin verification action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
