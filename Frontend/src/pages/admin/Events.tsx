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
  const [date, setDate] = useState<Date | undefined>(undefined);
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

  // Function to get events for a specific date
  const getEventsForDate = (checkDate: Date) => {
    const dateString = checkDate.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === dateString;
    });
  };

  // Function to check if a date has events
  const hasEvents = (checkDate: Date) => {
    return getEventsForDate(checkDate).length > 0;
  };

  // Function to get event dates for calendar highlighting
  const getEventDates = () => {
    return events.map(event => new Date(event.date));
  };

  // Custom day content renderer for calendar
  const dayContentRenderer = (day: Date) => {
    const dayEvents = getEventsForDate(day);
    const hasActiveEvents = dayEvents.some(event => event.isactive);
    const hasInactiveEvents = dayEvents.some(event => !event.isactive);
    
    return (
      <div className="relative w-full h-full flex items-center justify-center p-1">
        <span className={`relative z-10 text-center ${dayEvents.length > 0 ? 'font-semibold' : ''}`}>
          {day.getDate()}
        </span>
        {dayEvents.length > 0 && (
          <>
            {/* Event indicator dot */}
            <div className={`absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
              hasActiveEvents ? 'bg-primary' : 'bg-muted-foreground'
            }`} />
            {/* Multiple events indicator */}
            {dayEvents.length > 1 && (
              <div className={`absolute bottom-0.5 left-1/2 transform -translate-x-1/2 translate-x-2 w-1 h-1 rounded-full ${
                hasActiveEvents ? 'bg-primary' : 'bg-muted-foreground'
              }`} />
            )}
          </>
        )}
      </div>
    );
  };

  // Filter events based on selected date
  const getFilteredEventsForSelectedDate = () => {
    if (!date) return filteredEvents;
    
    const selectedDateEvents = getEventsForDate(date);
    return selectedDateEvents.filter(event => {
      if (selectedFilter === "all") return true;
      if (selectedFilter === "active") return event.isactive;
      if (selectedFilter === "inactive") return !event.isactive;
      return true;
    });
  };

  // Get events to display (either for selected date or all filtered events)
  const eventsToDisplay = date ? getFilteredEventsForSelectedDate() : filteredEvents;

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
            <CardDescription>
              Select a date to view events
              {date && getEventsForDate(date).length > 0 && (
                <span className="block text-sm text-primary mt-1">
                  {getEventsForDate(date).length} event(s) on selected date
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-0 w-full"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] flex-1 text-center",
                row: "flex w-full mt-2",
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md flex-1",
                day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-md mx-auto flex items-center justify-center",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
              components={{
                DayContent: ({ date: dayDate }) => dayContentRenderer(dayDate)
              }}
              modifiers={{
                hasEvents: (day) => hasEvents(day),
                hasActiveEvents: (day) => getEventsForDate(day).some(event => event.isactive),
                hasInactiveEvents: (day) => getEventsForDate(day).some(event => !event.isactive)
              }}
              modifiersClassNames={{
                hasEvents: "bg-primary/10 hover:bg-primary/20",
                hasActiveEvents: "text-primary",
                hasInactiveEvents: "text-muted-foreground"
              }}
            />
            
            {/* Calendar Legend */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>Active Events</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                <span>Inactive Events</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <Card className="lg:col-span-3 bento-card gradient-surface border-card-border/50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {date ? `Events for ${date.toLocaleDateString()}` : 'All Events'}
                </CardTitle>
                <CardDescription>
                  {date ? 
                    `Showing events for selected date` : 
                    'Manage your event calendar'
                  }
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {date && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDate(undefined)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Date
                  </Button>
                )}
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
              {eventsToDisplay.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {date ? 'No events found for selected date' : 'No events found'}
                  </p>
                </div>
              ) : (
                eventsToDisplay.map((event, index) => (
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