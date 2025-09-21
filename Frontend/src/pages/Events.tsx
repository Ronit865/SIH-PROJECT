import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock, MapPin, Users, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const eventsData = [
  {
    id: 1,
    title: "Annual Alumni Gala",
    description: "Join us for an elegant evening celebrating our alumni achievements",
    date: "2024-03-15",
    time: "18:00",
    location: "Grand Ballroom, University Center",
    attendees: 245,
    maxAttendees: 300,
    type: "gala",
    status: "published",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Tech Innovation Summit",
    description: "Explore the latest in AI and machine learning with industry leaders",
    date: "2024-03-22",
    time: "09:00",
    location: "Engineering Building Auditorium",
    attendees: 120,
    maxAttendees: 150,
    type: "conference",
    status: "published",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Virtual Career Fair",
    description: "Connect with top employers and explore new opportunities",
    date: "2024-03-28",
    time: "14:00",
    location: "Online Event",
    attendees: 89,
    maxAttendees: 500,
    type: "virtual",
    status: "draft",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Regional Meetup - New York",
    description: "Casual networking event for NY-based alumni",
    date: "2024-04-05",
    time: "19:00",
    location: "The Plaza Hotel, New York",
    attendees: 67,
    maxAttendees: 100,
    type: "meetup",
    status: "published",
    image: "/placeholder.svg",
  },
];

export function Events() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredEvents = eventsData.filter(event => {
    if (selectedFilter === "all") return true;
    return event.type === selectedFilter;
  });

  const getEventTypeBadge = (type: string) => {
    const variants = {
      gala: "bg-purple-100 text-purple-800 border-purple-200",
      conference: "bg-blue-100 text-blue-800 border-blue-200",
      virtual: "bg-green-100 text-green-800 border-green-200",
      meetup: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return <Badge className={variants[type as keyof typeof variants] || ""}>{type}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-success/10 text-success border-success/20">Published</Badge>;
      case "draft":
        return <Badge variant="outline" className="border-warning text-warning">Draft</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
          <p className="text-muted-foreground mt-2">
            Create, manage, and track alumni events and gatherings.
          </p>
        </div>
        <Button className="gradient-primary text-primary-foreground hover:shadow-purple">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
        <Card className="bento-card gradient-subtle border-card-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold text-foreground">47</p>
              </div>
              <CalendarDays className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bento-card gradient-subtle border-card-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-primary">8</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bento-card gradient-subtle border-card-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Attendees</p>
                <p className="text-2xl font-bold text-success">2,847</p>
              </div>
              <Users className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bento-card gradient-subtle border-card-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Attendance</p>
                <p className="text-2xl font-bold text-warning">84%</p>
              </div>
              <CalendarDays className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1 bento-card gradient-surface border-card-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Event Calendar</CardTitle>
            <CardDescription>Select a date to view events</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-0"
            />
          </CardContent>
        </Card>

        {/* Events List */}
        <Card className="lg:col-span-3 bento-card gradient-surface border-card-border/50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Manage your event calendar</CardDescription>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Filter: {selectedFilter === "all" ? "All Events" : selectedFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedFilter("all")}>
                      All Events
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedFilter("gala")}>
                      Galas
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedFilter("conference")}>
                      Conferences
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedFilter("virtual")}>
                      Virtual Events
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedFilter("meetup")}>
                      Meetups
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEvents.map((event, index) => (
                <Card 
                  key={event.id} 
                  className="bento-card hover:shadow-md border-card-border/50 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                          {getEventTypeBadge(event.type)}
                          {getStatusBadge(event.status)}
                        </div>
                        <p className="text-muted-foreground mb-4">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="text-sm">
                              {event.attendees}/{event.maxAttendees} registered
                            </span>
                          </div>
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-4">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Event
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Manage Attendees
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Event
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}