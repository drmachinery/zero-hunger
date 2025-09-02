export interface ImpactMetrics {
  totalMealsProvided: number
  totalDonationsReceived: number
  totalBeneficiaries: number
  totalProjects: number
  foodWastePrevented: number // in kg
  co2EmissionsSaved: number // in kg
  communitiesReached: number
  volunteersEngaged: number
}

export interface MonthlyImpactData {
  month: string
  meals: number
  donations: number
  beneficiaries: number
  projects: number
}

export interface ProjectImpactData {
  projectId: string
  projectName: string
  totalRaised: number
  mealsProvided: number
  beneficiariesReached: number
  completionPercentage: number
  impactStories: ImpactStory[]
}

export interface ImpactStory {
  id: string
  title: string
  description: string
  imageUrl?: string
  location: string
  beneficiaryName?: string
  date: string
  mealsProvided: number
  projectId: string
}

export interface DonorImpactSummary {
  donorId: string
  totalDonated: number
  totalMealsProvided: number
  projectsSupported: number
  impactRank: number // percentile among all donors
  monthlyImpact: MonthlyImpactData[]
  topProjects: ProjectImpactData[]
}

// Mock impact data
export const mockGlobalImpact: ImpactMetrics = {
  totalMealsProvided: 125000,
  totalDonationsReceived: 87500,
  totalBeneficiaries: 15600,
  totalProjects: 28,
  foodWastePrevented: 45000,
  co2EmissionsSaved: 12500,
  communitiesReached: 85,
  volunteersEngaged: 340,
}

export const mockMonthlyImpact: MonthlyImpactData[] = [
  { month: "Jan", meals: 8500, donations: 12000, beneficiaries: 1200, projects: 5 },
  { month: "Feb", meals: 9200, donations: 13500, beneficiaries: 1350, projects: 6 },
  { month: "Mar", meals: 10800, donations: 15200, beneficiaries: 1480, projects: 7 },
  { month: "Apr", meals: 11500, donations: 16800, beneficiaries: 1620, projects: 8 },
  { month: "May", meals: 12200, donations: 18200, beneficiaries: 1750, projects: 9 },
  { month: "Jun", meals: 13100, donations: 19500, beneficiaries: 1890, projects: 10 },
]

export const mockImpactStories: ImpactStory[] = [
  {
    id: "story-1",
    title: "School Feeding Program Transforms Lives",
    description:
      "Thanks to donor support, 200 children in Kibera now receive daily nutritious meals, improving their health and school attendance by 85%.",
    imageUrl: "/impact-story-school-feeding.png",
    location: "Kibera, Nairobi",
    beneficiaryName: "Grace Wanjiku (School Principal)",
    date: "2024-01-15T00:00:00Z",
    mealsProvided: 6000,
    projectId: "2",
  },
  {
    id: "story-2",
    title: "Emergency Relief Saves Drought-Affected Families",
    description:
      "Rapid response donations provided emergency food supplies to 150 families during the severe drought, preventing malnutrition in children.",
    imageUrl: "/impact-story-drought-relief.png",
    location: "Turkana County",
    beneficiaryName: "John Ekiru (Community Leader)",
    date: "2024-01-20T00:00:00Z",
    mealsProvided: 4500,
    projectId: "1",
  },
  {
    id: "story-3",
    title: "Community Garden Provides Sustainable Food Source",
    description:
      "The community garden project now feeds 80 households with fresh vegetables, reducing food insecurity by 70% in the area.",
    imageUrl: "/impact-story-community-garden.png",
    location: "Kisumu",
    beneficiaryName: "Mary Atieno (Garden Coordinator)",
    date: "2024-01-25T00:00:00Z",
    mealsProvided: 2400,
    projectId: "3",
  },
]

export const mockDonorImpact: DonorImpactSummary = {
  donorId: "donor-1",
  totalDonated: 1250,
  totalMealsProvided: 2500,
  projectsSupported: 3,
  impactRank: 85, // Top 15% of donors
  monthlyImpact: [
    { month: "Jan", meals: 200, donations: 100, beneficiaries: 25, projects: 1 },
    { month: "Feb", meals: 300, donations: 150, beneficiaries: 35, projects: 1 },
    { month: "Mar", meals: 400, donations: 200, beneficiaries: 45, projects: 2 },
    { month: "Apr", meals: 500, donations: 250, beneficiaries: 55, projects: 2 },
    { month: "May", meals: 600, donations: 300, beneficiaries: 65, projects: 3 },
    { month: "Jun", meals: 500, donations: 250, beneficiaries: 60, projects: 3 },
  ],
  topProjects: [
    {
      projectId: "1",
      projectName: "Emergency Food Relief",
      totalRaised: 500,
      mealsProvided: 1000,
      beneficiariesReached: 125,
      completionPercentage: 75,
      impactStories: [mockImpactStories[1]],
    },
    {
      projectId: "2",
      projectName: "School Feeding Program",
      totalRaised: 400,
      mealsProvided: 800,
      beneficiariesReached: 100,
      completionPercentage: 80,
      impactStories: [mockImpactStories[0]],
    },
  ],
}
