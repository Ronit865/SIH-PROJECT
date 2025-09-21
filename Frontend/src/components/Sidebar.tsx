import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, Users, Calendar, Briefcase, DollarSign, 
  BarChart3, MessageSquare, Moon, Sun, Menu,
  GraduationCap, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Sidebar as SidebarPrimitive, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Alumni", href: "/alumni", icon: Users },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Jobs & Mentorship", href: "/jobs", icon: Briefcase },
  { name: "Donations", href: "/donations", icon: DollarSign },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Communications", href: "/communications", icon: MessageSquare },
];

const bottomNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <SidebarPrimitive className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300 bg-sidebar border-r border-sidebar-border`}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">AlumniHub</h1>
              <p className="text-xs text-sidebar-foreground/60">Management System</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <SidebarContent className="flex-1 px-3 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-medium uppercase tracking-wider mb-3">
              {!collapsed && "Main Menu"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                          isActive(item.href)
                            ? "bg-sidebar-accent text-sidebar-primary font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary"
                        }`}
                      >
                        <item.icon 
                          className={`h-5 w-5 transition-colors ${
                            isActive(item.href) ? "text-sidebar-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-primary"
                          }`} 
                        />
                        {!collapsed && (
                          <span className="font-medium">{item.name}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Bottom Section */}
        <div className="border-t border-sidebar-border p-3">
          <SidebarMenu className="space-y-1">
            {bottomNavigation.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive(item.href)
                        ? "bg-sidebar-accent text-sidebar-primary font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary"
                    }`}
                  >
                    <item.icon 
                      className={`h-5 w-5 transition-colors ${
                        isActive(item.href) ? "text-sidebar-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-primary"
                      }`} 
                    />
                    {!collapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            
            {/* Dark Mode Toggle */}
            <SidebarMenuItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className={`w-full justify-start gap-3 px-3 py-2.5 h-auto text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary ${
                  collapsed ? "px-2" : ""
                }`}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                {!collapsed && (
                  <span className="font-medium">
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </span>
                )}
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </div>
    </SidebarPrimitive>
  );
}