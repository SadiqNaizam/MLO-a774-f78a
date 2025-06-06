import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner"; // Assuming Sonner is for different types of toasts
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import Pages
import DashboardPage from "./pages/DashboardPage";
import AccountDetailsPage from "./pages/AccountDetailsPage";
import JointAccountSetupFlowPage from "./pages/JointAccountSetupFlowPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import PaymentInitiationPage from "./pages/PaymentInitiationPage";
import NotFound from "./pages/NotFound"; // Assuming NotFound.tsx exists

const queryClient = new QueryClient();

// Placeholder for a simple auth check or initial page logic
// In a real app, this would involve checking auth status
const isAuthenticated = true; // Simulate authenticated user

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Redirect to dashboard if authenticated, otherwise to a login page (not implemented here) */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login-placeholder" replace />} />
          
          {/* Authenticated Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/account-details/:accountId" element={<AccountDetailsPage />} />
          <Route path="/joint-account-setup" element={<JointAccountSetupFlowPage />} />
          <Route path="/transaction-history" element={<TransactionHistoryPage />} />
          <Route path="/payment" element={<PaymentInitiationPage />} />
          
          {/* Placeholder for other routes like /transfer, /settings, /profile */}
          <Route path="/transfer" element={<div>Transfer Page Placeholder - <Link to="/dashboard">Go to Dashboard</Link></div>} />
          <Route path="/settings" element={<div>Settings Page Placeholder - <Link to="/dashboard">Go to Dashboard</Link></div>} />
          <Route path="/profile" element={<div>Profile Page Placeholder - <Link to="/dashboard">Go to Dashboard</Link></div>} />
          <Route path="/accounts" element={<div>Accounts List Placeholder (Covered by Dashboard Account Cards) - <Link to="/dashboard">Go to Dashboard</Link></div>} />


          {/* Placeholder for a login page if needed for the redirect */}
          <Route path="/login-placeholder" element={<div>Login Page Placeholder - <Link to="/dashboard">Simulate Login & Go to Dashboard</Link></div>} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} /> {/* Always Include This Line As It Is. */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Minimal Link component for placeholders if not importing from react-router-dom directly in App.tsx
// Usually, App.tsx only defines routes, and navigation Links are in components/pages.
const Link = ({ to, children }: { to: string, children: React.ReactNode }) => <a href={to}>{children}</a>;


export default App;