import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Briefcase,
  Heart,
  MessageCircle,
  MessageSquare,
  Settings,
  Sun,
  Moon,
  GraduationCap,
  BarChart3,
  Mail
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigation = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Alumni Directory", url: "/alumni", icon: Users },
  { title: "Events", url: "/events", icon: Calendar },
  { title: "Jobs & Mentorship", url: "/jobs", icon: Briefcase },
  { title: "Donations", url: "/donations", icon: Heart },
  { title: "Personal Messages", url: "/messages", icon: MessageCircle },
  { title: "Communications", url: "/communications", icon: MessageSquare },
];

const adminNavigation = [
  { title: "Admin Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Manage Alumni", url: "/admin/alumni", icon: Users },
  { title: "Manage Events", url: "/admin/events", icon: Calendar },
  { title: "Manage Jobs", url: "/admin/jobs", icon: Briefcase },
  { title: "Manage Donations", url: "/admin/donations", icon: Heart },
  { title: "Communications", url: "/admin/communications", icon: Mail },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

const bottomNavigation = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  
  // Determine if we're in admin mode
  const isAdminMode = location.pathname.startsWith('/admin');

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const baseClasses = "sidebar-nav-item w-full justify-start gap-3 h-11 px-3 font-medium";
    return isActive(path) 
      ? `${baseClasses} active bg-primary text-primary-foreground` 
      : `${baseClasses} text-muted-foreground hover:text-foreground hover:bg-accent`;
  };

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarContent className="p-0">
        {/* Logo Section */}
        <div className={`border-b ${open ? "p-6" : "p-3"}`}>
          <div className={`flex items-center ${open ? "gap-3" : "justify-center"}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            {open && (
              <div className="min-w-0">
                <h1 className="font-bold text-lg gradient-text truncate">AlumniHub</h1>
                <p className="text-sm text-muted-foreground truncate">Management System</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className={open ? "px-3" : "px-2"}>
          <SidebarGroupLabel className={!open ? "sr-only" : ""}>
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {(isAdminMode ? adminNavigation : navigation).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="w-5 h-5 shrink-0" />
                      {open && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Section */}
        <div className={`mt-auto border-t ${open ? "p-3" : "p-2"}`}>
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to={isAdminMode ? "/admin/settings" : "/settings"} className={getNavClasses(isAdminMode ? "/admin/settings" : "/settings")}>
                  <Settings className="w-5 h-5 shrink-0" />
                  {open && <span className="truncate">Settings</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            {/* Theme Toggle */}
            <SidebarMenuItem>
              <Button
                variant="ghost"
                size={!open ? "icon" : "default"}
                onClick={toggleTheme}
                className={`${!open ? "w-11 h-11 justify-center" : "w-full justify-start gap-3 h-11"} text-muted-foreground hover:text-foreground hover:bg-accent`}
              >
                {isDark ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
                {open && <span className="truncate">{isDark ? "Light Mode" : "Dark Mode"}</span>}
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}