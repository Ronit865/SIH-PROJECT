import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, Users, MessageSquare, Bell, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const communicationStats = [
  {
    title: "Newsletter Subscribers",
    value: "9,432",
    change: "+3.2%",
    icon: Mail,
    description: "Active subscriptions",
  },
  {
    title: "Messages Sent",
    value: "47,892",
    change: "+12.1%",
    icon: Send,
    description: "This month",
  },
  {
    title: "Open Rate",
    value: "67.8%",
    change: "+2.3%",
    icon: Eye,
    description: "Campaign average",
  },
  {
    title: "Response Rate",
    value: "23.4%",
    change: "+5.7%",
    icon: MessageSquare,
    description: "User engagement",
  },
];

const campaigns = [
  {
    id: 1,
    title: "Monthly Alumni Newsletter - February",
    subject: "Celebrating our Alumni Achievements",
    type: "newsletter",
    status: "sent",
    sentDate: "2024-02-01",
    recipients: 9432,
    opened: 6394,
    clicked: 1247,
    openRate: 67.8,
    clickRate: 13.2,
  },
  {
    id: 2,
    title: "Event Invitation - Tech Summit 2024",
    subject: "Join us for our Annual Tech Innovation Summit",
    type: "event",
    status: "draft",
    sentDate: null,
    recipients: 2847,
    opened: 0,
    clicked: 0,
    openRate: 0,
    clickRate: 0,
  },
  {
    id: 3,
    title: "Fundraising Campaign - Scholarship Fund",
    subject: "Help us support the next generation",
    type: "fundraising",
    status: "scheduled",
    sentDate: "2024-02-15",
    recipients: 8734,
    opened: 0,
    clicked: 0,
    openRate: 0,
    clickRate: 0,
  },
  {
    id: 4,
    title: "Alumni Spotlight - Success Stories",
    subject: "Inspiring stories from our community",
    type: "announcement",
    status: "sent",
    sentDate: "2024-01-28",
    recipients: 9432,
    opened: 7156,
    clicked: 892,
    openRate: 75.9,
    clickRate: 9.5,
  },
];

const notifications = [
  {
    id: 1,
    title: "New Alumni Registration",
    message: "15 new alumni have joined this week",
    type: "info",
    timestamp: "2024-01-20T10:30:00Z",
    read: false,
  },
  {
    id: 2,
    title: "High Email Engagement",
    message: "February newsletter achieved 67.8% open rate",
    type: "success",
    timestamp: "2024-01-20T09:15:00Z",
    read: false,
  },
  {
    id: 3,
    title: "Campaign Scheduled",
    message: "Scholarship fundraising email scheduled for Feb 15",
    type: "info",
    timestamp: "2024-01-19T16:45:00Z",
    read: true,
  },
  {
    id: 4,
    title: "Low Response Rate Alert",
    message: "Event invitations have lower than expected response",
    type: "warning",
    timestamp: "2024-01-19T14:20:00Z",
    read: true,
  },
];

export function Communications() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-success/10 text-success border-success/20">Sent</Badge>;
      case "draft":
        return <Badge variant="outline" className="border-muted-foreground text-muted-foreground">Draft</Badge>;
      case "scheduled":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      newsletter: "bg-blue-100 text-blue-800 border-blue-200",
      event: "bg-green-100 text-green-800 border-green-200",
      fundraising: "bg-purple-100 text-purple-800 border-purple-200",
      announcement: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return <Badge className={variants[type as keyof typeof variants] || ""}>{type}</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Communications</h1>
          <p className="text-muted-foreground mt-2">
            Manage newsletters, announcements, and alumni communications.
          </p>
        </div>
        <Button className="gradient-primary text-primary-foreground hover:shadow-purple">
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        {communicationStats.map((stat, index) => (
          <Card 
            key={stat.title} 
            className="bento-card bento-card-hover gradient-subtle border-card-border/50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <Badge className="bg-success/10 text-success border-success/20">
                  +{stat.change}
                </Badge>
                <span className="text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Compose */}
        <Card className="bento-card gradient-surface border-card-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Quick Message
            </CardTitle>
            <CardDescription>
              Send a quick update to your alumni network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Subject</label>
              <Input placeholder="Enter email subject..." className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Message</label>
              <Textarea 
                placeholder="Write your message..." 
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Recipients</label>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">All Alumni</Button>
                <Button variant="outline" size="sm">Recent Grads</Button>
                <Button variant="outline" size="sm">Donors</Button>
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="lg:col-span-2 bento-card gradient-surface border-card-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Recent Notifications
            </CardTitle>
            <CardDescription>
              Latest communication updates and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border transition-smooth animate-fade-in ${
                    notification.read 
                      ? "border-card-border/50 bg-transparent" 
                      : "border-primary/20 bg-primary/5"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={notification.type === "success" ? "default" : 
                                notification.type === "warning" ? "destructive" : "secondary"}
                        className={
                          notification.type === "success" ? "bg-success/10 text-success border-success/20" :
                          notification.type === "warning" ? "bg-warning/10 text-warning border-warning/20" :
                          "bg-primary/10 text-primary border-primary/20"
                        }
                      >
                        {notification.type}
                      </Badge>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Management */}
      <Card className="bento-card gradient-surface border-card-border/50">
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
          <CardDescription>
            Manage your email marketing campaigns and track performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign, index) => (
                <TableRow 
                  key={campaign.id} 
                  className="hover:bg-accent/30 transition-smooth animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{campaign.title}</p>
                      <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTypeBadge(campaign.type)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(campaign.status)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {campaign.recipients.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {campaign.status === "sent" ? (
                      <span className="font-medium text-foreground">
                        {campaign.openRate}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {campaign.status === "sent" ? (
                      <span className="font-medium text-foreground">
                        {campaign.clickRate}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {campaign.sentDate ? new Date(campaign.sentDate).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}