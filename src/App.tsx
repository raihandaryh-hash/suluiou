import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AssessmentProvider } from "@/context/AssessmentContext";
import { captureClassCodeFromUrl } from "@/lib/pendingClassCode";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import Profile from "./pages/Profile";
import Consent from "./pages/Consent";
import Results from "./pages/Results";
import PublicResult from "./pages/PublicResult";
import Suar from "./pages/Suar";
import Insight from "./pages/Insight";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminResultView from "./pages/AdminResultView";
import AdminClasses from "./pages/AdminClasses";
import AdminClassSession from "./pages/AdminClassSession";
import AdminSuar from "./pages/AdminSuar";
import Login from "./pages/Login";
// /join route is legacy and now redirects to /profile — JoinClass page is no longer rendered.
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => {
  // Capture ?kode=ABCD from any landing URL before routes mount.
  useEffect(() => {
    captureClassCodeFromUrl();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AssessmentProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            {/* Legacy /join route — kept as a redirect into the new Step 0 flow. */}
            <Route path="/join" element={<Navigate to="/profile" replace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/consent" element={<Consent />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/results" element={<Results />} />
            <Route path="/suar" element={<Suar />} />
            <Route path="/insight" element={<Insight />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/classes"
              element={
                <ProtectedRoute>
                  <AdminClasses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/class/:classId/session"
              element={
                <ProtectedRoute>
                  <AdminClassSession />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/results/:id"
              element={
                <ProtectedRoute>
                  <AdminResultView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/suar"
              element={
                <ProtectedRoute>
                  <AdminSuar />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AssessmentProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
