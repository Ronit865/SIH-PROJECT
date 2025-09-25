import { useState } from "react";
import { Send, MessageSquare, Mail, Bell, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const messages = [
  {
    id: 1,
    user: "Sarah Johnson '18",
    message: "Looking for mentorship opportunities in AI/ML. Would love to connect with alumni in this field!",
    timestamp: "2 hours ago",
    replies: 5,
    category: "Mentorship"
  },
  {
    id: 2,
    user: "Michael Chen '15",
    message: "Hosting a fintech startup meetup next month in NYC. Alumni in finance welcome to join!",
    timestamp: "4 hours ago",
    replies: 12,
    category: "Events"
  },
  {
    id: 3,
    user: "Emily Rodriguez '20",
    message: "Just published a research paper on biomedical engineering. Happy to discuss with fellow researchers.",
    timestamp: "1 day ago",
    replies: 8,
    category: "Research"
  },
  {
    id: 4,
    user: "David Kim '16",
    message: "Our marketing agency is hiring! Looking for talented alumni to join our team.",
    timestamp: "2 days ago",
    replies: 15,
    category: "Jobs"
  }
];

const notifications = [
  {
    id: 1,
    title: "New Event: Alumni Tech Summit",
    message: "Registration is now open for the annual tech summit on Dec 15th",
    timestamp: "1 hour ago",
    type: "event",
    read: false
  },
  {
    id: 2,
    title: "Donation Milestone Reached",
    message: "Scholarship fund has reached 85% of its goal thanks to your support!",
    timestamp: "3 hours ago",
    type: "donation",
    read: false
  },
  {
    id: 3,
    title: "New Job Posting",
    message: "Sarah Johnson posted a new software engineering position at Google",
    timestamp: "5 hours ago",
    type: "job",
    read: true
  },
  {
    id: 4,
    title: "Alumni Spotlight",
    message: "Featured this month: Michael Chen's journey from student to VP",
    timestamp: "1 day ago",
    type: "news",
    read: true
  }
];

export default function Communications() {
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Communications</h1>
          <p className="text-muted-foreground">
            Stay connected with the alumni community
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Announcement
        </Button>
      </div>

      <Tabs defaultValue="community" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>
        </TabsList>

        <TabsContent value="community" className="space-y-6">
          {/* New Message */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Community Chat
              </CardTitle>
              <CardDescription>Share updates, ask questions, and connect with fellow alumni</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Share something with the community..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Add Image</Button>
                      <Button variant="outline" size="sm">Add Poll</Button>
                    </div>
                    <Button className="gap-2">
                      <Send className="w-4 h-4" />
                      Post Message
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages Feed */}
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {message.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">{message.user}</h4>
                          <Badge variant="outline">{message.category}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{message.timestamp}</span>
                      </div>
                      <p className="text-muted-foreground">{message.message}</p>
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <MessageSquare className="w-4 h-4" />
                          {message.replies} replies
                        </Button>
                        <Button variant="ghost" size="sm">Like</Button>
                        <Button variant="ghost" size="sm">Share</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Recent Notifications
              </CardTitle>
              <CardDescription>Stay updated with important announcements and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                      !notification.read ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                        <Badge variant="secondary">{notification.type}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="broadcasts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Email Broadcasts
              </CardTitle>
              <CardDescription>Send announcements to alumni groups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="Enter email subject..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient Group</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>All Alumni</option>
                    <option>Class of 2020</option>
                    <option>Class of 2019</option>
                    <option>Technology Alumni</option>
                    <option>Business Alumni</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Message Content</label>
                <Textarea 
                  placeholder="Write your announcement..."
                  className="min-h-[150px]"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Save Draft</Button>
                  <Button variant="outline" size="sm">Preview</Button>
                </div>
                <Button className="gap-2">
                  <Send className="w-4 h-4" />
                  Send Broadcast
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Broadcasts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Broadcasts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    subject: "Alumni Tech Summit 2024 - Registration Open",
                    recipients: "All Alumni",
                    sent: "2 days ago",
                    opens: "68%"
                  },
                  {
                    subject: "Scholarship Fund Update - 85% Goal Reached",
                    recipients: "Donors",
                    sent: "1 week ago",
                    opens: "72%"
                  },
                  {
                    subject: "New Job Opportunities from Alumni Network",
                    recipients: "Recent Graduates",
                    sent: "2 weeks ago",
                    opens: "65%"
                  }
                ].map((broadcast, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-medium">{broadcast.subject}</h4>
                      <p className="text-sm text-muted-foreground">
                        Sent to {broadcast.recipients} • {broadcast.sent}
                      </p>
                    </div>
                    <Badge variant="secondary">{broadcast.opens} open rate</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}