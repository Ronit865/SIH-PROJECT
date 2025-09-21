import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, DollarSign, TrendingUp, UserCheck, Mail, Award, ArrowUpRight } from "lucide-react";

const kpiData = [
  {
    title: "Total Alumni",
    value: "12,547",
    change: "+2.1%",
    changeType: "increase" as const,
    icon: Users,
    description: "Active registered alumni",
  },
  {
    title: "Upcoming Events",
    value: "23",
    change: "+15%",
    changeType: "increase" as const,
    icon: Calendar,
    description: "Next 30 days",
  },
  {
    title: "Total Donations",
    value: "$2.4M",
    change: "+12.5%",
    changeType: "increase" as const,
    icon: DollarSign,
    description: "This year",
  },
  {
    title: "Engagement Rate",
    value: "68%",
    change: "+5.2%",
    changeType: "increase" as const,
    icon: TrendingUp,
    description: "Monthly active users",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "new_member",
    title: "New Alumni Registration",
    description: "Sarah Johnson (Class of 2019) joined the network",
    time: "2 hours ago",
    icon: UserCheck,
  },
  {
    id: 2,
    type: "event",
    title: "Tech Talk Event",
    description: "AI in Healthcare - 45 attendees registered",
    time: "4 hours ago",
    icon: Calendar,
  },
  {
    id: 3,
    type: "donation",
    title: "New Donation",
    description: "$5,000 received for scholarship fund",
    time: "6 hours ago",
    icon: DollarSign,
  },
  {
    id: 4,
    type: "achievement",
    title: "Alumni Achievement",
    description: "Michael Chen featured in Forbes 30 Under 30",
    time: "1 day ago",
    icon: Award,
  },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's what's happening with your alumni network.
        </p>
      </div>

      {/* KPI Grid - Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        {kpiData.map((kpi, index) => (
          <Card 
            key={kpi.title} 
            className="bento-card bento-card-hover gradient-subtle border-card-border/50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <Badge 
                  variant={kpi.changeType === "increase" ? "default" : "destructive"}
                  className="bg-success/10 text-success border-success/20"
                >
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {kpi.change}
                </Badge>
                <span className="text-muted-foreground">{kpi.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions - Larger Bento Card */}
        <Card className="lg:col-span-2 bento-card gradient-surface border-card-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Frequently used management tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-accent/50 transition-smooth">
                <Users className="h-6 w-6 text-primary" />
                <span className="text-sm">Add Alumni</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-accent/50 transition-smooth">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="text-sm">Create Event</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-accent/50 transition-smooth">
                <Mail className="h-6 w-6 text-primary" />
                <span className="text-sm">Send Newsletter</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-accent/50 transition-smooth">
                <DollarSign className="h-6 w-6 text-primary" />
                <span className="text-sm">View Donations</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-accent/50 transition-smooth">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-sm">Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-accent/50 transition-smooth">
                <Award className="h-6 w-6 text-primary" />
                <span className="text-sm">Achievements</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bento-card gradient-surface border-card-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/30 transition-smooth animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-primary hover:bg-primary/10">
              View All Activities
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}