import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { mockGlobalImpact, mockMonthlyImpact, mockImpactStories, mockDonorImpact } from "@/lib/impact-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "global"
    const userId = searchParams.get("userId")

    switch (type) {
      case "global":
        return NextResponse.json({
          metrics: mockGlobalImpact,
          monthlyData: mockMonthlyImpact,
          stories: mockImpactStories,
        })

      case "donor":
        const user = await getUser()
        if (!user) {
          return NextResponse.json({ error: "Authentication required" }, { status: 401 })
        }

        return NextResponse.json({
          impact: mockDonorImpact,
          stories: mockImpactStories.filter((story) =>
            mockDonorImpact.topProjects.some((project) => project.projectId === story.projectId),
          ),
        })

      case "project":
        const projectId = searchParams.get("projectId")
        if (!projectId) {
          return NextResponse.json({ error: "Project ID required" }, { status: 400 })
        }

        const projectStories = mockImpactStories.filter((story) => story.projectId === projectId)
        const projectMetrics = {
          totalMeals: projectStories.reduce((sum, story) => sum + story.mealsProvided, 0),
          beneficiariesReached: projectStories.length * 50, // Mock calculation
          storiesCount: projectStories.length,
        }

        return NextResponse.json({
          metrics: projectMetrics,
          stories: projectStories,
        })

      default:
        return NextResponse.json({ error: "Invalid impact type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Impact API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
