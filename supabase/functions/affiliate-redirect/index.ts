import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url)
    const watchId = url.searchParams.get('watch_id')
    const sellerId = url.searchParams.get('seller_id') || null
    const utmSource = url.searchParams.get('utm_source')
    const utmMedium = url.searchParams.get('utm_medium')
    const utmCampaign = url.searchParams.get('utm_campaign')

    if (!watchId) {
      return new Response('Missing required parameter: watch_id', {
        status: 400,
        headers: corsHeaders
      })
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get client IP and user agent
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    const referrer = req.headers.get('referer') || 'unknown'

    // Record the affiliate click (seller_id may be null)
    const { error: clickError } = await supabase
      .from('affiliate_clicks')
      .insert({
        watch_id: parseInt(watchId),
        seller_id: sellerId || null,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        ip_address: clientIP,
        user_agent: userAgent,
        referrer: referrer
      })

    if (clickError) {
      console.error('Error recording affiliate click:', clickError)
      // Continue with redirect even if click recording fails
    }

    // Get the watch record (includes affiliate_url and listing_url)
    const { data: watch, error: watchError } = await supabase
      .from('watches')
      .select('brand, model, reference, affiliate_url, listing_url, marketplace')
      .eq('id', parseInt(watchId))
      .single()

    if (watchError || !watch) {
      console.error('Error fetching watch:', watchError)
      return new Response('Watch not found', {
        status: 404,
        headers: corsHeaders
      })
    }

    // Build the redirect URL
    // Priority: 1) watch.affiliate_url  2) seller-based URL  3) watch.listing_url  4) search fallback
    let redirectUrl = watch.affiliate_url || null

    // If no direct affiliate URL and we have a seller_id, try the sellers table
    if (!redirectUrl && sellerId) {
      const { data: seller } = await supabase
        .from('sellers')
        .select('name, affiliate_base_url')
        .eq('id', sellerId)
        .single()

      if (seller?.affiliate_base_url) {
        const searchQuery = encodeURIComponent(`${watch.brand} ${watch.model} ${watch.reference}`)

        if (seller.name === 'Chrono24') {
          redirectUrl = `${seller.affiliate_base_url}?query=${searchQuery}`
        } else if (seller.name === 'eBay') {
          redirectUrl = `${seller.affiliate_base_url}?_nkw=${searchQuery}`
        } else if (seller.name === 'WatchBox') {
          redirectUrl = `${seller.affiliate_base_url}?search=${searchQuery}`
        } else if (seller.name === 'Crown & Caliber') {
          redirectUrl = `${seller.affiliate_base_url}?q=${searchQuery}`
        } else if (seller.name === 'Hodinkee Shop') {
          redirectUrl = `${seller.affiliate_base_url}?q=${searchQuery}`
        } else {
          redirectUrl = `${seller.affiliate_base_url}?q=${searchQuery}`
        }
      }
    }

    // Fall back to the listing URL stored on the watch
    if (!redirectUrl) {
      redirectUrl = watch.listing_url || null
    }

    // Last resort: Google search for the watch
    if (!redirectUrl) {
      const searchQuery = encodeURIComponent(`${watch.brand} ${watch.model} ${watch.reference} buy`)
      redirectUrl = `https://www.google.com/search?q=${searchQuery}`
    }

    // Add UTM parameters to the redirect URL
    if (redirectUrl && (utmSource || utmMedium || utmCampaign)) {
      try {
        const redirectUrlObj = new URL(redirectUrl)
        if (utmSource) redirectUrlObj.searchParams.set('utm_source', utmSource)
        if (utmMedium) redirectUrlObj.searchParams.set('utm_medium', utmMedium)
        if (utmCampaign) redirectUrlObj.searchParams.set('utm_campaign', utmCampaign)
        redirectUrl = redirectUrlObj.toString()
      } catch {
        // If URL parsing fails, just use the raw URL
        console.warn('Failed to parse redirect URL for UTM params:', redirectUrl)
      }
    }

    // Perform the redirect
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': redirectUrl
      }
    })

  } catch (error) {
    console.error('Affiliate redirect error:', error)
    return new Response('Internal server error', {
      status: 500,
      headers: corsHeaders
    })
  }
})