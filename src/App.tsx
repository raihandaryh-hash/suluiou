import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { keselamatanContent } from "@/data/keselamatanContent";
import ScrollToTop from "@/components/ScrollToTop";
import { AssessmentProvider } from "@/context/AssessmentContext";
import { captureClassCodeFromUrl } from "@/lib/pendingClassCode";
import Index from "./pages/Index";
import Mukadimah from "./pages/Mukadimah";
import BilaTidakBaikBaikSaja from "./pages/BilaTidakBaikBaikSaja";
import AppLayout from "./components/AppLayout";
// /join route is legacy and now redirects to /profile — JoinClass page is no longer rendered.
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import RequireAuth from "@/components/RequireAuth";
import SpineBLayout from "@/components/SpineBLayout";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import { ASESMEN_TERBUKA, HASIL_PUBLIK_TERBUKA, SPINE_B_AWAL } from "@/data/flags";

// Pecah per halaman (24 Nov 2026): halaman awal, krisis, dan 404 tetap dimuat langsung;
// halaman lain diunduh saat pertama dibuka, supaya unduhan awal lebih kecil.
const Assessment = lazy(() => import("./pages/Assessment"));
const Profile = lazy(() => import("./pages/Profile"));
const Consent = lazy(() => import("./pages/Consent"));
const Results = lazy(() => import("./pages/Results"));
const PublicResult = lazy(() => import("./pages/PublicResult"));
const Suar = lazy(() => import("./pages/Suar"));
const Insight = lazy(() => import("./pages/Insight"));
const SkillMap = lazy(() => import("./pages/SkillMap"));
const Glossary = lazy(() => import("./pages/Glossary"));
const Compass = lazy(() => import("./pages/Compass"));
const Programs = lazy(() => import("./pages/Programs"));
const KenaliDirimu = lazy(() => import("./pages/KenaliDirimu"));
const KenaliDirimuSkill = lazy(() => import("./pages/KenaliDirimuSkill"));
const JalanBakti = lazy(() => import("./pages/JalanBakti"));
const Sintesis = lazy(() => import("./pages/Sintesis"));
const RencanaAksi = lazy(() => import("./pages/RencanaAksi"));
const Ringkasan = lazy(() => import("./pages/Ringkasan"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminResultView = lazy(() => import("./pages/AdminResultView"));
const AdminClasses = lazy(() => import("./pages/AdminClasses"));
const AdminClassSession = lazy(() => import("./pages/AdminClassSession"));
const AdminSuar = lazy(() => import("./pages/AdminSuar"));
const AdminInsight = lazy(() => import("./pages/AdminInsight"));
const AdminBridge = lazy(() => import("./pages/AdminBridge"));
const Login = lazy(() => import("./pages/Login"));

const MemuatHalaman = () => (
  <div role="status" className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
    <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
    {keselamatanContent.memuatHalaman}
  </div>
);

// A7: guard tingkat rute untuk pintu asesmen. Flag mati = dialihkan ke awal Spine B.
const AsesmenGuard = ({ children }: { children: JSX.Element }) =>
  ASESMEN_TERBUKA ? children : <Navigate to={SPINE_B_AWAL} replace />;

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
          <Suspense fallback={<MemuatHalaman />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mukadimah" element={<Mukadimah />} />
            <Route path="/login" element={<Login />} />
            {/* Legacy /join route — kept as a redirect into the new Step 0 flow. */}
            <Route path="/join" element={<Navigate to={ASESMEN_TERBUKA ? "/profile" : SPINE_B_AWAL} replace />} />
            <Route path="/profile" element={<AsesmenGuard><Profile /></AsesmenGuard>} />
            <Route path="/consent" element={<AsesmenGuard><Consent /></AsesmenGuard>} />
            <Route path="/assessment" element={<AsesmenGuard><Assessment /></AsesmenGuard>} />
            <Route path="/results" element={<Results />} />
            <Route path="/hasil/:resultId" element={<PublicResult />} />
            <Route path="/suar" element={<Suar />} />
            {/* B10: halaman publik penjelasan cabang distress (teks DRAF) */}
            <Route path="/bila-tidak-baik-baik-saja" element={<BilaTidakBaikBaikSaja />} />
            <Route element={<AppLayout />}>
              <Route path="/insight" element={<Insight />} />
              <Route path="/skill-map" element={<SkillMap />} />
              <Route path="/glossary" element={<Glossary />} />
              <Route path="/data" element={<Navigate to="/glossary?tab=data" replace />} />
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
            <Route
              path="/admin/bridge"
              element={
                <ProtectedRoute>
                  <AdminBridge />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          <Footer />
        </BrowserRouter>
      </AssessmentProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
