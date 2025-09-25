import { useState } from "react";
import { Search, Filter, MapPin, Briefcase, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const alumni = [
  {
    id: 1,
    name: "Sarah Johnson",
    graduation: "Class of 2018",
    major: "Computer Science",
    company: "Google",
    position: "Senior Software Engineer",
    location: "San Francisco, CA",
    industry: "Technology",
    avatar: "",
    achievements: ["Tech Innovation Award", "Alumni Mentor"]
  },
  {
    id: 2,
    name: "Michael Chen",
    graduation: "Class of 2015",
    major: "Business Administration",
    company: "Goldman Sachs",
    position: "Vice President",
    location: "New York, NY",
    industry: "Finance",
    avatar: "",
    achievements: ["Top Performer", "Board Member"]
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    graduation: "Class of 2020",
    major: "Biomedical Engineering",
    company: "Johnson & Johnson",
    position: "Research Scientist",
    location: "Boston, MA",
    industry: "Healthcare",
    avatar: "",
    achievements: ["Research Excellence", "Patent Holder"]
  },
  {
    id: 4,
    name: "David Kim",
    graduation: "Class of 2016",
    major: "Marketing",
    company: "Netflix",
    position: "Director of Marketing",
    location: "Los Angeles, CA",
    industry: "Entertainment",
    avatar: "",
    achievements: ["Creative Leader", "Brand Innovator"]
  },
  {
    id: 5,
    name: "Jessica White",
    graduation: "Class of 2019",
    major: "Environmental Science",
    company: "Tesla",
    position: "Sustainability Manager",
    location: "Austin, TX",
    industry: "Clean Energy",
    avatar: "",
    achievements: ["Environmental Champion", "Green Award"]
  },
  {
    id: 6,
    name: "Robert Taylor",
    graduation: "Class of 2014",
    major: "Law",
    company: "Own Practice",
    position: "Managing Partner",
    location: "Chicago, IL",
    industry: "Legal",
    avatar: "",
    achievements: ["Top Lawyer", "Community Leader"]
  }
];

export default function Alumni() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  const filteredAlumni = alumni.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         person.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         person.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesYear = selectedYear === "all" || person.graduation.includes(selectedYear);
    const matchesIndustry = selectedIndustry === "all" || person.industry === selectedIndustry;
    
    return matchesSearch && matchesYear && matchesIndustry;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Alumni Directory</h1>
        <p className="text-muted-foreground">
          Connect with {alumni.length}+ alumni across various industries and locations
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by name, company, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Graduation Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2020">Class of 2020</SelectItem>
              <SelectItem value="2019">Class of 2019</SelectItem>
              <SelectItem value="2018">Class of 2018</SelectItem>
              <SelectItem value="2016">Class of 2016</SelectItem>
              <SelectItem value="2015">Class of 2015</SelectItem>
              <SelectItem value="2014">Class of 2014</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Clean Energy">Clean Energy</SelectItem>
              <SelectItem value="Legal">Legal</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAlumni.length} of {alumni.length} alumni
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((person) => (
          <Card key={person.id} className="hover-lift group">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16 ring-2 ring-primary/20">
                  <AvatarImage src={person.avatar} alt={person.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{person.graduation}</p>
                  <p className="text-sm text-muted-foreground">{person.major}</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{person.position}</p>
                    <p className="text-muted-foreground">{person.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{person.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary">{person.industry}</Badge>
                {person.achievements.slice(0, 2).map((achievement) => (
                  <Badge key={achievement} variant="outline" className="text-xs">
                    {achievement}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  Connect
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {filteredAlumni.length > 0 && (
        <div className="text-center pt-6">
          <Button variant="outline" size="lg">
            Load More Alumni
          </Button>
        </div>
      )}
    </div>
  );
}