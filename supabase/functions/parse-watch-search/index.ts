
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query || query.trim() === '') {
      return new Response(
        JSON.stringify({ filters: {} }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are a luxury watch expert assistant. Convert user search queries into structured JSON filters for watch searches.

Available options:
- brand: Any luxury watch brand (e.g., "Rolex", "Omega", "Patek Philippe", "Audemars Piguet", "Cartier", "Tudor", "Breitling", "IWC")
- style: "dress", "diver", "chronograph", "pilot", "sport"
- movement: "automatic", "manual", "quartz"
- strap: "leather", "metal", "rubber", "nato", "bracelet"
- max_price: number (in USD)

Rules:
1. Only include fields that can be reasonably inferred from the query
2. For ambiguous queries, make educated guesses based on watch knowledge
3. If a price is mentioned, extract it as max_price
4. If specific models are mentioned, extract the brand
5. Return only valid JSON with the specified fields
6. If nothing can be inferred, return an empty object

Examples:
- "Rolex Submariner" → {"brand": "Rolex", "style": "diver"}
- "automatic chronograph under $5000" → {"style": "chronograph", "movement": "automatic", "max_price": 5000}
- "dress watch leather strap" → {"style": "dress", "strap": "leather"}
- "Omega Speedmaster" → {"brand": "Omega", "style": "chronograph"}`;

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
          { role: 'user', content: `Parse this watch search query: "${query}"` }
        ],
        temperature: 0.1,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Try to parse the JSON response
    let filters: WatchFilters = {};
    try {
      filters = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse GPT response as JSON:', content);
      // Fallback to basic text matching
      const lowerQuery = query.toLowerCase();
      if (lowerQuery.includes('rolex')) filters.brand = 'Rolex';
      if (lowerQuery.includes('omega')) filters.brand = 'Omega';
      if (lowerQuery.includes('submariner') || lowerQuery.includes('diver')) filters.style = 'diver';
      if (lowerQuery.includes('speedmaster') || lowerQuery.includes('chronograph')) filters.style = 'chronograph';
    }

    return new Response(
      JSON.stringify({ filters }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-watch-search function:', error);
    return new Response(
      JSON.stringify({ error: error.message, filters: {} }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
