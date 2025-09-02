import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export type UserRole = "donor" | "ngo" | "food-provider" | "admin"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: UserRole
  verified: boolean
  createdAt: string
}

export interface AuthTokenPayload {
  userId: string
  email: string
  role: UserRole
  exp: number
}

export async function createToken(user: User): Promise<string> {
  return await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(secret)
}

export async function verifyToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as AuthTokenPayload
  } catch (error) {
    return null
  }
}

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return null
  }

  // In a real app, you'd fetch from database
  // For now, return mock user data
  return {
    id: payload.userId,
    email: payload.email,
    firstName: "John",
    lastName: "Doe",
    phone: "+1234567890",
    role: payload.role,
    verified: true,
    createdAt: new Date().toISOString(),
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}
