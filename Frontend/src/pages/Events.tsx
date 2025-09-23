import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock, MapPin, Users, Plus, Eye, Edit, Trash2, Loader2, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { eventService, handleApiError } from "@/services/ApiServices";
import { toast } from "sonner";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  participants: string[];
  isactive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateEventForm {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
}

export function Events() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CreateEventForm>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: ""
  });
  const [formErrors, setFormErrors] = useState<Partial<CreateEventForm>>({});

  // Fetch events from backend
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEvents();
      setEvents(response.data || []);
      setError(null);
    } catch (err: any) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
      toast.error(`Failed to fetch events: ${errorInfo.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await eventService.deleteEvent(eventId);
      toast.success("Event deleted successfully");
      fetchEvents(); // Refresh the events list
    } catch (err: any) {
      const errorInfo = handleApiError(err);
      toast.error(`Failed to delete event: ${errorInfo.message}`);
    }
  };

  const handleInputChange = (field: keyof CreateEventForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<CreateEventForm> = {};
    
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    
    if (!formData.date) {
      errors.date = "Date is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsCreating(true);
      
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        time: formData.time || undefined,
        location: formData.location.trim() || undefined
      };

      await eventService.createEvent(eventData);
      toast.success("Event created successfully");
      
      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: ""
      });
      setFormErrors({});
      setIsCreateDialogOpen(false);
      
      // Refresh events list
      fetchEvents();
    } catch (err: any) {
      const errorInfo = handleApiError(err);
      toast.error(`Failed to create event: ${errorInfo.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: ""
    });
    setFormErrors({});
  };

  const filteredEvents = events.filter(event => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "active") return event.isactive;
    if (selectedFilter === "inactive") return !event.isactive;
    return true;
  });

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
    } else {
      return <Badge variant="outline" className="border-warning text-warning">Inactive</Badge>;
    }
  };

  // Calculate stats from actual data
  const totalEvents = events.length;
  const activeEvents = events.filter(event => event.isactive).length;
  const totalParticipants = events.reduce((total, event) => total + event.participants.length, 0);
  const averageParticipants = totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading events...</span>
      </div>
    );
  }

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
        
        {/* Create Event Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="gradient-primary text-primary-foreground hover:shadow-purple"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bento-card gradient-surface border-card-border/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-foreground">Create New Event</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Fill in the details below to create a new event for the alumni community.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateEvent} className="space-y-6 mt-4">
              {/* Event Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-foreground">
                  Event Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`border-card-border/50 focus:border-primary ${
                    formErrors.title ? "border-destructive" : ""
                  }`}
                />
                {formErrors.title && (
                  <p className="text-sm text-destructive">{formErrors.title}</p>
                )}
              </div>

              {/* Event Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className={`min-h-[100px] border-card-border/50 focus:border-primary resize-none ${
                    formErrors.description ? "border-destructive" : ""
                  }`}
                />
                {formErrors.description && (
                  <p className="text-sm text-destructive">{formErrors.description}</p>
                )}
              </div>

              {/* Date and Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-foreground">
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className={`border-card-border/50 focus:border-primary ${
                      formErrors.date ? "border-destructive" : ""
                    }`}
                  />
                  {formErrors.date && (
                    <p className="text-sm text-destructive">{formErrors.date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium text-foreground">
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    className="border-card-border/50 focus:border-primary"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-foreground">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Enter event location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="border-card-border/50 focus:border-primary"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-card-border/20">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsCreateDialogOpen(false);
                  }}
                  disabled={isCreating}
                  className="border-card-border/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="gradient-primary text-primary-foreground hover:shadow-purple"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
            <Button onClick={fetchEvents} variant="outline" size="sm" className="mt-2">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
        <Card className="bento-card gradient-subtle border-card-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold text-foreground">{totalEvents}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bento-card gradient-subtle border-card-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Events</p>
                <p className="text-2xl font-bold text-primary">{activeEvents}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bento-card gradient-subtle border-card-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
                <p className="text-2xl font-bold text-success">{totalParticipants}</p>
              </div>
              <Users className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bento-card gradient-subtle border-card-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Participants</p>
                <p className="text-2xl font-bold text-warning">{averageParticipants}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1 bento-card gradient-surface border-card-border/50 h-fit">
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
                    <DropdownMenuItem onClick={() => setSelectedFilter("active")}>
                      Active Events
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedFilter("inactive")}>
                      Inactive Events
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={fetchEvents} variant="outline" size="sm">
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No events found</p>
                </div>
              ) : (
                filteredEvents.map((event, index) => (
                  <Card 
                    key={event._id} 
                    className="bento-card hover:shadow-md border-card-border/50 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                            {getStatusBadge(event.isactive)}
                          </div>
                          <p className="text-muted-foreground mb-4">{event.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-primary" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            {event.time && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>{event.time}</span>
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              <span className="text-sm">
                                {event.participants.length} participants
                              </span>
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
                              Manage Participants
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteEvent(event._id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}