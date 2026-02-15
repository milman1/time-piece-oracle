import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ————————————————————————————————————————————————
// Firecrawl-powered watch scraper
//
// Scrapes watch listings from Chrono24, StockX, Bob's Watches, and Bezel.
// Results are upserted into the Supabase `watches` table.
//
// Required Supabase secrets:
//   FIRECRAWL_API_KEY — from https://firecrawl.dev/dashboard
//
// Usage:
//   POST /scrape-watches  { "platform": "chrono24", "query": "rolex submariner" }
//   POST /scrape-watches  { "platform": "all", "query": "omega speedmaster" }
//
// Designed to be triggered:
//   • Manually (for testing)
//   • Via Supabase cron (pg_cron) for scheduled daily scrapes
//   • From an admin dashboard
// ————————————————————————————————————————————————

const FIRECRAWL_API = 'https://api.firecrawl.dev/v1'

// Platform URL builders
const PLATFORM_URLS: Record<string, (query: string) => string> = {
    chrono24: (q) => `https://www.chrono24.com/search/index.htm?query=${encodeURIComponent(q)}&dosearch=true&searchexplain=1&sortorder=1`,
    stockx: (q) => `https://stockx.com/search?s=${encodeURIComponent(q)}&category=watches`,
    bobs: (q) => `https://www.bobswatches.com/luxury-watches?q=${encodeURIComponent(q)}`,
    bezel: (q) => `https://shop.getbezel.com/search?q=${encodeURIComponent(q)}`,
}

// Extraction schema for Firecrawl — tells it what to pull from each page
const WATCH_EXTRACTION_SCHEMA = {
    type: 'object',
    properties: {
        listings: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    title: { type: 'string', description: 'Full listing title including brand, model, reference' },
                    price: { type: 'number', description: 'Price in USD (numeric, no currency symbol)' },
                    currency: { type: 'string', description: 'Currency code like USD, EUR' },
                    condition: { type: 'string', description: 'Watch condition: New, Pre-owned, Unworn, etc.' },
                    seller_name: { type: 'string', description: 'Seller or dealer name' },
                    listing_url: { type: 'string', description: 'Direct URL to this listing' },
                    image_url: { type: 'string', description: 'Main product image URL' },
                    brand: { type: 'string', description: 'Watch brand: Rolex, Omega, etc.' },
                    model: { type: 'string', description: 'Watch model: Submariner, Speedmaster, etc.' },
                    reference: { type: 'string', description: 'Reference number like 126610LN' },
                    year: { type: 'number', description: 'Year of manufacture if mentioned' },
                },
                required: ['title', 'price', 'listing_url'],
            },
        },
    },
    required: ['listings'],
}

// Platform display names
const PLATFORM_NAMES: Record<string, string> = {
    chrono24: 'Chrono24',
    stockx: 'StockX',
    bobs: "Bob's Watches",
    bezel: 'Bezel',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const apiKey = Deno.env.get('FIRECRAWL_API_KEY')
        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: 'FIRECRAWL_API_KEY not set. Add it in Supabase Edge Function secrets.' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const body = await req.json()
        const { platform = 'all', query = 'luxury watch' } = body

        // Determine which platforms to scrape
        const platforms = platform === 'all'
            ? Object.keys(PLATFORM_URLS)
            : [platform]

        const invalidPlatform = platforms.find(p => !PLATFORM_URLS[p])
        if (invalidPlatform) {
            return new Response(
                JSON.stringify({
                    error: `Unknown platform: ${invalidPlatform}`,
                    available: Object.keys(PLATFORM_URLS),
                }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Initialize Supabase
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const results: Record<string, { scraped: number; saved: number; errors: string[] }> = {}

        // Scrape each platform
        for (const p of platforms) {
            const url = PLATFORM_URLS[p](query)
            const platformName = PLATFORM_NAMES[p] || p

            results[p] = { scraped: 0, saved: 0, errors: [] }

            try {
                console.log(`Scraping ${platformName}: ${url}`)

                // Call Firecrawl extract API
                const scrapeResponse = await fetch(`${FIRECRAWL_API}/scrape`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        url,
                        formats: ['extract'],
                        extract: {
                            schema: WATCH_EXTRACTION_SCHEMA,
                            prompt: `Extract all watch listings from this page. For each listing, get the title, price (as a number in USD), condition, seller name, listing URL, image URL, brand, model, and reference number. If the price is in EUR, convert approximately to USD (multiply by 1.08).`,
                        },
                        waitFor: 3000, // Wait for JS to render
                        timeout: 30000,
                    }),
                })

                if (!scrapeResponse.ok) {
                    const errText = await scrapeResponse.text()
                    results[p].errors.push(`Firecrawl API error (${scrapeResponse.status}): ${errText}`)
                    continue
                }

                const scrapeData = await scrapeResponse.json()
                const listings = scrapeData?.data?.extract?.listings || []
                results[p].scraped = listings.length

                if (listings.length === 0) {
                    results[p].errors.push('No listings extracted — page may have changed or blocked scraper')
                    continue
                }

                // Transform and upsert into Supabase
                const watches = listings
                    .filter((l: any) => l.price && l.price > 100) // Filter out junk
                    .map((listing: any, idx: number) => ({
                        // Generate a stable ID from platform + listing URL hash
                        brand: listing.brand || parseBrandFromTitle(listing.title),
                        model: listing.model || parseModelFromTitle(listing.title),
                        reference: listing.reference || '',
                        price: Math.round(listing.price),
                        original_price: null,
                        condition: listing.condition || 'Pre-owned',
                        seller: listing.seller_name || platformName,
                        rating: null,
                        reviews: null,
                        marketplace: platformName,
                        image: listing.image_url || null,
                        trusted: true,
                        year: listing.year || null,
                        description: listing.title,
                        style: null,
                        movement: null,
                        strap: null,
                        avg_price: null,
                        seller_id: null,
                        affiliate_url: listing.listing_url,
                    }))

                // Upsert — insert new listings, update existing ones
                if (watches.length > 0) {
                    const { error: insertError } = await supabase
                        .from('watches')
                        .insert(watches)

                    if (insertError) {
                        results[p].errors.push(`DB insert error: ${insertError.message}`)
                    } else {
                        results[p].saved = watches.length
                    }
                }

            } catch (platformError: any) {
                results[p].errors.push(`Scrape failed: ${platformError.message}`)
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                query,
                results,
                timestamp: new Date().toISOString(),
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error: any) {
        console.error('Scraper error:', error)
        return new Response(
            JSON.stringify({ error: 'Internal server error', message: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})

// ——— Helpers ———

function parseBrandFromTitle(title: string): string {
    const brands = [
        'Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet', 'Tudor', 'IWC', 'Cartier',
        'Breitling', 'Hublot', 'TAG Heuer', 'Panerai', 'Jaeger-LeCoultre', 'Vacheron Constantin',
        'A. Lange & Söhne', 'Grand Seiko', 'Zenith', 'Chopard', 'Seiko', 'Tissot',
    ]
    for (const b of brands) {
        if (title.toLowerCase().includes(b.toLowerCase())) return b
    }
    return 'Unknown'
}

function parseModelFromTitle(title: string): string {
    // Remove brand and take the next meaningful words
    const parts = title.split(/[\s,–-]+/).filter(Boolean)
    return parts.slice(0, 5).join(' ').substring(0, 60)
}
