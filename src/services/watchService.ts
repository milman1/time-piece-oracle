// src/services/watchService.ts
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

/** Toggle mock vs. live queries */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

/** Domain types aligned with DB columns */
export interface Watch {
  id: number;
  brand: string;
  model: string;
  reference: string;
  price: number;
  original_price?: number | null;
  condition: string;
  seller: string;
  rating?: number | null;
  reviews?: number | null;
  marketplace: string;
  image?: string | null;
  trusted: boolean;
  year?: number | null;
  description?: string | null;
  style?: string | null;
  movement?: string | null;
  strap?: string | null;
  avg_price?: number | null;
  seller_id?: number | null;        // <— number, not string
  affiliate_url?: string | null;
  listing_url?: string | null;
}

/** Filters used by UI */
export type WatchFilters = {
  brand?: string;
  model?: string;
  style?: string;
  movement?: string;
  strap?: string;
  marketplace?: string;
  maxPrice?: number;
};

/** Validation for rows coming from DB */
const watchRow = z.object({
  id: z.number(),
  brand: z.string(),
  model: z.string(),
  reference: z.string(),
  price: z.number(),
  original_price: z.number().nullable().optional(),
  condition: z.string(),
  seller: z.string(),
  rating: z.number().nullable().optional(),
  reviews: z.number().nullable().optional(),
  marketplace: z.string(),
  image: z.string().nullable().optional(),
  trusted: z.boolean().default(false),
  year: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  style: z.string().nullable().optional(),
  movement: z.string().nullable().optional(),
  strap: z.string().nullable().optional(),
  avg_price: z.number().nullable().optional(),
  seller_id: z.number().nullable().optional(),
  affiliate_url: z.string().nullable().optional(),
  listing_url: z.string().nullable().optional(),
});
type WatchRow = z.infer<typeof watchRow>;

/** ---------- MOCK DATA (kept from your current file) ---------- */
const mockWatches: Watch[] = [
  {
    id: 1,
    brand: "Rolex",
    model: "Submariner",
    reference: "126610LN",
    price: 13500,
    original_price: 15000,
    condition: "Excellent",
    seller: "Crown & Caliber",
    rating: 4.8,
    reviews: 1250,
    marketplace: "Crown & Caliber",
    image: null,
    trusted: true,
    year: 2022,
    description: "Black dial Submariner in excellent condition",
    style: "Sport",
    movement: "Automatic",
    strap: "Steel Bracelet",
    avg_price: 14200,
    seller_id: 1,
    affiliate_url: null,
    listing_url: null,
  },
  {
    id: 2,
    brand: "Omega",
    model: "Speedmaster Professional",
    reference: "310.30.42.50.01.001",
    price: 6200,
    original_price: 6800,
    condition: "Very Good",
    seller: "Hodinkee Shop",
    rating: 4.9,
    reviews: 890,
    marketplace: "Hodinkee Shop",
    image: null,
    trusted: true,
    year: 2021,
    description: "Moonwatch with hesalite crystal",
    style: "Sport",
    movement: "Manual",
    strap: "Steel Bracelet",
    avg_price: 6500,
    seller_id: 2,
    affiliate_url: null,
    listing_url: null,
  },
];

/** ---------- Helpers ---------- */

function rowToWatch(r: WatchRow): Watch {
  return {
    id: r.id,
    brand: r.brand,
    model: r.model,
    reference: r.reference,
    price: r.price,
    original_price: r.original_price,
    condition: r.condition,
    seller: r.seller,
    rating: r.rating,
    reviews: r.reviews,
    marketplace: r.marketplace,
    image: r.image,
    trusted: r.trusted,
    year: r.year,
    description: r.description,
    style: r.style,
    movement: r.movement,
    strap: r.strap,
    avg_price: r.avg_price,
    seller_id: r.seller_id,
    affiliate_url: r.affiliate_url,
    listing_url: r.listing_url,
  };
}

export function buildAffiliateLink(w: Watch) {
  // Client-side /go route that ultimately hits your Supabase Edge Function
  const params = new URLSearchParams({
    watch_id: String(w.id),
    seller_id: String(w.seller_id ?? ""),
    utm_source: "tpo",
    utm_medium: "affiliate",
    utm_campaign: "listing",
  });
  return `/go?${params.toString()}`;
}

/** ---------- Public API used by pages ---------- */

export async function getAllWatches(limit = 24, offset = 0): Promise<Watch[]> {
  if (USE_MOCK) return mockWatches.slice(offset, offset + limit);
  const { data, error } = await supabase
    .from("watches")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);
  return (data ?? []).map((d) => rowToWatch(watchRow.parse(d)));
}

export async function searchWatches(
  q: string,
  filters: WatchFilters = {},
  limit = 30,
  offset = 0
): Promise<Watch[]> {
  if (USE_MOCK) {
    const term = q.trim().toLowerCase();
    let list = [...mockWatches];
    if (term) {
      list = list.filter(
        (w) =>
          w.brand.toLowerCase().includes(term) ||
          w.model.toLowerCase().includes(term) ||
          w.reference.toLowerCase().includes(term) ||
          (w.style ?? "").toLowerCase().includes(term) ||
          (w.movement ?? "").toLowerCase().includes(term) ||
          (w.description ?? "").toLowerCase().includes(term)
      );
    }
    if (filters.brand) list = list.filter((w) => w.brand.toLowerCase().includes(filters.brand!.toLowerCase()));
    if (filters.model) list = list.filter((w) => w.model.toLowerCase().includes(filters.model!.toLowerCase()));
    if (filters.marketplace) list = list.filter((w) => w.marketplace === filters.marketplace);
    if (filters.maxPrice) list = list.filter((w) => w.price <= filters.maxPrice!);
    return list.slice(offset, offset + limit);
  }

  let query = supabase.from("watches").select("*");

  if (q?.trim()) {
    const term = q.trim();
    query = query.or(
      `brand.ilike.%${term}%,model.ilike.%${term}%,reference.ilike.%${term}%,style.ilike.%${term}%,movement.ilike.%${term}%,description.ilike.%${term}%`
    );
  }
  if (filters.brand) query = query.ilike("brand", `%${filters.brand}%`);
  if (filters.model) query = query.ilike("model", `%${filters.model}%`);
  if (filters.marketplace) query = query.eq("marketplace", filters.marketplace);
  if (filters.maxPrice) query = query.lte("price", filters.maxPrice);

  const { data, error } = await query
    .order("price", { ascending: true })
    .range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);
  return (data ?? []).map((d) => rowToWatch(watchRow.parse(d)));
}

export async function getWatchByReference(reference: string): Promise<Watch | undefined> {
  if (USE_MOCK) return mockWatches.find((w) => w.reference === reference);
  const { data, error } = await supabase
    .from("watches")
    .select("*")
    .eq("reference", reference)
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToWatch(watchRow.parse(data)) : undefined;
}

/** If you’ll keep `/watch/:model`, expose a model-based getter too */
export async function getWatchByModel(model: string): Promise<Watch | undefined> {
  if (USE_MOCK) return mockWatches.find((w) => w.model.toLowerCase() === model.toLowerCase());
  const { data, error } = await supabase
    .from("watches")
    .select("*")
    .ilike("model", model)
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToWatch(watchRow.parse(data)) : undefined;
}
