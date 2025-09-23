import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Alumni } from "./pages/Alumni";
import { Events } from "./pages/Events";
import { Jobs } from "./pages/Jobs";
import { Donations } from "./pages/Donations";
import { Analytics } from "./pages/Analytics";
import { Communications } from "./pages/Communications";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { Login } from "./pages/auth/Login";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { OTPVerification } from "./pages/auth/OTPVerification";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/otp-verification" element={<OTPVerification />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="alumni" element={<Alumni />} />
              <Route path="events" element={<Events />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="donations" element={<Donations />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="communications" element={<Communications />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;
