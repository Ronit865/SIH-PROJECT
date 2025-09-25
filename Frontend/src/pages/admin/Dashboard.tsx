import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, DollarSign, TrendingUp, UserCheck, Mail, Award, ArrowUpRight, Loader2, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import { adminService, eventService, handleApiError } from "@/services/ApiServices";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';





const recentActivities = [
  {
    id: 1,
    type: "new_member",
    title: "New Alumni Registration",
    description: "Priya Sharma (Class of 2020) joined the network",
    time: "2 hours ago",
    icon: UserCheck,
  },
  {
    id: 2,
    type: "event",
    title: "Tech Innovation Summit",
    description: "AI in Indian Agriculture - 120 attendees registered",
    time: "4 hours ago",
    icon: Calendar,
  },
  {
    id: 3,
    type: "donation",
    title: "New Donation",
    description: "₹2,50,000 received for scholarship fund",
    time: "6 hours ago",
    icon: DollarSign,
  },
  {
    id: 4,
    type: "achievement",
    title: "Alumni Achievement",
    description: "Rajesh Kumar featured in Forbes India 30 Under 30",
    time: "1 day ago",
    icon: Award,
  },
  {
    id: 5,
    type: "event",
    title: "Alumni Meetup Mumbai",
    description: "Networking event at IIT Bombay - 85 RSVPs",
    time: "2 days ago",
    icon: Calendar,
  },
  {
    id: 6,
    type: "new_member",
    title: "New Alumni Registration",
    description: "Ananya Patel (Class of 2019) from Bangalore joined",
    time: "3 days ago",
    icon: UserCheck,
  },
];

const DEPARTMENT_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300',
  '#00ff88', '#ff6b6b', '#4ecdc4', '#45b7d1',
  '#96ceb4', '#ffeaa7', '#fab1a0', '#fd79a8'
];

export function Dashboard() {
  const [totalAlumni, setTotalAlumni] = useState<number>(0);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch alumni data
        const alumniResponse = await adminService.getAllUsers();
        const alumni = Array.isArray(alumniResponse) ? alumniResponse : [];
        setTotalAlumni(alumni.length);

        const eventsResponse = await eventService.getEvents();
        const events = eventsResponse.data || [];
        setTotalEvents(events.length);

         const courseCounts = alumni.reduce((acc: any, user: any) => {
          const course = user.course || 'Not Specified';
          acc[course] = (acc[course] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(courseCounts).map(([name, value], index) => ({
          name,
          value: value as number,
          color: DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]
        }));

        setDepartmentData(chartData);

      } catch (error: any) {
        const apiError = handleApiError(error);
        console.error('Failed to fetch dashboard data:', apiError.message);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

 const renderCustomLabel = (entry: any) => {
    if (departmentData.length === 0) return '';
    const total = departmentData.reduce((sum, item) => sum + item.value, 0);
    const percent = ((entry.value / total) * 100).toFixed(1);
    return `${percent}%`;
  };

   const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Alumni: <span className="font-semibold text-foreground">{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const kpiData = [
    {
      title: "Total Alumni",
      value: loading ? "..." : totalAlumni.toLocaleString(),
      change: "+2.1%",
      changeType: "increase" as const,
      icon: Users,
      description: "Active registered alumni",
    },
    {
      title: "Total Events",
      value: loading ? "..." : totalEvents.toString(),
      change: "+15%",
      changeType: "increase" as const,
      icon: Calendar,
      description: "All events",
    },
    {
      title: "Total Donations",
      value: "₹ 2.4Cr",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }


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
              <Button onClick={() => navigate('/Alumni')} variant="outline" className="h-20 flex-col gap-2 hover:bg-accent/50 transition-smooth">
                <Users className="h-6 w-6 text-primary" />
                <span className="text-sm">Add Alumni</span>
              </Button>
              <Button onClick={() => navigate('/Events')} variant="outline" className="h-20 flex-col gap-2 hover:bg-accent/50 transition-smooth">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="text-sm">Create Event</span>
              </Button>
              <Button onClick={() => navigate('/communications')} variant="outline" className="h-20 flex-col gap-2 hover:bg-accent/50 transition-smooth">
                <Mail className="h-6 w-6 text-primary" />
                <span className="text-sm">Send Newsletter</span>
              </Button>
              <Button onClick={() => navigate('/donations')} variant="outline" className="h-20 flex-col gap-2 hover:bg-accent/50 transition-smooth">
                <DollarSign className="h-6 w-6 text-primary" />
                <span className="text-sm">View Donations</span>
              </Button>
              <Button onClick={() => navigate('/analytics')} variant="outline" className="h-20 flex-col gap-2 hover:bg-accent/50 transition-smooth">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-sm">Analytics</span>
              </Button>
              <Button onClick={() => navigate('/jobs')} variant="outline" className="h-20 flex-col gap-2 hover:bg-accent/50 transition-smooth">
                <Award className="h-6 w-6 text-primary" />
                <span className="text-sm">Jobs</span>
              </Button>
            </div>
          </CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bento-card gradient-surface border-card-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Alumni by Department
            </CardTitle>
            <CardDescription>
              Distribution of alumni across different departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {departmentData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No department data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Department Statistics */}
        <Card className="bento-card gradient-surface border-card-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Department Statistics
            </CardTitle>
            <CardDescription>
              Detailed breakdown by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            {departmentData.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {departmentData
                  .sort((a, b) => b.value - a.value)
                  .map((dept, index) => {
                    const total = departmentData.reduce((sum, item) => sum + item.value, 0);
                    const percentage = ((dept.value / total) * 100).toFixed(1);
                    
                    return (
                      <div key={dept.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/30 transition-smooth">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: dept.color }}
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">{dept.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {percentage}% of total
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {dept.value}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="h-60 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No department data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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