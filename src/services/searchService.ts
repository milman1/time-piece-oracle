
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
    // Use raw SQL query since the watches table isn't in the generated types yet
    let sql = `
      SELECT 
        id,
        brand,
        model,
        reference,
        price,
        original_price as "originalPrice",
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
        strap
      FROM watches
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    // Apply filters using parameterized queries to prevent SQL injection
    if (filters.brand) {
      sql += ` AND brand ILIKE $${paramIndex}`;
      params.push(`%${filters.brand}%`);
      paramIndex++;
    }

    if (filters.style) {
      sql += ` AND style ILIKE $${paramIndex}`;
      params.push(`%${filters.style}%`);
      paramIndex++;
    }

    if (filters.movement) {
      sql += ` AND movement ILIKE $${paramIndex}`;
      params.push(`%${filters.movement}%`);
      paramIndex++;
    }

    if (filters.strap) {
      sql += ` AND strap ILIKE $${paramIndex}`;
      params.push(`%${filters.strap}%`);
      paramIndex++;
    }

    if (filters.max_price) {
      sql += ` AND price <= $${paramIndex}`;
      params.push(filters.max_price);
      paramIndex++;
    }

    // If there's still a text query, apply it as a general search
    if (textQuery && textQuery.trim()) {
      sql += ` AND (
        brand ILIKE $${paramIndex} OR 
        model ILIKE $${paramIndex} OR 
        reference ILIKE $${paramIndex} OR 
        description ILIKE $${paramIndex}
      )`;
      params.push(`%${textQuery}%`);
      paramIndex++;
    }

    sql += ` ORDER BY created_at DESC LIMIT 50`;

    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: sql,
      params: params
    });

    if (error) {
      console.error('Error searching watches:', error);
      // Fallback to a simpler query if the RPC doesn't work
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('watches')
        .select('*')
        .limit(50);
      
      if (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
        return [];
      }
      
      // Transform the data to match our Watch interface
      return (fallbackData || []).map((watch: any) => ({
        ...watch,
        originalPrice: watch.original_price
      }));
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchWatchesWithFilters:', error);
    return [];
  }
};
