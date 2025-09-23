import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/ApiServices";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  MapPin,
  Building,
  Calendar,
  Loader2,
  Upload,
  FileText,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Define the User interface based on your backend model
interface User {
  _id: string;
  name: string;
  email: string;
  graduationYear?: string;
  course?: string;
  phone?: string;
  role?: string;
  avatar?: string;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export function Alumni() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const queryClient = useQueryClient();

  // CSV Upload Mutation
  const uploadCSVMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('csv', file);
      return await adminService.uploadCSV(formData);
    },
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: "Alumni data uploaded successfully",
      });
      setIsDialogOpen(false);
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload CSV file",
        variant: "destructive",
      });
    },
  });

  // Fetch alumni data using React Query
  const {
    data: alumniResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["alumni"],
    queryFn: async () => {
      const response = await adminService.getAllUsers();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch alumni data",
        variant: "destructive",
      });
    }
  }, [error]);

  const alumniData: User[] = Array.isArray(alumniResponse) 
    ? alumniResponse 
    : [];

  const filteredAlumni = alumniData.filter((alumni) => {
    if (!alumni || typeof alumni !== "object") {
      return false;
    }

    const matchesSearch =
      alumni.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.course?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "verified" && alumni.isVerified) ||
      (selectedStatus === "pending" && !alumni.isVerified);
    return matchesSearch && matchesStatus;
  });

  // Calculate stats from actual data
  const totalAlumni = alumniData.length;
  const verifiedAlumni = alumniData.filter(
    (alumni) => alumni?.isVerified
  ).length;
  const pendingAlumni = alumniData.filter(
    (alumni) => !alumni?.isVerified
  ).length;
  const activeAlumni = verifiedAlumni;

  const getStatusBadge = (isVerified: boolean) => {
    if (isVerified) {
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          Verified
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="border-warning text-warning">
          Pending
        </Badge>
      );
    }
  };

  // File upload handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        variant: "destructive",
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv') {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV file",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadCSVMutation.mutate(selectedFile);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading alumni data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Alumni Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage alumni profiles, verify registrations, and track engagement.
          </p>
        </div>
        
        {/* Add Alumni Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground hover:shadow-purple">
              <Plus className="h-4 w-4 mr-2" />
              Add Alumni
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bento-card gradient-surface border-card-border/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload Alumni CSV
              </DialogTitle>
              <DialogDescription>
                Upload a CSV file containing alumni data. The file should include columns for name, email, graduation year, course, and phone.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* File Upload Area */}
              <div className="space-y-2">
                <Label htmlFor="csv-file">CSV File</Label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-card-border/50 hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {selectedFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-foreground font-medium mb-2">
                        Drop your CSV file here, or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports CSV files up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* CSV Format Info */}
              <div className="bg-accent/20 border border-accent/30 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Expected CSV Format:</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Your CSV file should include the following columns:
                </p>
                <code className="text-xs bg-background/50 p-2 rounded block">
                  name, email, graduationYear, course, phone
                </code>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={uploadCSVMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploadCSVMutation.isPending}
                className="gradient-primary text-primary-foreground"
              >
                {uploadCSVMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CSV
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
        <Card className="bento-card gradient-subtle border-card-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Alumni
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {totalAlumni.toLocaleString()}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bento-card gradient-subtle border-card-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Verified
                </p>
                <p className="text-2xl font-bold text-success">
                  {verifiedAlumni.toLocaleString()}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bento-card gradient-subtle border-card-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending
                </p>
                <p className="text-2xl font-bold text-warning">
                  {pendingAlumni.toLocaleString()}
                </p>
              </div>
              <UserX className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bento-card gradient-subtle border-card-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active
                </p>
                <p className="text-2xl font-bold text-primary">
                  {activeAlumni.toLocaleString()}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alumni Table */}
      <Card className="bento-card gradient-surface border-card-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <CardTitle>Alumni Directory</CardTitle>
              <CardDescription>
                Manage and verify alumni profiles ({filteredAlumni.length} of{" "}
                {totalAlumni} alumni)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search alumni..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Status: {selectedStatus === "all" ? "All" : selectedStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedStatus("all")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedStatus("verified")}
                  >
                    Verified
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedStatus("pending")}
                  >
                    Pending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" onClick={() => refetch()}>
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumni</TableHead>
                <TableHead>Graduation</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlumni.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No alumni found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlumni.map((alumni, index) => (
                  <TableRow
                    key={alumni._id}
                    className="hover:bg-accent/30 transition-smooth animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={alumni.avatar} alt={alumni.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {alumni.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "UN"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {alumni.name || "Unknown"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {alumni.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {alumni.graduationYear || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {alumni.course || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{alumni.phone || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(alumni.isVerified || false)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(alumni.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <UserCheck className="h-4 w-4 mr-2" />
                              Edit  
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <UserX className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}