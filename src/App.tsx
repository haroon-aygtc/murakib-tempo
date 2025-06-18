import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import LandingPage from "./components/LandingPage";
import AuthLayout from "./components/auth/AuthLayout";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import AssistantManager from "./components/dashboard/AssistantManager";
import WidgetBuilder from "./components/dashboard/WidgetBuilder";
import TutorialBuilder from "./components/dashboard/TutorialBuilder";
import AssistantPreview from "./components/dashboard/AssistantPreview";
import LanguageManager from "./components/dashboard/LanguageManager";
import AIChat from "./components/dashboard/AIChat";
import Analytics from "./components/dashboard/Analytics";
import DeployPage from "./components/dashboard/DeployPage";
import KnowledgeBaseManager from "./components/KnowledgeBaseManager";
import PredefinedChatFlows from "./components/PredefinedChatFlows";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeContext";
import routes from "tempo-routes";

function App() {
  return (
    <ThemeProvider>
      <Suspense
        fallback={
          <div className="min-h-screen gradient-bg flex items-center justify-center">
            <div className="glass-card p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading Murakib...</p>
            </div>
          </div>
        }
      >
        <>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/demo" element={<Home />} />
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<AssistantManager />} />
              <Route path="assistants" element={<AssistantManager />} />
              <Route path="widget-builder" element={<WidgetBuilder />} />
              <Route path="tutorial-builder" element={<TutorialBuilder />} />
              <Route path="preview" element={<AssistantPreview />} />
              <Route path="languages" element={<LanguageManager />} />
              <Route path="chat" element={<AIChat />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="deploy" element={<DeployPage />} />
              <Route path="knowledge" element={<KnowledgeBaseManager />} />
              <Route path="flows" element={<PredefinedChatFlows />} />
            </Route>
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          <Toaster />
        </>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
