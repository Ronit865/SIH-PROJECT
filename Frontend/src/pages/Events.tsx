import { useState } from "react";
import { Calendar, MapPin, Users, Clock, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BentoCard } from "@/components/ui/bento-card";

const events = [
  {
    id: 1,
    title: "Alumni Tech Summit 2024",
    description: "Join industry leaders for a day of innovation, networking, and cutting-edge technology discussions.",
    date: "December 15, 2024",
    time: "9:00 AM - 6:00 PM",
    location: "San Francisco Convention Center",
    type: "Conference",
    category: "Technology",
    attendees: 250,
    maxAttendees: 300,
    image: "/api/placeholder/400/200",
    featured: true
  },
  {
    id: 2,
    title: "Healthcare Innovation Panel",
    description: "Exploring the future of healthcare with alumni working in medical technology and research.",
    date: "December 20, 2024",
    time: "2:00 PM - 4:00 PM",
    location: "Virtual Event",
    type: "Panel",
    category: "Healthcare",
    attendees: 120,
    maxAttendees: 200,
    image: "/api/placeholder/400/200",
    featured: false
  },
  {
    id: 3,
    title: "Annual Alumni Gala",
    description: "Our biggest networking event of the year featuring dinner, awards, and entertainment.",
    date: "January 5, 2025",
    time: "6:00 PM - 11:00 PM",
    location: "Grand Ballroom, NYC",
    type: "Gala",
    category: "Networking",
    attendees: 480,
    maxAttendees: 500,
    image: "/api/placeholder/400/200",
    featured: true
  },
  {
    id: 4,
    title: "Entrepreneurship Workshop",
    description: "Learn from successful alumni entrepreneurs about starting and scaling businesses.",
    date: "January 12, 2025",
    time: "10:00 AM - 3:00 PM",
    location: "University Campus",
    type: "Workshop",
    category: "Business",
    attendees: 85,
    maxAttendees: 100,
    image: "/api/placeholder/400/200",
    featured: false
  },
  {
    id: 5,
    title: "Climate Action Symposium",
    description: "Discussing sustainable solutions and environmental initiatives with climate-focused alumni.",
    date: "January 18, 2025",
    time: "1:00 PM - 5:00 PM",
    location: "Environmental Science Building",
    type: "Symposium",
    category: "Environment",
    attendees: 95,
    maxAttendees: 150,
    image: "/api/placeholder/400/200",
    featured: false
  },
  {
    id: 6,
    title: "Finance & Investment Mixer",
    description: "Connect with alumni in finance, investment banking, and venture capital.",
    date: "January 25, 2025",
    time: "7:00 PM - 10:00 PM",
    location: "Downtown Financial District",
    type: "Mixer",
    category: "Finance",
    attendees: 140,
    maxAttendees: 180,
    image: "/api/placeholder/400/200",
    featured: false
  }
];

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredEvents = filteredEvents.filter(event => event.featured);
  const regularEvents = filteredEvents.filter(event => !event.featured);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Alumni Events</h1>
          <p className="text-muted-foreground">
            Discover upcoming events and connect with fellow alumni
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Featured Events</h2>
          <div className="grid grid-cols-6 grid-rows-3 gap-6 min-h-[400px]">
            {featuredEvents.map((event, index) => (
              <BentoCard
                key={event.id}
                title={event.title}
                description={event.description}
                size={index === 0 ? "xl" : "lg"}
                gradient={index === 0}
                className="group cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{event.category}</Badge>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees}/{event.maxAttendees} attendees</span>
                    </div>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                    />
                  </div>

                  <Button className="w-full mt-4 group-hover:bg-primary/90 transition-colors">
                    Register Now
                  </Button>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      )}

      {/* Regular Events */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularEvents.map((event) => (
            <Card key={event.id} className="hover-lift group cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                  <Badge variant="secondary">{event.category}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees}/{event.maxAttendees} attendees</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Registration</span>
                    <span>{Math.round((event.attendees / event.maxAttendees) * 100)}% full</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    Register
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Load More */}
      {filteredEvents.length > 6 && (
        <div className="text-center pt-6">
          <Button variant="outline" size="lg">
            Load More Events
          </Button>
        </div>
      )}
    </div>
  );
}