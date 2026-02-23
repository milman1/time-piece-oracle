import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        const resendKey = Deno.env.get('RESEND_API_KEY')
        if (!resendKey) {
            return new Response(JSON.stringify({ error: 'RESEND_API_KEY not set' }), {
                status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        // 1. Fetch all active price alerts
        const { data: alerts, error: alertErr } = await supabase
            .from('price_alerts')
            .select('*')
            .eq('is_active', true)

        if (alertErr) throw alertErr
        if (!alerts || alerts.length === 0) {
            return new Response(JSON.stringify({ message: 'No active alerts', sent: 0 }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        let sent = 0
        const errors: string[] = []

        for (const alert of alerts) {
            try {
                // 2. Check current price for this brand+model in watches table
                const { data: watches } = await supabase
                    .from('watches')
                    .select('price, brand, model, reference, marketplace, affiliate_url, image')
                    .ilike('brand', `%${alert.brand}%`)
                    .ilike('model', `%${alert.model}%`)
                    .order('price', { ascending: true })
                    .limit(5)

                if (!watches || watches.length === 0) continue

                const lowestPrice = watches[0].price
                const targetPrice = parseFloat(alert.target_price)

                // 3. Only send if current price is at or below target
                if (lowestPrice > targetPrice) continue

                const savings = targetPrice - lowestPrice
                const topListings = watches.slice(0, 3)

                // 4. Send price drop email via Resend
                const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'Hours <hello@hello.gethoursapp.com>'

                const listingsHtml = topListings.map((w) => `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 0; font-size: 14px;">
              <strong>${w.marketplace}</strong><br/>
              <span style="color: #888; font-size: 12px;">${w.reference || ''}</span>
            </td>
            <td style="padding: 12px 0; text-align: right; font-size: 16px; font-weight: 600; color: #16a34a;">
              $${Number(w.price).toLocaleString()}
            </td>
            <td style="padding: 12px 0; text-align: right;">
              <a href="${w.affiliate_url || '#'}" style="background: #1a1a2e; color: white; padding: 6px 14px; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: 500;">View</a>
            </td>
          </tr>
        `).join('')

                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${resendKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: fromEmail,
                        to: alert.email,
                        subject: `🔔 Price Drop: ${alert.brand} ${alert.model} is now $${Number(lowestPrice).toLocaleString()}`,
                        html: `
              <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
                <h1 style="font-size: 22px; font-weight: 600; margin-bottom: 8px;">Price Alert Triggered! 🎯</h1>
                <p style="font-size: 15px; line-height: 1.7; color: #555; margin-bottom: 24px;">
                  Great news — the <strong>${alert.brand} ${alert.model}</strong> has dropped to 
                  <strong style="color: #16a34a;">$${Number(lowestPrice).toLocaleString()}</strong>, 
                  which is <strong>$${Number(savings).toLocaleString()} below</strong> your target of $${Number(targetPrice).toLocaleString()}.
                </p>

                <div style="background: #f8f6f3; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                  <h2 style="font-size: 16px; margin-bottom: 12px;">Best Listings Right Now</h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    ${listingsHtml}
                  </table>
                </div>

                <a href="https://gethoursapp.com/browse?q=${encodeURIComponent(alert.brand + ' ' + alert.model)}" 
                   style="display: inline-block; background: #1a1a2e; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 500;">
                  See All Listings →
                </a>

                <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
                <p style="font-size: 12px; color: #aaa;">
                  Hours — Find the best price for any luxury watch.<br/>
                  <a href="https://gethoursapp.com/price-alert" style="color: #b8860b;">Manage your alerts</a>
                </p>
              </div>
            `,
                    }),
                })

                sent++
            } catch (err) {
                errors.push(`Alert ${alert.id}: ${err instanceof Error ? err.message : 'Unknown error'}`)
            }
        }

        return new Response(
            JSON.stringify({ success: true, total_alerts: alerts.length, sent, errors }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
