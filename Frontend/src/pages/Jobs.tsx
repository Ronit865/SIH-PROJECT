import { useState } from "react";
import { Search, MapPin, Clock, DollarSign, Building, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const jobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Google",
    location: "Mountain View, CA",
    type: "Full-time",
    salary: "$180,000 - $220,000",
    posted: "2 days ago",
    category: "Technology",
    experience: "5+ years",
    description: "Join our team building next-generation cloud infrastructure solutions.",
    alumni: "Sarah Johnson '18"
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Meta",
    location: "Menlo Park, CA",
    type: "Full-time",
    salary: "$160,000 - $200,000",
    posted: "1 week ago",
    category: "Product",
    experience: "3+ years",
    description: "Lead product strategy for our emerging social commerce platform.",
    alumni: "Michael Chen '15"
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "Netflix",
    location: "Los Gatos, CA",
    type: "Full-time",
    salary: "$150,000 - $190,000",
    posted: "3 days ago",
    category: "Data",
    experience: "4+ years",
    description: "Build ML models to personalize content recommendations for millions of users.",
    alumni: "Emily Rodriguez '20"
  },
  {
    id: 4,
    title: "Marketing Director",
    company: "Airbnb",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$170,000 - $210,000",
    posted: "5 days ago",
    category: "Marketing",
    experience: "7+ years",
    description: "Drive global marketing strategy and brand growth initiatives.",
    alumni: "David Kim '16"
  }
];

const mentorships = [
  {
    id: 1,
    mentor: "Sarah Johnson '18",
    title: "Senior Software Engineer at Google",
    expertise: ["Software Engineering", "Career Growth", "Tech Leadership"],
    experience: "6 years",
    availability: "2 hours/week",
    rating: 4.9,
    sessions: 45
  },
  {
    id: 2,
    mentor: "Michael Chen '15",
    title: "VP at Goldman Sachs",
    expertise: ["Finance", "Investment Banking", "Career Transition"],
    experience: "9 years",
    availability: "1 hour/week",
    rating: 4.8,
    sessions: 32
  },
  {
    id: 3,
    mentor: "Emily Rodriguez '20",
    title: "Research Scientist at J&J",
    expertise: ["Biomedical Research", "PhD Guidance", "Industry Transition"],
    experience: "4 years",
    availability: "3 hours/week",
    rating: 4.9,
    sessions: 28
  }
];

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Jobs & Mentorship</h1>
          <p className="text-muted-foreground">
            Discover career opportunities and connect with alumni mentors
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Post Job
        </Button>
      </div>

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="jobs">Job Opportunities</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search jobs by title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Data">Data Science</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover-lift group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {job.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span className="font-medium">{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.posted}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">{job.category}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{job.salary}</span>
                    </div>
                    <Badge variant="outline">{job.type}</Badge>
                    <Badge variant="outline">{job.experience}</Badge>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Posted by <span className="font-medium text-primary">{job.alumni}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Save
                      </Button>
                      <Button size="sm">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mentorship" className="space-y-6">
          {/* Mentorship Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentorships.map((mentor) => (
              <Card key={mentor.id} className="hover-lift group">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="font-medium text-primary">
                        {mentor.mentor.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {mentor.mentor}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {mentor.title}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Expertise</p>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Experience</p>
                      <p className="font-medium">{mentor.experience}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Availability</p>
                      <p className="font-medium">{mentor.availability}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Rating: </span>
                      <span className="font-medium">{mentor.rating}/5.0</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{mentor.sessions} sessions</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      Request Mentorship
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}