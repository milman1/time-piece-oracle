import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ————————————————————————————————————————————————
// Firecrawl SEARCH-based watch scraper v2
//
// Uses Firecrawl's /v1/search endpoint with site-specific queries.
//
// Usage:
//   POST /scrape-watches  { "platform": "chrono24", "query": "rolex submariner" }
//   POST /scrape-watches  { "platform": "all", "query": "omega speedmaster" }
//   POST /scrape-watches  { "batch": true }  ← runs all popular brand queries
// ————————————————————————————————————————————————

const FIRECRAWL_API = 'https://api.firecrawl.dev/v1'

const PLATFORM_SITES: Record<string, string> = {
  chrono24: 'chrono24.com',
  watchbox: 'thewatchbox.com',
  bobs: 'bobswatches.com',
  bezel: 'getbezel.com',
}

const PLATFORM_NAMES: Record<string, string> = {
  chrono24: 'Chrono24',
  watchbox: 'WatchBox',
  bobs: "Bob's Watches",
  bezel: 'Bezel',
}

// Batch mode: scrape these queries across all platforms
const BATCH_QUERIES = [
  'Rolex Submariner',
  'Rolex Daytona',
  'Rolex GMT-Master',
  'Rolex Datejust',
  'Omega Speedmaster',
  'Omega Seamaster',
  'Patek Philippe Nautilus',
  'Audemars Piguet Royal Oak',
  'Tudor Black Bay',
  'Cartier Santos',
  'IWC Portugieser',
  'Breitling Navitimer',
]

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

    const body = await req.json().catch(() => ({}))
    const { platform = 'all', query = 'luxury watch', batch = false } = body

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Batch mode: run all popular brand queries across all platforms
    if (batch) {
      const allPlatforms = Object.keys(PLATFORM_SITES)
      const batchResults: Record<string, { total_scraped: number; total_saved: number; errors: string[] }> = {}

      for (const p of allPlatforms) {
        batchResults[p] = { total_scraped: 0, total_saved: 0, errors: [] }
      }

      // Process queries sequentially to avoid rate limits
      for (const q of BATCH_QUERIES) {
        const searchPromises = allPlatforms.map(p => searchPlatform(p, q, apiKey))
        const searchResults = await Promise.all(searchPromises)

        for (let i = 0; i < allPlatforms.length; i++) {
          const p = allPlatforms[i]
          const { listings, errors } = searchResults[i]
          batchResults[p].total_scraped += listings.length
          batchResults[p].errors.push(...errors)

          if (listings.length > 0) {
            const { error: insertError } = await supabase
              .from('watches')
              .upsert(listings, { onConflict: 'reference,marketplace,seller', ignoreDuplicates: false })

            if (insertError) {
              batchResults[p].errors.push(`DB upsert error for "${q}": ${insertError.message}`)
            } else {
              batchResults[p].total_saved += listings.length
            }
          }
        }

        // Small delay between batch queries to respect rate limits
        await new Promise(r => setTimeout(r, 1000))
      }

      return new Response(
        JSON.stringify({
          success: true,
          mode: 'batch',
          queries: BATCH_QUERIES,
          results: batchResults,
          timestamp: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Single query mode
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
          .upsert(listings, { onConflict: 'reference,marketplace,seller', ignoreDuplicates: false })

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
        limit: 30,
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
  const metadata = result.metadata || {}

  const price = extractPrice(title + ' ' + markdown)
  if (!price) return null

  const brand = parseBrandFromTitle(title)
  if (brand === 'Unknown') return null // Skip non-watch results

  const model = parseModelFromTitle(title, brand)
  const reference = extractReference(title + ' ' + markdown)

  // Extract image from metadata or markdown
  const image = extractImage(metadata, markdown)

  // Generate a stable unique reference for dedup
  // Use actual reference if found, otherwise hash from URL
  const stableRef = reference || hashUrl(url)

  // Extract seller name (more specific than just the platform)
  const seller = extractSeller(markdown, platformName)

  return {
    brand,
    model,
    reference: stableRef,
    price: Math.round(price),
    original_price: null,
    condition: extractCondition(title + ' ' + markdown),
    seller,
    rating: null,
    reviews: null,
    marketplace: platformName,
    image,
    trusted: true,
    year: extractYear(title + ' ' + markdown),
    description: title.substring(0, 500),
    style: null,
    movement: extractMovement(title + ' ' + markdown),
    strap: null,
    avg_price: null,
    seller_id: null,
    affiliate_url: url, // Skimlinks will auto-convert this
    listing_url: url,
    scraped_at: new Date().toISOString(),
  }
}

// ——— Image extraction ———

function extractImage(metadata: any, markdown: string): string | null {
  // 1. Check OG image from metadata
  if (metadata?.ogImage) return metadata.ogImage
  if (metadata?.['og:image']) return metadata['og:image']
  if (metadata?.image) return metadata.image

  // 2. Extract first image from markdown
  const imgMatch = markdown.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/)
  if (imgMatch) return imgMatch[1]

  // 3. Look for image URLs in the text
  const urlMatch = markdown.match(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/i)
  if (urlMatch) return urlMatch[1]

  return null
}

// ——— Seller extraction ———

function extractSeller(markdown: string, platformName: string): string {
  // Try to find seller name patterns in markdown
  const sellerPatterns = [
    /(?:sold by|seller|dealer|offered by)[:\s]*([A-Za-z0-9\s&'.]+)/i,
    /(?:from|by)\s+([A-Z][A-Za-z0-9\s&'.]+?)(?:\s*[·|\-,])/,
  ]
  for (const p of sellerPatterns) {
    const m = markdown.match(p)
    if (m && m[1].trim().length > 2 && m[1].trim().length < 50) {
      return m[1].trim()
    }
  }
  return platformName
}

// ——— Movement extraction ———

function extractMovement(text: string): string | null {
  const lower = text.toLowerCase()
  if (lower.includes('automatic')) return 'Automatic'
  if (lower.includes('manual') || lower.includes('hand-wound') || lower.includes('hand wound')) return 'Manual'
  if (lower.includes('quartz')) return 'Quartz'
  if (lower.includes('spring drive')) return 'Spring Drive'
  return null
}

// ——— URL hash for stable reference generation ———

function hashUrl(url: string): string {
  let hash = 0
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return `FC-${Math.abs(hash).toString(36).toUpperCase()}`
}

// ——— Extraction helpers ———

function extractPrice(text: string): number | null {
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
      if (val >= 100 && val <= 5_000_000) return val
    }
  }
  return null
}

function extractReference(text: string): string {
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
    'Hamilton', 'Longines', 'Bell & Ross', 'Girard-Perregaux',
  ]
  for (const b of brands) {
    if (title.toLowerCase().includes(b.toLowerCase())) return b
  }
  return 'Unknown'
}

function parseModelFromTitle(title: string, brand: string): string {
  const cleaned = title.replace(new RegExp(brand, 'i'), '').trim()
  const parts = cleaned.split(/[\s,–\-|]+/).filter(Boolean)
  return parts.slice(0, 5).join(' ').substring(0, 60) || title.substring(0, 60)
}
