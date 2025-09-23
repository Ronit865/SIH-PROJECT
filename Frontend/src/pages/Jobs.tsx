import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Briefcase, MapPin, Clock, IndianRupee, Search, Plus, CheckCircle, XCircle, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const jobsData = [
 {
    "id": 1,
    "title": "Senior Software Engineer",
    "company": "Infosys Technologies",
    "location": "Bengaluru, Karnataka",
    "type": "Full-time",
    "salary": "₹12,00,000 - ₹18,00,000 per annum",
    "postedBy": "Rohit Sharma (Class of 2019)",
    "postedDate": "2024-01-15",
    "status": "pending",
    "applications": 23,
    "description": "Join our team to develop enterprise-scale AI-powered solutions.",
    "category": "job"
  },
  {
    "id": 2,
    "title": "Marketing Manager",
    "company": "Hindustan Unilever Ltd.",
    "location": "Mumbai, Maharashtra",
    "type": "Full-time",
    "salary": "₹8,00,000 - ₹12,00,000 per annum",
    "postedBy": "Ananya Mehta (Class of 2018)",
    "postedDate": "2024-01-12",
    "status": "approved",
    "applications": 15,
    "description": "Lead marketing initiatives for FMCG products across India.",
    "category": "job"
  },
  {
    "id": 3,
    "title": "Mentorship: Product Management",
    "company": "Various Indian Startups",
    "location": "Remote",
    "type": "Mentorship",
    "salary": "Pro Bono",
    "postedBy": "Arjun Verma (Class of 2020)",
    "postedDate": "2024-01-10",
    "status": "approved",
    "applications": 8,
    "description": "1-on-1 mentorship for alumni transitioning into product management roles in Indian startups.",
    "category": "mentorship"
  },
  {
    "id": 4,
    "title": "Data Scientist",
    "company": "TCS Analytics",
    "location": "Hyderabad, Telangana",
    "type": "Contract",
    "salary": "₹3,000 - ₹5,000 per day",
    "postedBy": "Neha Gupta (Class of 2017)",
    "postedDate": "2024-01-08",
    "status": "pending",
    "applications": 31,
    "description": "6-month contract to build predictive models for retail and e-commerce clients.",
    "category": "job"
  },
  {
    "id": 5,
    "title": "Career Coaching Sessions",
    "company": "Alumni Connect India",
    "location": "Virtual",
    "type": "Mentorship",
    "salary": "Free",
    "postedBy": "Karan Patel (Class of 2021)",
    "postedDate": "2024-01-05",
    "status": "approved",
    "applications": 12,
    "description": "Weekly online career coaching sessions for fresh graduates in India.",
    "category": "mentorship"
  }
];

export function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || job.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-warning text-warning">Pending Review</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "job":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Job</Badge>;
      case "mentorship":
        return <Badge className="bg-secondary/50 text-secondary-foreground border-secondary">Mentorship</Badge>;
      default:
        return <Badge variant="secondary">Other</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Jobs & Mentorship</h1>
          <p className="text-muted-foreground mt-2">
            Moderate job postings and mentorship opportunities shared by alumni.
          </p>
        </div>
        <Button className="gradient-primary text-primary-foreground hover:shadow-purple">
          <Plus className="h-4 w-4 mr-2" />
          Add Opportunity
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
        <Card className="bento-card gradient-subtle border-card-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Listings</p>
                <p className="text-2xl font-bold text-foreground">127</p>
              </div>
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bento-card gradient-subtle border-card-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-warning">23</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bento-card gradient-subtle border-card-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold text-success">1,247</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bento-card gradient-subtle border-card-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mentorship</p>
                <p className="text-2xl font-bold text-primary">34</p>
              </div>
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bento-card gradient-surface border-card-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <CardTitle>Opportunity Listings</CardTitle>
              <CardDescription>
                Review and moderate job postings and mentorship opportunities
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Category: {selectedCategory === "all" ? "All" : selectedCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedCategory("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory("job")}>Jobs</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory("mentorship")}>Mentorship</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Status: {selectedStatus === "all" ? "All" : selectedStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedStatus("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("pending")}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("approved")}>Approved</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("rejected")}>Rejected</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <Card 
                key={job.id} 
                className="bento-card hover:shadow-md border-card-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                        {getCategoryBadge(job.category)}
                        {getStatusBadge(job.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" />
                          {job.salary}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{job.description}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-muted-foreground">Posted by: </span>
                          <span className="font-medium text-foreground">{job.postedBy}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">
                            {job.applications} applications
                          </span>
                          <span className="text-muted-foreground">
                            {new Date(job.postedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {job.status === "pending" && (
                        <>
                          <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Contact Poster
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Remove Listing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}