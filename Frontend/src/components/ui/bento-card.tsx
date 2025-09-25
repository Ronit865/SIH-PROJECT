import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BentoCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  gradient?: boolean;
}

const sizeClasses = {
  sm: "col-span-1 row-span-1",
  md: "col-span-2 row-span-1", 
  lg: "col-span-2 row-span-2",
  xl: "col-span-3 row-span-2"
};

export function BentoCard({ 
  title, 
  description, 
  children, 
  className, 
  size = "md",
  gradient = false 
}: BentoCardProps) {
  return (
    <Card className={cn(
      "bento-card hover-lift group transition-all duration-300",
      sizeClasses[size],
      gradient && "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20",
      className
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && (
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        {children}
      </CardContent>
    </Card>
  );
}