
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import PriceAlert from "./pages/PriceAlert";
import ProductDetail from "./pages/ProductDetail";
import LegacyProductRedirect from "./pages/LegacyProductRedirect";
import TrustedSellers from "./pages/TrustedSellers";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import Go from "./pages/Go";
import Auth from "./pages/Auth";
import AffiliatePricing from "./pages/AffiliatePricing";
import SearchAnalytics from "./pages/SearchAnalytics";
import BrowseMarketplace from "./pages/BrowseMarketplace";
import CompareWatches from "./pages/CompareWatches";
import SellerProfile from "./pages/SellerProfile";
import ForSellers from "./pages/ForSellers";
import SellerApplication from "./pages/SellerApplication";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/browse" element={<BrowseMarketplace />} />
            <Route path="/compare" element={<CompareWatches />} />
            <Route path="/for-sellers" element={<ForSellers />} />
            <Route path="/seller-application" element={<SellerApplication />} />
            <Route path="/seller/:id" element={<SellerProfile />} />
            <Route path="/price-alert" element={<PriceAlert />} />
            <Route path="/watch/:brand/:model/:ref" element={<ProductDetail />} />
            <Route path="/watch/:model" element={<LegacyProductRedirect />} />
            <Route path="/trusted-sellers" element={<TrustedSellers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/go" element={<Go />} />
            <Route path="/partners/pricing" element={<AffiliatePricing />} />
            <Route path="/analytics/search" element={<SearchAnalytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
