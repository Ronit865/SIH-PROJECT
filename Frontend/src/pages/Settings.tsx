import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { adminService, handleApiError, handleApiSuccess } from "@/services/ApiServices";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Mail, 
  Palette, 
  Database,
  Key,
  Download,
  Upload
} from "lucide-react";

export function Settings() {
  const { admin, fetchCurrentUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state for admin profile
  const [profileData, setProfileData] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      setIsUpdating(true);
      const response = await adminService.updateAdminProfile(profileData);
      
      if (response.success) {
        const successData = handleApiSuccess(response);
        toast.success("Profile updated successfully");
        await fetchCurrentUser(); // Refresh admin data
      }
    } catch (error: any) {
      const apiError = handleApiError(error);
      toast.error(apiError.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or GIF file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await adminService.updateAdminAvatar(formData);
      
      if (response.success) {
        toast.success("Avatar updated successfully");
        await fetchCurrentUser(); // Refresh admin data
      }
    } catch (error: any) {
      const apiError = handleApiError(error);
      toast.error(apiError.message || "Failed to update avatar");
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setIsChangingPassword(true);
      const response = await adminService.changeAdminPassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      if (response.success) {
        toast.success("Password changed successfully");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }
    } catch (error: any) {
      const apiError = handleApiError(error);
      toast.error(apiError.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings, preferences, and system configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="lg:col-span-2 bento-card gradient-surface border-card-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={admin?.avatar} alt={admin?.name || "Admin"} />
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {admin?.name?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
                />
              </div>
            </div>

            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={handleProfileUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bento-card gradient-surface border-card-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Alumni Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Import Alumni Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" />
              Bulk Email Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Database className="h-4 w-4 mr-2" />
              Database Backup
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card className="bento-card gradient-surface border-card-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your account security and access controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input 
                id="currentPassword" 
                type="password" 
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData(prev => ({...prev, oldPassword: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input 
                id="newPassword" 
                type="password" 
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
              />
            </div>
            <Button 
              variant="outline"
              onClick={handlePasswordChange}
              disabled={isChangingPassword || !passwordData.oldPassword || !passwordData.newPassword}
            >
              <Key className="h-4 w-4 mr-2" />
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Active Sessions</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg border border-card-border/50">
                <div>
                  <p className="text-sm font-medium">Current Session</p>
                  <p className="text-xs text-muted-foreground">
                    Chrome on Windows • Your Location
                  </p>
                </div>
                <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="bento-card gradient-surface border-card-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            System Configuration
          </CardTitle>
          <CardDescription>
            Configure system-wide settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Default Timezone</Label>
                <Input id="timezone" defaultValue="America/Los_Angeles" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Input id="dateFormat" defaultValue="MM/DD/YYYY" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Input id="currency" defaultValue="USD" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">System Language</Label>
                <Input id="language" defaultValue="English (US)" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Alumni Auto-Approval</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve alumni registrations with verified email domains
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Public Alumni Directory</Label>
                <p className="text-sm text-muted-foreground">
                  Allow alumni to view other alumni profiles in the directory
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Event Registration Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Send automatic confirmation emails for event registrations
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <Button className="bg-primary hover:bg-primary/90">
            Save System Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}