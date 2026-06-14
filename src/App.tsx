import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import ScrollToTop from "@/components/ScrollToTop";
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
import SkillMap from "./pages/SkillMap";
import Compass from "./pages/Compass";
import Programs from "./pages/Programs";
import KenaliDirimu from "./pages/KenaliDirimu";
import KenaliDirimuSkill from "./pages/KenaliDirimuSkill";
import JalanBakti from "./pages/JalanBakti";
import Sintesis from "./pages/Sintesis";
import RencanaAksi from "./pages/RencanaAksi";
import Ringkasan from "./pages/Ringkasan";
import AppLayout from "./components/AppLayout";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminResultView from "./pages/AdminResultView";
import AdminClasses from "./pages/AdminClasses";
import AdminClassSession from "./pages/AdminClassSession";
import AdminSuar from "./pages/AdminSuar";
import AdminInsight from "./pages/AdminInsight";
import Login from "./pages/Login";
// /join route is legacy and now redirects to /profile — JoinClass page is no longer rendered.
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import RequireAuth from "@/components/RequireAuth";
import SpineBLayout from "@/components/SpineBLayout";
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
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            {/* Legacy /join route — kept as a redirect into the new Step 0 flow. */}
            <Route path="/join" element={<Navigate to="/profile" replace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/consent" element={<Consent />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/results" element={<Results />} />
            <Route path="/hasil/:resultId" element={<PublicResult />} />
            <Route path="/suar" element={<Suar />} />
            <Route element={<AppLayout />}>
              <Route path="/insight" element={<Insight />} />
              <Route path="/skill-map" element={<SkillMap />} />
              <Route path="/compass" element={<Compass />} />
            </Route>
            <Route path="/programs" element={<Programs />} />
            <Route element={<SpineBLayout />}>
              <Route path="/kenali-dirimu" element={<KenaliDirimu />} />
              <Route path="/kenali-dirimu/skill" element={<KenaliDirimuSkill />} />
              <Route path="/jalan-bakti" element={<JalanBakti />} />
              <Route path="/sintesis" element={<Sintesis />} />
              <Route path="/rencana-aksi" element={<RencanaAksi />} />
              <Route path="/ringkasan" element={<Ringkasan />} />
            </Route>
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
            <Route
              path="/admin/insight"
              element={
                <ProtectedRoute>
                  <AdminInsight />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
