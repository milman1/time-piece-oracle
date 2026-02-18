
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
  // Try the AI Edge Function first
  try {
    const response = await supabase.functions.invoke('parse-watch-search', {
      body: { query }
    });

    if (!response.error && response.data?.filters && Object.keys(response.data.filters).length > 0) {
      return response.data.filters;
    }
  } catch (error) {
    console.warn('AI search unavailable, using local parser:', error);
  }

  // Fallback: local client-side parser (works without OpenAI)
  return parseSearchQueryLocal(query);
};

function parseSearchQueryLocal(query: string): WatchFilters {
  const lower = query.toLowerCase();
  const filters: WatchFilters = {};

  // Brand detection
  const brands: Record<string, string> = {
    'rolex': 'Rolex', 'omega': 'Omega', 'patek philippe': 'Patek Philippe', 'patek': 'Patek Philippe',
    'audemars piguet': 'Audemars Piguet', 'ap': 'Audemars Piguet',
    'tudor': 'Tudor', 'cartier': 'Cartier', 'iwc': 'IWC', 'breitling': 'Breitling',
    'hublot': 'Hublot', 'tag heuer': 'TAG Heuer', 'panerai': 'Panerai',
    'jaeger': 'Jaeger-LeCoultre', 'vacheron': 'Vacheron Constantin',
    'grand seiko': 'Grand Seiko', 'zenith': 'Zenith', 'chopard': 'Chopard',
    'longines': 'Longines', 'tissot': 'Tissot', 'hamilton': 'Hamilton', 'seiko': 'Seiko',
  };
  for (const [key, brand] of Object.entries(brands)) {
    if (lower.includes(key)) { filters.brand = brand; break; }
  }

  // Style detection
  const styles: Record<string, string> = {
    'diver': 'diver', 'diving': 'diver', 'dive': 'diver', 'submariner': 'diver', 'seamaster': 'diver',
    'chronograph': 'chronograph', 'chrono': 'chronograph', 'daytona': 'chronograph', 'speedmaster': 'chronograph',
    'pilot': 'pilot', 'aviation': 'pilot', 'flieger': 'pilot', 'navitimer': 'pilot',
    'dress': 'dress', 'elegant': 'dress', 'formal': 'dress', 'classic': 'dress',
    'sport': 'sport', 'sports': 'sport', 'nautilus': 'sport', 'royal oak': 'sport',
    'field': 'sport', 'daily': 'sport',
  };
  for (const [key, style] of Object.entries(styles)) {
    if (lower.includes(key)) { filters.style = style; break; }
  }

  // Movement detection
  if (lower.includes('automatic') || lower.includes('auto')) filters.movement = 'automatic';
  else if (lower.includes('manual') || lower.includes('hand wound') || lower.includes('hand-wound')) filters.movement = 'manual';
  else if (lower.includes('quartz') || lower.includes('battery')) filters.movement = 'quartz';

  // Strap detection
  if (lower.includes('leather')) filters.strap = 'leather';
  else if (lower.includes('metal') || lower.includes('bracelet') || lower.includes('steel')) filters.strap = 'bracelet';
  else if (lower.includes('rubber') || lower.includes('silicone')) filters.strap = 'rubber';
  else if (lower.includes('nato')) filters.strap = 'nato';

  // Price detection
  const priceMatch = query.match(/(?:under|below|less than|max|up to|<)\s*\$?\s*([\d,]+)/i)
    || query.match(/\$\s*([\d,]+)/i);
  if (priceMatch) {
    filters.max_price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
  }

  return filters;
}

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
    // Sanitize: remove special chars that break Supabase .or() filter syntax
    if (textQuery && textQuery.trim()) {
      const sanitized = textQuery.replace(/[^a-zA-Z0-9\s]/g, '').trim();
      if (sanitized) {
        query = query.or(`brand.ilike.%${sanitized}%,model.ilike.%${sanitized}%,reference.ilike.%${sanitized}%,description.ilike.%${sanitized}%`);
      }
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
