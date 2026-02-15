import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// eBay Browse API proxy
// Reads EBAY_APP_ID from Supabase secrets (set via Dashboard > Edge Functions > Secrets)
// Accepts: ?q=rolex+submariner&limit=20&minPrice=1000&maxPrice=50000&condition=PRE_OWNED
//
// To set your eBay API key as a secret:
//   supabase secrets set EBAY_APP_ID=your_ebay_app_id
//   supabase secrets set EBAY_AFFILIATE_CAMPAIGN_ID=your_campaign_id
// Or set via the Supabase Dashboard > Project Settings > Edge Functions > Secrets

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const appId = Deno.env.get('EBAY_APP_ID')
        if (!appId) {
            return new Response(
                JSON.stringify({ error: 'EBAY_APP_ID not configured. Set it in Supabase Edge Function secrets.' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const affiliateCampaignId = Deno.env.get('EBAY_AFFILIATE_CAMPAIGN_ID') || ''

        const url = new URL(req.url)
        const query = url.searchParams.get('q') || ''
        const limit = url.searchParams.get('limit') || '20'
        const minPrice = url.searchParams.get('minPrice')
        const maxPrice = url.searchParams.get('maxPrice')
        const condition = url.searchParams.get('condition')

        if (!query.trim()) {
            return new Response(
                JSON.stringify({ error: 'Missing required parameter: q' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Build eBay Browse API URL
        const ebayUrl = new URL('https://api.ebay.com/buy/browse/v1/item_summary/search')
        ebayUrl.searchParams.set('q', query)
        ebayUrl.searchParams.set('limit', limit)
        ebayUrl.searchParams.set('category_ids', '31387') // Wristwatches

        // Price filter
        if (minPrice || maxPrice) {
            const filters: string[] = []
            if (minPrice) filters.push(`price:[${minPrice}..${maxPrice || '*'}]`)
            else if (maxPrice) filters.push(`price:[*..${maxPrice}]`)
            ebayUrl.searchParams.set('filter', filters.join(','))
        }

        // Condition filter
        if (condition) {
            const conditionMap: Record<string, string> = {
                'new': '1000',
                'pre-owned': '3000',
                'used': '3000',
            }
            const conditionId = conditionMap[condition.toLowerCase()] || condition
            const existingFilter = ebayUrl.searchParams.get('filter')
            const conditionFilter = `conditionIds:{${conditionId}}`
            ebayUrl.searchParams.set('filter', existingFilter ? `${existingFilter},${conditionFilter}` : conditionFilter)
        }

        // Build headers
        const headers: Record<string, string> = {
            'Authorization': `Bearer ${appId}`,
            'Content-Type': 'application/json',
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        }

        // Add affiliate tracking if configured
        if (affiliateCampaignId) {
            headers['X-EBAY-C-ENDUSERCTX'] = `affiliateCampaignId=${affiliateCampaignId}`
        }

        // First try with the app ID as bearer token (OAuth token)
        let response = await fetch(ebayUrl.toString(), { headers })

        // If 401, the app ID might be a client ID — get an OAuth token first
        if (response.status === 401) {
            const clientId = appId
            const clientSecret = Deno.env.get('EBAY_CLIENT_SECRET') || ''

            // Get OAuth token using client credentials grant
            const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
                },
                body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
            })

            if (!tokenResponse.ok) {
                const tokenError = await tokenResponse.text()
                return new Response(
                    JSON.stringify({ error: 'Failed to get eBay OAuth token', details: tokenError }),
                    { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            const tokenData = await tokenResponse.json()
            headers['Authorization'] = `Bearer ${tokenData.access_token}`

            // Retry with the OAuth token
            response = await fetch(ebayUrl.toString(), { headers })
        }

        if (!response.ok) {
            const errorText = await response.text()
            return new Response(
                JSON.stringify({ error: `eBay API error (${response.status})`, details: errorText }),
                { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const data = await response.json()

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error('eBay proxy error:', error)
        return new Response(
            JSON.stringify({ error: 'Internal server error', message: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
