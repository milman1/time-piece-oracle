
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

  let searchAnalytics = {
    search_query: '',
    search_type: 'ai',
    ai_parsing_success: false,
    ai_parsing_error: null as string | null,
    user_agent: req.headers.get('user-agent') || null,
    session_id: req.headers.get('x-session-id') || null,
    ai_filters_detected: null as any
  };

  try {
    const { query } = await req.json();
    searchAnalytics.search_query = query;

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
      searchAnalytics.ai_parsing_success = true;
      searchAnalytics.ai_filters_detected = filters;
    } catch (parseError) {
      console.error('Failed to parse GPT response as JSON:', content);
      searchAnalytics.ai_parsing_error = `JSON parse error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`;
      // Fallback to basic text matching
      const lowerQuery = query.toLowerCase();
      if (lowerQuery.includes('rolex')) filters.brand = 'Rolex';
      if (lowerQuery.includes('omega')) filters.brand = 'Omega';
      if (lowerQuery.includes('submariner') || lowerQuery.includes('diver')) filters.style = 'diver';
      if (lowerQuery.includes('speedmaster') || lowerQuery.includes('chronograph')) filters.style = 'chronograph';
      
      if (Object.keys(filters).length > 0) {
        searchAnalytics.ai_parsing_success = true;
        searchAnalytics.ai_filters_detected = filters;
        searchAnalytics.ai_parsing_error = null;
      }
    }

    // Log successful analytics
    await logSearchAnalytics(searchAnalytics);

    return new Response(
      JSON.stringify({ filters }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-watch-search function:', error);
    searchAnalytics.ai_parsing_error = error instanceof Error ? error.message : 'Unknown error';
    await logSearchAnalytics(searchAnalytics);
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', filters: {} }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function logSearchAnalytics(analytics: any) {
  try {
    const { error } = await supabase
      .from('search_analytics')
      .insert([analytics]);
    
    if (error) {
      console.error('Failed to log search analytics:', error);
    }
  } catch (error) {
    console.error('Error logging search analytics:', error);
  }
}
