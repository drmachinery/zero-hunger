import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { processPayment } from "@/lib/payment-gateways"

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { projectId, amount, frequency, paymentMethod, message, anonymous, phoneNumber, donationType } =
      await request.json()

    // Validate input
    if (!amount || !frequency || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const isGeneralDonation = projectId === "general" || !projectId

    if (Number(amount) < 1) {
      return NextResponse.json({ error: "Minimum donation amount is $1" }, { status: 400 })
    }

    if (paymentMethod === "mpesa" && (!phoneNumber || phoneNumber.length < 10)) {
      return NextResponse.json({ error: "Valid phone number required for M-Pesa" }, { status: 400 })
    }

    const paymentRequest = {
      amount: paymentMethod === "card" ? Number(amount) * 100 : Number(amount), // Stripe uses cents
      currency: "usd",
      description: isGeneralDonation
        ? `General donation - ${donationType || "General Fund"}`
        : `Donation to project ${projectId}`,
      metadata: {
        projectId: projectId || "general",
        donorId: user.id,
        frequency,
        donationType: donationType || "general",
      },
      customerEmail: user.email,
      phoneNumber: phoneNumber || undefined,
    }

    const paymentResult = await processPayment(paymentMethod, paymentRequest)

    if (!paymentResult.success) {
      return NextResponse.json(
        {
          error: paymentResult.error || "Payment processing failed",
        },
        { status: 400 },
      )
    }

    // Create donation record
    const donation = {
      id: Math.random().toString(36).substr(2, 9),
      donorId: user.id,
      projectId: projectId || "general",
      donationType: donationType || "general",
      type: "monetary",
      amount: Number(amount),
      frequency,
      paymentMethod,
      message: message || "",
      anonymous: anonymous || false,
      status: paymentMethod === "card" ? "pending" : "completed", // Stripe needs confirmation
      transactionId: paymentResult.transactionId,
      paymentIntentId: paymentResult.paymentIntentId,
      createdAt: new Date().toISOString(),
      receiptUrl: `/receipts/${Math.random().toString(36).substr(2, 9)}.pdf`,
    }

    const response: any = {
      success: true,
      donation,
      message: "Donation processed successfully",
    }

    if (paymentResult.clientSecret) {
      response.clientSecret = paymentResult.clientSecret
      response.requiresConfirmation = true
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Donation processing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Mock user donations - in production, fetch from database
    const mockDonations = [
      {
        id: "1",
        donorId: user.id,
        projectId: "1",
        projectTitle: "Emergency Food Relief for Rural Communities",
        amount: 100,
        frequency: "one-time",
        paymentMethod: "card",
        status: "completed",
        createdAt: "2024-01-20T00:00:00Z",
        receiptUrl: "/receipts/receipt-1.pdf",
      },
      {
        id: "2",
        donorId: user.id,
        projectId: "2",
        projectTitle: "School Feeding Program - Urban Schools",
        amount: 50,
        frequency: "monthly",
        paymentMethod: "mpesa",
        status: "completed",
        createdAt: "2024-01-15T00:00:00Z",
        receiptUrl: "/receipts/receipt-2.pdf",
      },
    ]

    return NextResponse.json({
      donations: mockDonations,
      total: mockDonations.reduce((sum, d) => sum + d.amount, 0),
      count: mockDonations.length,
    })
  } catch (error) {
    console.error("Get donations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
