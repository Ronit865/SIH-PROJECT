import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function AdminToggle() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminMode = location.pathname.startsWith('/admin');

  const toggleMode = () => {
    if (isAdminMode) {
      // Switch to user mode
      const userPath = location.pathname.replace('/admin', '') || '/';
      navigate(userPath);
    } else {
      // Switch to admin mode
      const adminPath = location.pathname === '/' ? '/admin' : `/admin${location.pathname}`;
      navigate(adminPath);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isAdminMode ? "default" : "secondary"} className="flex items-center gap-1">
        {isAdminMode ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}
        {isAdminMode ? "Admin" : "User"}
      </Badge>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleMode}
        className="text-xs"
      >
        Switch to {isAdminMode ? "User" : "Admin"}
      </Button>
    </div>
  );
}