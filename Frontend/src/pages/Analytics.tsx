import { TrendingUp, Users, Calendar, DollarSign, Activity, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Analytics & Insights</h1>
        <p className="text-muted-foreground">
          Track engagement, growth, and community metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alumni</p>
                <p className="text-2xl font-bold">12,847</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +5.2% this month
                </p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">3,421</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.1% this month
                </p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Events This Month</p>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  6 upcoming
                </p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Donations</p>
                <p className="text-2xl font-bold">$284K</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +18.3% this month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              User Engagement
            </CardTitle>
            <CardDescription>Monthly active users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Chart visualization would go here</p>
                <p className="text-sm">Integration with chart library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Alumni Growth
            </CardTitle>
            <CardDescription>New alumni registrations by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Growth chart would go here</p>
                <p className="text-sm">Integration with chart library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Events</CardTitle>
            <CardDescription>Most popular events by attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Alumni Tech Summit 2024", attendees: 287, trend: "+15%" },
                { name: "Annual Gala Night", attendees: 245, trend: "+8%" },
                { name: "Healthcare Innovation Panel", attendees: 156, trend: "+22%" },
                { name: "Finance Networking Mixer", attendees: 134, trend: "+5%" },
              ].map((event, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-muted-foreground">{event.attendees} attendees</p>
                  </div>
                  <Badge variant="secondary" className="text-green-600">
                    {event.trend}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Alumni Activity</CardTitle>
            <CardDescription>Most engaged alumni this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Sarah Johnson '18", activity: "15 interactions", type: "Mentor" },
                { name: "Michael Chen '15", activity: "12 interactions", type: "Donor" },
                { name: "Emily Rodriguez '20", activity: "10 interactions", type: "Speaker" },
                { name: "David Kim '16", activity: "8 interactions", type: "Volunteer" },
              ].map((alumni, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {alumni.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{alumni.name}</p>
                      <p className="text-sm text-muted-foreground">{alumni.activity}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{alumni.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>Where our alumni are located</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { region: "North America", count: 8547, percentage: 66.5 },
              { region: "Europe", count: 2134, percentage: 16.6 },
              { region: "Asia Pacific", count: 1523, percentage: 11.9 },
              { region: "Other", count: 643, percentage: 5.0 },
            ].map((region) => (
              <div key={region.region} className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{region.count.toLocaleString()}</p>
                <p className="font-medium">{region.region}</p>
                <p className="text-sm text-muted-foreground">{region.percentage}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}