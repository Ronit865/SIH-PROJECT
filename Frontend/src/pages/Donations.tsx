import { Heart, TrendingUp, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BentoCard } from "@/components/ui/bento-card";

const campaigns = [
  {
    id: 1,
    title: "Scholarship Fund 2025",
    description: "Supporting underprivileged students with full scholarships",
    raised: 850000,
    goal: 1000000,
    donors: 234,
    daysLeft: 45,
    category: "Education"
  },
  {
    id: 2,
    title: "New Research Center",
    description: "Building state-of-the-art AI research facilities",
    raised: 2400000,
    goal: 5000000,
    donors: 156,
    daysLeft: 120,
    category: "Infrastructure"
  },
  {
    id: 3,
    title: "Emergency Student Aid",
    description: "Providing immediate financial assistance to students in need",
    raised: 125000,
    goal: 200000,
    donors: 89,
    daysLeft: 30,
    category: "Support"
  }
];

export default function Donations() {
  const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.raised, 0);
  const totalDonors = campaigns.reduce((sum, campaign) => sum + campaign.donors, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Donations & Impact</h1>
        <p className="text-muted-foreground">
          Make a difference in the lives of current and future students
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Raised</p>
                <p className="text-2xl font-bold">${(totalRaised / 1000000).toFixed(1)}M</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Donors</p>
                <p className="text-2xl font-bold">{totalDonors}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scholarships Funded</p>
                <p className="text-2xl font-bold">127</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lives Impacted</p>
                <p className="text-2xl font-bold">2,847</p>
              </div>
              <Heart className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Campaign */}
      <BentoCard
        title="Featured Campaign"
        description="Our most urgent fundraising priority"
        size="xl"
        gradient
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Scholarship Fund 2025</h3>
            <p className="text-muted-foreground">
              Help us provide full scholarships to deserving students who might not otherwise 
              have access to higher education. Every dollar makes a difference.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">${(850000).toLocaleString()} raised</span>
              <span className="text-muted-foreground">Goal: ${(1000000).toLocaleString()}</span>
            </div>
            <Progress value={85} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>234 donors</span>
              <span>45 days left</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button size="lg" className="flex-1">
              Donate Now
            </Button>
            <Button size="lg" variant="outline" className="flex-1">
              Learn More
            </Button>
          </div>
        </div>
      </BentoCard>

      {/* Active Campaigns */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Active Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="hover-lift group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {campaign.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {campaign.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{campaign.category}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">${campaign.raised.toLocaleString()}</span>
                    <span className="text-muted-foreground">
                      of ${campaign.goal.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={(campaign.raised / campaign.goal) * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{campaign.donors} donors</span>
                  <span>{campaign.daysLeft} days left</span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    Donate
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Impact Stories */}
      <Card>
        <CardHeader>
          <CardTitle>Impact Stories</CardTitle>
          <CardDescription>See how your donations are making a difference</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-primary">JS</span>
              </div>
              <div>
                <h4 className="font-semibold">Jessica Smith, Class of 2023</h4>
                <p className="text-sm text-muted-foreground">
                  "Thanks to the scholarship fund, I was able to complete my engineering degree 
                  and now work at a leading tech company. This opportunity changed my life."
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-primary">MD</span>
              </div>
              <div>
                <h4 className="font-semibold">Michael Davis, Class of 2022</h4>
                <p className="text-sm text-muted-foreground">
                  "The emergency aid program helped me stay in school during a difficult time. 
                  I'm now giving back to help other students in similar situations."
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}