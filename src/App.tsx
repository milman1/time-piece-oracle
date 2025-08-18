
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PriceAlert from "./pages/PriceAlert";
import ProductDetail from "./pages/ProductDetail";
import TrustedSellers from "./pages/TrustedSellers";
import Blog from "./pages/Blog";
import Go from "./pages/Go";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/price-alert" element={<PriceAlert />} />
          <Route path="/watch/:model" element={<ProductDetail />} />
          <Route path="/trusted-sellers" element={<TrustedSellers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/go" element={<Go />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
