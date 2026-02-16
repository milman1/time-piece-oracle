import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ————————————————————————————————————————————————
// Firecrawl SEARCH-based watch scraper
//
// Uses Firecrawl's /v1/search endpoint with site-specific queries
// for fast, reliable results (2-5s per platform vs 30-60s+ for scrape).
//
// Usage:
//   POST /scrape-watches  { "platform": "chrono24", "query": "rolex submariner" }
//   POST /scrape-watches  { "platform": "all", "query": "omega speedmaster" }
// ————————————————————————————————————————————————

const FIRECRAWL_API = 'https://api.firecrawl.dev/v1'

// Site domains for search queries
const PLATFORM_SITES: Record<string, string> = {
  chrono24: 'chrono24.com',
  stockx: 'stockx.com',
  bobs: 'bobswatches.com',
  bezel: 'getbezel.com',
}

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
        JSON.stringify({ error: 'FIRECRAWL_API_KEY not set.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()
    const { platform = 'all', query = 'luxury watch' } = body

    const platforms = platform === 'all'
      ? Object.keys(PLATFORM_SITES)
      : [platform]

    const invalidPlatform = platforms.find(p => !PLATFORM_SITES[p])
    if (invalidPlatform) {
      return new Response(
        JSON.stringify({ error: `Unknown platform: ${invalidPlatform}`, available: Object.keys(PLATFORM_SITES) }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Search all platforms in parallel
    const searchPromises = platforms.map(p => searchPlatform(p, query, apiKey))
    const searchResults = await Promise.all(searchPromises)

    const results: Record<string, { scraped: number; saved: number; errors: string[] }> = {}

    for (let i = 0; i < platforms.length; i++) {
      const p = platforms[i]
      const { listings, errors } = searchResults[i]
      results[p] = { scraped: listings.length, saved: 0, errors }

      if (listings.length > 0) {
        const { error: insertError } = await supabase
          .from('watches')
          .upsert(listings, { onConflict: 'reference', ignoreDuplicates: true })

        if (insertError) {
          results[p].errors.push(`DB upsert error: ${insertError.message}`)
        } else {
          results[p].saved = listings.length
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, query, results, timestamp: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    console.error('Scraper error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// ——— Search a single platform using Firecrawl search ———

async function searchPlatform(
  platform: string,
  query: string,
  apiKey: string
): Promise<{ listings: any[]; errors: string[] }> {
  const site = PLATFORM_SITES[platform]
  const platformName = PLATFORM_NAMES[platform] || platform
  const errors: string[] = []

  try {
    const searchQuery = `${query} site:${site}`
    console.log(`Searching ${platformName}: "${searchQuery}"`)

    const response = await fetch(`${FIRECRAWL_API}/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 20,
        scrapeOptions: { formats: ['markdown'] },
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      errors.push(`Firecrawl search error (${response.status}): ${errText}`)
      return { listings: [], errors }
    }

    const data = await response.json()
    const results = data?.data || []

    if (results.length === 0) {
      errors.push('No search results returned')
      return { listings: [], errors }
    }

    // Parse search results into watch listings
    const listings = results
      .map((result: any) => parseSearchResult(result, platformName))
      .filter((w: any) => w !== null && w.price > 100)

    console.log(`${platformName}: ${results.length} results → ${listings.length} valid listings`)
    return { listings, errors }
  } catch (err: unknown) {
    errors.push(`Search failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    return { listings: [], errors }
  }
}

// ——— Parse a Firecrawl search result into a watch record ———

function parseSearchResult(result: any, platformName: string): any | null {
  const title = result.title || ''
  const markdown = result.markdown || ''
  const url = result.url || ''

  // Extract price from title or markdown
  const price = extractPrice(title + ' ' + markdown)
  if (!price) return null

  const brand = parseBrandFromTitle(title)
  const model = parseModelFromTitle(title, brand)
  const reference = extractReference(title + ' ' + markdown)

  return {
    brand,
    model,
    reference: reference || '',
    price: Math.round(price),
    original_price: null,
    condition: extractCondition(title + ' ' + markdown),
    seller: platformName,
    rating: null,
    reviews: null,
    marketplace: platformName,
    image: null,
    trusted: true,
    year: extractYear(title + ' ' + markdown),
    description: title.substring(0, 500),
    style: null,
    movement: null,
    strap: null,
    avg_price: null,
    seller_id: null,
    affiliate_url: url,
  }
}

// ——— Extraction helpers ———

function extractPrice(text: string): number | null {
  // Match common price patterns: $12,345 | USD 12345 | 12.345 € | £12,345
  const patterns = [
    /\$\s?([\d,]+(?:\.\d{2})?)/,
    /USD\s?([\d,]+(?:\.\d{2})?)/i,
    /(?:€|EUR)\s?([\d.,]+)/i,
    /([\d.,]+)\s?(?:€|EUR)/i,
    /£\s?([\d,]+(?:\.\d{2})?)/,
    /(?:price|asking)[:\s]*\$?([\d,]+)/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const numStr = match[1].replace(/,/g, '')
      const val = parseFloat(numStr)
      // Reasonable watch price range
      if (val >= 100 && val <= 5_000_000) return val
    }
  }
  return null
}

function extractReference(text: string): string {
  // Common ref patterns: 126610LN, 310.30.42.50.01.001, 5711/1A
  const patterns = [
    /\b(\d{3,6}[A-Z]{0,4}(?:\/\d{1,2}[A-Z]?)?)\b/,
    /\b(\d{3}\.\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{3})\b/, // Omega style
    /\b(ref\.?\s*#?\s*[\w\d\-/.]+)/i,
  ]
  for (const p of patterns) {
    const m = text.match(p)
    if (m) return m[1].replace(/^ref\.?\s*#?\s*/i, '').trim()
  }
  return ''
}

function extractCondition(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes('unworn') || lower.includes('new with')) return 'Unworn'
  if (lower.includes('new')) return 'New'
  if (lower.includes('excellent')) return 'Excellent'
  if (lower.includes('very good')) return 'Very Good'
  if (lower.includes('good')) return 'Good'
  if (lower.includes('fair')) return 'Fair'
  return 'Pre-owned'
}

function extractYear(text: string): number | null {
  const match = text.match(/\b(19[5-9]\d|20[0-2]\d)\b/)
  return match ? parseInt(match[1]) : null
}

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

function parseModelFromTitle(title: string, brand: string): string {
  // Remove brand from title and take meaningful words
  const cleaned = title.replace(new RegExp(brand, 'i'), '').trim()
  const parts = cleaned.split(/[\s,–\-|]+/).filter(Boolean)
  return parts.slice(0, 5).join(' ').substring(0, 60) || title.substring(0, 60)
}
