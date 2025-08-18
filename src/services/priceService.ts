import { supabase } from "@/integrations/supabase/client";

export type PricePoint = {
  collected_at: string;
  price: number;
};

export async function fetchPriceHistory(watchId: number, days: number = 180): Promise<PricePoint[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  
  const { data, error } = await supabase
    .from("watch_prices")
    .select("collected_at, price")
    .eq("watch_id", watchId)
    .gte("collected_at", since.toISOString())
    .order("collected_at", { ascending: true });
    
  if (error) throw new Error(error.message);
  
  return (data || []).map(d => ({ 
    collected_at: d.collected_at as string, 
    price: Number(d.price) 
  }));
}