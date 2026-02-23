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
        const { email, source = 'blog' } = await req.json()

        if (!email || !email.includes('@')) {
            return new Response(
                JSON.stringify({ error: 'Valid email required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Save to newsletter_subscribers table
        const { error: dbError } = await supabase
            .from('newsletter_subscribers')
            .upsert({ email: email.toLowerCase().trim(), source }, { onConflict: 'email' })

        if (dbError) {
            console.error('DB error:', dbError)
        }

        // Send welcome email via Resend
        const resendKey = Deno.env.get('RESEND_API_KEY')
        if (resendKey) {
            const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'Hours <hello@hours.com>'

            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: fromEmail,
                    to: email.toLowerCase().trim(),
                    subject: 'Welcome to Hours — Your Swiss Watch Market Report',
                    html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
              <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 16px;">Welcome to Hours</h1>
              <p style="font-size: 15px; line-height: 1.7; color: #555;">
                Thanks for subscribing! You're now on the list for weekly luxury watch market insights, price alerts, and exclusive reports.
              </p>
              
              <div style="background: #f8f6f3; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">📊 Swiss Watch Industry Study 2025</h2>
                <p style="font-size: 14px; line-height: 1.6; color: #555; margin-bottom: 16px;">
                  Key highlights from this year's Deloitte report:
                </p>
                <ul style="font-size: 14px; line-height: 1.8; color: #555; padding-left: 20px;">
                  <li><strong>39% US tariffs</strong> are expected to raise Swiss watch prices 5-15%</li>
                  <li><strong>58% of consumers</strong> won't spend over CHF 1,500 on a new watch</li>
                  <li>The <strong>pre-owned market</strong> continues to boom — exempt from tariffs</li>
                  <li><strong>29% of brands</strong> are now using AI in product design</li>
                  <li><strong>India & Mexico</strong> are the fastest-growing markets</li>
                </ul>
                <p style="font-size: 13px; color: #888; margin-top: 16px;">
                  <a href="https://www2.deloitte.com/ch/en/pages/consumer-business/articles/swiss-watch-industry-study.html" style="color: #b8860b;">Download the full Deloitte report →</a>
                </p>
              </div>

              <p style="font-size: 15px; line-height: 1.7; color: #555;">
                In the meantime, <a href="https://hours.com/browse" style="color: #b8860b; text-decoration: none; font-weight: 500;">search the meta-marketplace</a> to compare prices across 8 platforms in one search.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
              <p style="font-size: 12px; color: #aaa;">
                Hours — Find the best price for any luxury watch.<br/>
                You received this because you signed up at hours.com.
              </p>
            </div>
          `,
                }),
            })
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Subscribed successfully' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error: unknown) {
        console.error('Newsletter error:', error)
        return new Response(
            JSON.stringify({ error: 'Failed to subscribe', message: error instanceof Error ? error.message : 'Unknown error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
