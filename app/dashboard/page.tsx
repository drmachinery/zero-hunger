import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Heart, DollarSign, Target, TrendingUp, MapPin, Users } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis } from "recharts"
import { mockProjects } from "@/lib/mock-data"
import Link from "next/link"

// Mock user donations data
const mockUserDonations = [
  {
    id: "1",
    projectId: "1",
    projectTitle: "Emergency Food Relief for Rural Communities",
    amount: 100,
    frequency: "one-time",
    date: "2024-01-20T00:00:00Z",
    status: "completed",
    mealsProvided: 200,
  },
  {
    id: "2",
    projectId: "2",
    projectTitle: "School Feeding Program - Urban Schools",
    amount: 50,
    frequency: "monthly",
    date: "2024-01-15T00:00:00Z",
    status: "completed",
    mealsProvided: 100,
  },
]

const monthlyImpactData = [
  { month: "Jan", meals: 200, donations: 100 },
  { month: "Feb", meals: 300, donations: 150 },
  { month: "Mar", meals: 400, donations: 200 },
  { month: "Apr", meals: 500, donations: 250 },
  { month: "May", meals: 600, donations: 300 },
  { month: "Jun", meals: 300, donations: 150 },
]

const chartConfig = {
  meals: {
    label: "Meals Provided",
    color: "hsl(var(--chart-1))",
  },
  donations: {
    label: "Donations ($)",
    color: "hsl(var(--chart-2))",
  },
}

export default function DashboardPage() {
  const totalDonated = mockUserDonations.reduce((sum, donation) => sum + donation.amount, 0)
  const totalMeals = mockUserDonations.reduce((sum, donation) => sum + donation.mealsProvided, 0)
  const activeRecurring = mockUserDonations.filter((d) => d.frequency === "monthly").length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <Link href="/" className="text-2xl font-bold text-foreground">
              ZeroHunger
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-foreground font-medium">
              Dashboard
            </Link>
            <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link href="/impact" className="text-muted-foreground hover:text-foreground transition-colors">
              My Impact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/profile">Profile</Link>
            </Button>
            <Button asChild>
              <Link href="/projects">Donate</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for being part of the fight against hunger. Here's your impact summary.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalDonated}</div>
              <p className="text-xs text-muted-foreground">Across {mockUserDonations.length} donations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meals Provided</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalMeals}</div>
              <p className="text-xs text-muted-foreground">To families in need</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Recurring</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activeRecurring}</div>
              <p className="text-xs text-muted-foreground">Monthly donations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects Supported</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">2</div>
              <p className="text-xs text-muted-foreground">Active projects</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="donations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="donations">My Donations</TabsTrigger>
            <TabsTrigger value="projects">Recommended Projects</TabsTrigger>
            <TabsTrigger value="impact">Impact Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="donations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>Your contribution history and impact tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserDonations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{donation.projectTitle}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            ${donation.amount} • {donation.frequency}
                          </span>
                          <span>{new Date(donation.date).toLocaleDateString()}</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {donation.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">{donation.mealsProvided} meals</div>
                        <div className="text-sm text-muted-foreground">provided</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/donations/history">View All Donations</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockProjects.slice(0, 4).map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={project.imageUrl || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground">{project.category}</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg text-balance">{project.title}</CardTitle>
                    <CardDescription>{project.shortDescription}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          ${project.raisedAmount.toLocaleString()} / ${project.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(project.raisedAmount / project.targetAmount) * 100} className="h-2" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{project.location}</span>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href={`/projects/${project.id}/donate`}>Donate Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Impact This Year</CardTitle>
                <CardDescription>See how your donations are making a difference</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium">Meals Provided by Month</h4>
                      <ChartContainer config={chartConfig}>
                        <AreaChart data={monthlyImpactData}>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area
                            type="monotone"
                            dataKey="meals"
                            stroke="var(--color-meals)"
                            fill="var(--color-meals)"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ChartContainer>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Monthly Donations vs Impact</h4>
                      <ChartContainer config={chartConfig}>
                        <BarChart data={monthlyImpactData}>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="donations" fill="var(--color-donations)" />
                        </BarChart>
                      </ChartContainer>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/impact">View Detailed Impact Report</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
