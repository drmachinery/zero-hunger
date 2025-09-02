import type { User } from "@/lib/auth"

export interface AdminUser extends User {
  status: "active" | "suspended" | "pending"
  lastLogin: string
  totalDonations?: number
  projectsCreated?: number
  foodListings?: number
}

export interface VerificationRequest {
  id: string
  userId: string
  userType: "ngo" | "food-provider"
  organizationName: string
  email: string
  documents: string[]
  submittedAt: string
  status: "pending" | "approved" | "rejected"
  reviewedBy?: string
  reviewedAt?: string
  notes?: string
}

export interface ContentReport {
  id: string
  reportedBy: string
  contentType: "project" | "comment" | "profile"
  contentId: string
  reason: string
  description: string
  status: "pending" | "resolved" | "dismissed"
  createdAt: string
  resolvedBy?: string
  resolvedAt?: string
}

// Mock admin data
export const mockAdminUsers: AdminUser[] = [
  {
    id: "1",
    email: "john.donor@example.com",
    firstName: "John",
    lastName: "Smith",
    phone: "+1234567890",
    role: "donor",
    verified: true,
    status: "active",
    createdAt: "2024-01-15T00:00:00Z",
    lastLogin: "2024-01-22T10:30:00Z",
    totalDonations: 1250,
  },
  {
    id: "2",
    email: "hope.foundation@example.com",
    firstName: "Hope",
    lastName: "Foundation",
    phone: "+1234567891",
    role: "ngo",
    verified: true,
    status: "active",
    createdAt: "2024-01-10T00:00:00Z",
    lastLogin: "2024-01-22T09:15:00Z",
    projectsCreated: 3,
  },
  {
    id: "3",
    email: "fresh.market@example.com",
    firstName: "Fresh",
    lastName: "Market Co",
    phone: "+1234567892",
    role: "food-provider",
    verified: true,
    status: "active",
    createdAt: "2024-01-12T00:00:00Z",
    lastLogin: "2024-01-21T16:45:00Z",
    foodListings: 15,
  },
  {
    id: "4",
    email: "suspicious.user@example.com",
    firstName: "Suspicious",
    lastName: "User",
    phone: "+1234567893",
    role: "donor",
    verified: false,
    status: "suspended",
    createdAt: "2024-01-20T00:00:00Z",
    lastLogin: "2024-01-20T12:00:00Z",
    totalDonations: 0,
  },
]

export const mockVerificationRequests: VerificationRequest[] = [
  {
    id: "1",
    userId: "5",
    userType: "ngo",
    organizationName: "Rural Aid Foundation",
    email: "contact@ruralaid.org",
    documents: ["Registration Certificate", "Tax Exemption", "Board Resolution"],
    submittedAt: "2024-01-20T00:00:00Z",
    status: "pending",
  },
  {
    id: "2",
    userId: "6",
    userType: "food-provider",
    organizationName: "Metro Grocery Chain",
    email: "donations@metrogrocery.com",
    documents: ["Business License", "Food Safety Certificate", "Insurance"],
    submittedAt: "2024-01-19T00:00:00Z",
    status: "pending",
  },
  {
    id: "3",
    userId: "7",
    userType: "ngo",
    organizationName: "Community Care",
    email: "info@communitycare.org",
    documents: ["Registration Certificate", "Tax Exemption"],
    submittedAt: "2024-01-18T00:00:00Z",
    status: "approved",
    reviewedBy: "admin@example.com",
    reviewedAt: "2024-01-19T10:30:00Z",
    notes: "All documents verified successfully",
  },
]

export const mockContentReports: ContentReport[] = [
  {
    id: "1",
    reportedBy: "user1@example.com",
    contentType: "project",
    contentId: "project-123",
    reason: "misleading_information",
    description: "The project description contains false claims about fund allocation",
    status: "pending",
    createdAt: "2024-01-21T00:00:00Z",
  },
  {
    id: "2",
    reportedBy: "user2@example.com",
    contentType: "comment",
    contentId: "comment-456",
    reason: "inappropriate_content",
    description: "Comment contains offensive language",
    status: "resolved",
    createdAt: "2024-01-20T00:00:00Z",
    resolvedBy: "admin@example.com",
    resolvedAt: "2024-01-21T09:15:00Z",
  },
]
