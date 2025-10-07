import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import AnalyticsPage from "./pages/Analytics"; // Import the new page

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
          <>
            <SignedIn>
              <Navigate to="/dashboard" />
            </SignedIn>
            <SignedOut>
              <Navigate to="/login" />
            </SignedOut>
          </>
        } />

        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <Dashboard />
            </SignedIn>
          }
        />
        {/* Add the new protected route for Analytics */}
        <Route
          path="/analytics"
          element={
            <SignedIn>
              <AnalyticsPage />
            </SignedIn>
          }
        />
        {/* Catch-all for signed-out users trying to access protected routes */}
        <Route path="/*" element={
          <SignedOut>
            <RedirectToSignIn redirectUrl="/login" />
          </SignedOut>
        } />
        
        <Route path="*" element={<NotFound />} />
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