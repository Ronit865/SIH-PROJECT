import { Calendar, Users, Briefcase, TrendingUp, Heart, MessageCircle } from "lucide-react";
import { BentoCard } from "@/components/ui/bento-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to AlumniHub
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-6 max-w-2xl">
            Connect, engage, and grow with our vibrant alumni community. Discover events, 
            opportunities, and meaningful connections that last a lifetime.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Explore Community
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Join Events
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 border hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Alumni</p>
              <p className="text-2xl font-bold">12,847</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 border hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Events</p>
              <p className="text-2xl font-bold">23</p>
            </div>
            <Calendar className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 border hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Job Postings</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 border hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Donations</p>
              <p className="text-2xl font-bold">$2.4M</p>
            </div>
            <Heart className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-6 grid-rows-4 gap-6 min-h-[600px]">
        <BentoCard 
          title="Upcoming Events" 
          description="Don't miss these exciting opportunities"
          size="lg" 
          gradient
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Alumni Tech Summit 2024</h4>
                <p className="text-sm text-muted-foreground">Dec 15, 2024 • San Francisco</p>
              </div>
              <Badge>Tech</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Healthcare Innovation Panel</h4>
                <p className="text-sm text-muted-foreground">Dec 20, 2024 • Virtual</p>
              </div>
              <Badge variant="secondary">Healthcare</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Annual Gala Night</h4>
                <p className="text-sm text-muted-foreground">Jan 5, 2025 • New York</p>
              </div>
              <Badge variant="outline">Networking</Badge>
            </div>
            <Button className="w-full mt-4">View All Events</Button>
          </div>
        </BentoCard>

        <BentoCard 
          title="Alumni Spotlight" 
          description="Celebrating our community achievements"
          size="md"
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">JS</span>
              </div>
              <div>
                <p className="font-medium text-sm">Jane Smith '18</p>
                <p className="text-xs text-muted-foreground">Founded TechStart Inc.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">MD</span>
              </div>
              <div>
                <p className="font-medium text-sm">Mike Davis '15</p>
                <p className="text-xs text-muted-foreground">WHO Medical Director</p>
              </div>
            </div>
          </div>
        </BentoCard>

        <BentoCard 
          title="Job Opportunities" 
          description="Latest career opportunities"
          size="md"
        >
          <div className="space-y-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm">Senior Software Engineer</h4>
              <p className="text-xs text-muted-foreground">Google • $180k-220k</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm">Product Manager</h4>
              <p className="text-xs text-muted-foreground">Meta • $160k-200k</p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View All Jobs
            </Button>
          </div>
        </BentoCard>

        <BentoCard 
          title="Community Chat" 
          description="Recent conversations"
          size="md"
        >
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-3 h-3" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Alumni '20</p>
                <p className="text-sm">Looking for mentorship in AI/ML field</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-3 h-3" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Alumni '18</p>
                <p className="text-sm">Startup founder seeking investors</p>
              </div>
            </div>
          </div>
        </BentoCard>

        <BentoCard 
          title="Donation Impact" 
          description="Making a difference together"
          size="lg"
        >
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">$2.4M</p>
              <p className="text-sm text-muted-foreground">Raised this year</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scholarships</span>
                <span>65%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Research</span>
                <span>25%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Infrastructure</span>
                <span>10%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
            <Button className="w-full">Support a Cause</Button>
          </div>
        </BentoCard>
      </div>
    </div>
  );
}