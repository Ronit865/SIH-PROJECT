import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Activity, Calendar, Mail, DollarSign, Eye, Download } from "lucide-react";

const analyticsData = [
  {
    title: "Total Alumni",
    value: "12,547",
    change: "+2.1%",
    changeType: "increase" as const,
    icon: Users,
    description: "Active members",
    trend: "up",
  },
  {
    title: "Monthly Active",
    value: "8,234",
    change: "+5.8%",
    changeType: "increase" as const,
    icon: Activity,
    description: "Last 30 days",
    trend: "up",
  },
  {
    title: "Event Attendance",
    value: "2,847",
    change: "+12.3%",
    changeType: "increase" as const,
    icon: Calendar,
    description: "This quarter",
    trend: "up",
  },
  {
    title: "Email Engagement",
    value: "67.8%",
    change: "+3.2%",
    changeType: "increase" as const,
    icon: Mail,
    description: "Open rate",
    trend: "up",
  },
  {
    title: "Donation Rate",
    value: "18.5%",
    change: "+1.7%",
    changeType: "increase" as const,
    icon: DollarSign,
    description: "Participation",
    trend: "up",
  },
  {
    title: "Profile Completion",
    value: "84.2%",
    change: "+4.1%",
    changeType: "increase" as const,
    icon: Users,
    description: "Average",
    trend: "up",
  },
];

const engagementMetrics = [
  {
    title: "Newsletter Subscribers",
    value: "9,432",
    percentage: 75.2,
    description: "% of total alumni",
  },
  {
    title: "Event RSVPs",
    value: "3,241",
    percentage: 25.8,
    description: "% of total alumni",
  },
  {
    title: "Job Board Users",
    value: "5,678",
    percentage: 45.3,
    description: "% of total alumni",
  },
  {
    title: "Mentorship Program",
    value: "1,234",
    percentage: 9.8,
    description: "% of total alumni",
  },
];

const topUniversities = [
  { name: "Computer Science", count: 2847, percentage: 22.7 },
  { name: "Business Administration", count: 2156, percentage: 17.2 },
  { name: "Engineering", count: 1923, percentage: 15.3 },
  { name: "Liberal Arts", count: 1654, percentage: 13.2 },
  { name: "Medicine", count: 1345, percentage: 10.7 },
];

const geographicData = [
  { location: "California", count: 3456, percentage: 27.5 },
  { location: "New York", count: 2134, percentage: 17.0 },
  { location: "Texas", count: 1876, percentage: 15.0 },
  { location: "Florida", count: 1234, percentage: 9.8 },
  { location: "International", count: 987, percentage: 7.9 },
];

export function Analytics() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights into alumni engagement and network growth.
          </p>
        </div>
        <Button variant="outline" className="hover:bg-accent">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Main KPI Grid - Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
        {analyticsData.map((metric, index) => (
          <Card 
            key={metric.title} 
            className="bento-card bento-card-hover gradient-subtle border-card-border/50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-2">{metric.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <Badge className="bg-success/10 text-success border-success/20">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {metric.change}
                </Badge>
                <span className="text-muted-foreground">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Engagement Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bento-card gradient-surface border-card-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Engagement Metrics
            </CardTitle>
            <CardDescription>
              Alumni participation across different platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {engagementMetrics.map((metric, index) => (
                <div 
                  key={metric.title} 
                  className="space-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">{metric.title}</span>
                    <span className="text-sm text-muted-foreground">{metric.value}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-700"
                      style={{ width: `${metric.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{metric.percentage.toFixed(1)}% {metric.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bento-card gradient-surface border-card-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Top Majors
            </CardTitle>
            <CardDescription>
              Alumni distribution by field of study
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUniversities.map((major, index) => (
                <div 
                  key={major.name} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/30 transition-smooth animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    <span className="font-medium text-foreground">{major.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{major.count.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{major.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bento-card gradient-surface border-card-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>
              Alumni locations across different regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {geographicData.map((location, index) => (
                <div 
                  key={location.location} 
                  className="p-4 rounded-lg border border-card-border/50 hover:bg-accent/30 transition-smooth animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-foreground">{location.location}</span>
                    <Badge variant="outline">{location.count}</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-700"
                      style={{ width: `${location.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {location.percentage}% of total alumni
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bento-card gradient-surface border-card-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Quick Stats
            </CardTitle>
            <CardDescription>
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="text-2xl font-bold text-primary">94.2%</div>
                <div className="text-sm text-muted-foreground">System Uptime</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-success/5 border border-success/20">
                <div className="text-2xl font-bold text-success">2.3s</div>
                <div className="text-sm text-muted-foreground">Avg. Load Time</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-warning/5 border border-warning/20">
                <div className="text-2xl font-bold text-warning">1,247</div>
                <div className="text-sm text-muted-foreground">Active Sessions</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-secondary/50 border border-secondary">
                <div className="text-2xl font-bold text-secondary-foreground">99.7%</div>
                <div className="text-sm text-muted-foreground">Data Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}