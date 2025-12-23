import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ExpenseTracker from "./pages/ExpenseTracker";
import HabitTracker from "./pages/HabitTracker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Use basename only in production (GitHub Pages)
  const basename =
    import.meta.env.MODE === "production" ? "/expense-tracker" : "";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<ExpenseTracker />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<ExpenseTracker />} />
            <Route path="/habits" element={<HabitTracker />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
