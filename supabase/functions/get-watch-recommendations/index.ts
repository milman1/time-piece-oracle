
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WatchFilters {
  brand?: string;
  style?: string;
  movement?: string;
  strap?: string;
  max_price?: number;
}

interface WatchRecommendation {
  brand: string;
  model: string;
  style: string;
  reason: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { originalQuery, filters } = await req.json();

    if (!originalQuery || originalQuery.trim() === '') {
      return new Response(
        JSON.stringify({ recommendations: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are a luxury watch expert. When users can't find the exact watch they're looking for, recommend 3 similar alternatives that match their intent and budget.

Consider these factors:
- Brand prestige level (luxury, mid-range, affordable)
- Watch style (dress, sport, diver, pilot, chronograph)
- Movement type (automatic, manual, quartz)
- Price range
- Use case and lifestyle

Provide practical alternatives that are:
1. Actually available in the market
2. Within a reasonable price range of their search
3. Match their style preferences
4. Have good reputation and value

Return exactly 3 recommendations in JSON format:
{
  "recommendations": [
    {
      "brand": "Brand Name",
      "model": "Model Name",
      "style": "watch style",
      "reason": "Brief explanation why this is a good alternative"
    }
  ]
}`;

    const userPrompt = `Original search: "${originalQuery}"
    
    Detected filters: ${JSON.stringify(filters)}
    
    No exact matches found. Recommend 3 similar watches that would appeal to someone with this search intent.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Try to parse the JSON response
    let recommendations: WatchRecommendation[] = [];
    try {
      const parsed = JSON.parse(content);
      recommendations = parsed.recommendations || [];
    } catch (parseError) {
      console.error('Failed to parse GPT response as JSON:', content);
      // Return fallback recommendations
      recommendations = [
        {
          brand: "Seiko",
          model: "Prospex",
          style: "diver",
          reason: "Excellent build quality and value for money"
        },
        {
          brand: "Orient",
          model: "Bambino",
          style: "dress",
          reason: "Classic dress watch with automatic movement"
        },
        {
          brand: "Citizen",
          model: "Eco-Drive",
          style: "sport",
          reason: "Solar-powered technology with durable construction"
        }
      ];
    }

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-watch-recommendations function:', error);
    
    // Return fallback recommendations on error
    const fallbackRecommendations = [
      {
        brand: "Seiko",
        model: "Prospex",
        style: "diver",
        reason: "Reliable dive watch with excellent value"
      },
      {
        brand: "Hamilton",
        model: "Khaki Field",
        style: "pilot",
        reason: "Military-inspired design with Swiss movement"
      },
      {
        brand: "Orient",
        model: "Bambino",
        style: "dress",
        reason: "Elegant automatic dress watch"
      }
    ];

    return new Response(
      JSON.stringify({ 
        recommendations: fallbackRecommendations,
        error: error.message 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
