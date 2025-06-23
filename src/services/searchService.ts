
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

export const searchWatchesWithFilters = async (filters: WatchFilters, textQuery?: string): Promise<Watch[]> => {
  try {
    let query = supabase
      .from('watches')
      .select('*')
      .order('created_at', { ascending: false });

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
      query = query.or(
        `brand.ilike.%${textQuery}%,model.ilike.%${textQuery}%,reference.ilike.%${textQuery}%,description.ilike.%${textQuery}%`
      );
    }

    const { data, error } = await query.limit(50);

    if (error) {
      console.error('Error searching watches:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchWatchesWithFilters:', error);
    return [];
  }
};
