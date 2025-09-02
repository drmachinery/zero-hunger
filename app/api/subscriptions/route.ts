import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { planId, interval = "month" } = await request.json()

    if (!planId) {
      return NextResponse.json({ error: "Plan ID required" }, { status: 400 })
    }

    // Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
          userRole: user.role,
        },
      })
      customerId = customer.id
      // In production, save customerId to user record
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: `price_${planId}_${interval}ly`,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        userId: user.id,
        planId: planId,
      },
    })

    const invoice = subscription.latest_invoice as Stripe.Invoice
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
      status: subscription.status,
    })
  } catch (error: any) {
    console.error("Subscription creation error:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to create subscription",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Mock subscription data - in production, fetch from database
    const mockSubscription = {
      id: "sub_mock123",
      planId: user.role === "ngo" ? "ngo_basic" : "ngo_basic",
      status: "active",
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
    }

    return NextResponse.json({ subscription: mockSubscription })
  } catch (error) {
    console.error("Get subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
