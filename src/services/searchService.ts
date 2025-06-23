
import { supabase } from '@/integrations/supabase/client';

export interface WatchFilters {
  brand?: string;
  style?: string;
  movement?: string;
  strap?: string;
  max_price?: number;
}

export interface Watch {
  id: number;
  brand: string;
  model: string;
  reference: string;
  price: number;
  originalPrice?: number;
  condition: string;
  seller: string;
  rating: number;
  reviews: number;
  marketplace: string;
  image: string;
  trusted: boolean;
  year: number;
  description?: string;
  style?: string;
  movement?: string;
  strap?: string;
}

export interface WatchRecommendation {
  brand: string;
  model: string;
  style: string;
  reason: string;
}

export const parseSearchQuery = async (query: string): Promise<WatchFilters> => {
  try {
    const response = await supabase.functions.invoke('parse-watch-search', {
      body: { query }
    });

    if (response.error) {
      console.error('Error parsing search query:', response.error);
      return {};
    }

    return response.data?.filters || {};
  } catch (error) {
    console.error('Error calling parse-watch-search function:', error);
    return {};
  }
};

export const getWatchRecommendations = async (originalQuery: string, filters: WatchFilters): Promise<WatchRecommendation[]> => {
  try {
    const response = await supabase.functions.invoke('get-watch-recommendations', {
      body: { 
        originalQuery,
        filters 
      }
    });

    if (response.error) {
      console.error('Error getting watch recommendations:', response.error);
      // Return fallback recommendations
      return getFallbackRecommendations(filters);
    }

    return response.data?.recommendations || getFallbackRecommendations(filters);
  } catch (error) {
    console.error('Error calling get-watch-recommendations function:', error);
    return getFallbackRecommendations(filters);
  }
};

const getFallbackRecommendations = (filters: WatchFilters): WatchRecommendation[] => {
  const fallbacks = [
    {
      brand: "Seiko",
      model: "Prospex",
      style: "diver",
      reason: "Affordable dive watch with excellent build quality"
    },
    {
      brand: "Citizen",
      model: "Eco-Drive",
      style: "dress",
      reason: "Solar-powered dress watch with classic styling"
    },
    {
      brand: "Orient",
      model: "Bambino",
      style: "dress",
      reason: "Elegant automatic dress watch at a great value"
    },
    {
      brand: "Casio",
      model: "G-Shock",
      style: "sport",
      reason: "Durable sports watch for active lifestyles"
    },
    {
      brand: "Hamilton",
      model: "Khaki Field",
      style: "pilot",
      reason: "Military-inspired field watch with Swiss movement"
    }
  ];

  // If user searched for a specific style, prioritize that
  if (filters.style) {
    return fallbacks.filter(rec => rec.style === filters.style).slice(0, 3);
  }

  // If user searched for a specific brand, suggest similar alternatives
  if (filters.brand) {
    const luxuryBrands = ['rolex', 'omega', 'patek philippe', 'audemars piguet'];
    if (luxuryBrands.some(brand => filters.brand?.toLowerCase().includes(brand))) {
      return [
        {
          brand: "Tudor",
          model: "Black Bay",
          style: "diver",
          reason: "Rolex's sister brand offering similar quality at lower prices"
        },
        {
          brand: "Longines",
          model: "Heritage",
          style: "dress",
          reason: "Swiss luxury with excellent heritage and craftsmanship"
        },
        {
          brand: "Frederique Constant",
          model: "Classics",
          style: "dress",
          reason: "Affordable luxury with in-house movements"
        }
      ];
    }
  }

  return fallbacks.slice(0, 3);
};

export const searchWatchesWithFilters = async (filters: WatchFilters, textQuery?: string): Promise<Watch[]> => {
  try {
    // For now, let's use a simpler approach with the from() method
    let query = supabase
      .from('watches')
      .select(`
        id,
        brand,
        model,
        reference,
        price,
        original_price,
        condition,
        seller,
        rating,
        reviews,
        marketplace,
        image,
        trusted,
        year,
        description,
        style,
        movement,
        strap,
        created_at
      `);

    // Apply filters
    if (filters.brand) {
      query = query.ilike('brand', `%${filters.brand}%`);
    }

    if (filters.style) {
      query = query.ilike('style', `%${filters.style}%`);
    }

    if (filters.movement) {
      query = query.ilike('movement', `%${filters.movement}%`);
    }

    if (filters.strap) {
      query = query.ilike('strap', `%${filters.strap}%`);
    }

    if (filters.max_price) {
      query = query.lte('price', filters.max_price);
    }

    // If there's still a text query, apply it as a general search
    if (textQuery && textQuery.trim()) {
      query = query.or(`brand.ilike.%${textQuery}%,model.ilike.%${textQuery}%,reference.ilike.%${textQuery}%,description.ilike.%${textQuery}%`);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error searching watches:', error);
      return [];
    }

    // Transform the data to match our Watch interface
    return (data || []).map((watch: any) => ({
      ...watch,
      originalPrice: watch.original_price
    }));
  } catch (error) {
    console.error('Error in searchWatchesWithFilters:', error);
    return [];
  }
};
