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
    const sellerId = url.searchParams.get('seller_id')
    const utmSource = url.searchParams.get('utm_source')
    const utmMedium = url.searchParams.get('utm_medium')
    const utmCampaign = url.searchParams.get('utm_campaign')

    if (!watchId || !sellerId) {
      return new Response('Missing required parameters: watch_id and seller_id', { 
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

    // Record the affiliate click
    const { error: clickError } = await supabase
      .from('affiliate_clicks')
      .insert({
        watch_id: parseInt(watchId),
        seller_id: sellerId,
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

    // Get the watch and seller information to build the redirect URL
    const { data: watch, error: watchError } = await supabase
      .from('watches')
      .select('brand, model, reference, affiliate_url')
      .eq('id', parseInt(watchId))
      .single()

    if (watchError || !watch) {
      console.error('Error fetching watch:', watchError)
      return new Response('Watch not found', { 
        status: 404,
        headers: corsHeaders 
      })
    }

    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .select('name, affiliate_base_url')
      .eq('id', sellerId)
      .single()

    if (sellerError || !seller) {
      console.error('Error fetching seller:', sellerError)
      return new Response('Seller not found', { 
        status: 404,
        headers: corsHeaders 
      })
    }

    // Build the affiliate URL
    let redirectUrl = watch.affiliate_url

    // If no direct affiliate URL, construct from seller base URL
    if (!redirectUrl && seller.affiliate_base_url) {
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
        redirectUrl = `https://www.google.com/search?q=${searchQuery} buy`
      }
    }

    // Add UTM parameters to the redirect URL
    if (redirectUrl && (utmSource || utmMedium || utmCampaign)) {
      const redirectUrlObj = new URL(redirectUrl)
      if (utmSource) redirectUrlObj.searchParams.set('utm_source', utmSource)
      if (utmMedium) redirectUrlObj.searchParams.set('utm_medium', utmMedium)
      if (utmCampaign) redirectUrlObj.searchParams.set('utm_campaign', utmCampaign)
      redirectUrl = redirectUrlObj.toString()
    }

    if (!redirectUrl) {
      return new Response('No redirect URL available', { 
        status: 404,
        headers: corsHeaders 
      })
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