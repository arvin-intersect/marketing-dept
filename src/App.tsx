import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import AnalyticsPage from "./pages/Analytics";
import AIEmailComposer from "./pages/apps/AIEmailComposer";
import LinkedInProspector from "./pages/apps/LinkedInProspector"; // Import the prospector

const queryClient = new QueryClient();

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Add VITE_CLERK_PUBLISHABLE_KEY to .env.local");
}
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ClerkProviderWithRoutes() {
  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
    >
      <Routes>
        <Route path="/login/*" element={<LoginPage />} />
        
        <Route path="/" element={
          <SignedIn>
            <Navigate to="/dashboard" />
          </SignedIn>
        } />

        <Route
          path="/dashboard"
          element={<SignedIn><Dashboard /></SignedIn>}
        />
        <Route
          path="/analytics"
          element={<SignedIn><AnalyticsPage /></SignedIn>}
        />
        <Route
          path="/app/ai-email-composer"
          element={<SignedIn><AIEmailComposer /></SignedIn>}
        />
        <Route
          path="/app/linkedin-prospector" // Add prospector route
          element={<SignedIn><LinkedInProspector /></SignedIn>}
        />
        
        {/* Simplified catch-all for signed out users */}
        <Route path="*" element={
          <>
            <SignedIn>
              <NotFound />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn redirectUrl="/login" />
            </SignedOut>
          </>
        } />
      </Routes>
    </ClerkProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ClerkProviderWithRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;