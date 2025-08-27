import { supabase } from '@/integrations/supabase/client';

export interface SearchAnalytics {
  search_query: string;
  search_type: 'ai' | 'basic' | 'manual';
  ai_filters_detected?: any;
  ai_parsing_success?: boolean;
  ai_parsing_error?: string | null;
  results_count?: number;
  session_id?: string;
  user_agent?: string;
}

export const logSearch = async (analytics: SearchAnalytics) => {
  try {
    const { error } = await supabase
      .from('search_analytics')
      .insert([{
        ...analytics,
        user_agent: navigator.userAgent,
        session_id: getSessionId()
      }]);
    
    if (error) {
      console.error('Failed to log search analytics:', error);
    }
  } catch (error) {
    console.error('Error logging search analytics:', error);
  }
};

export const getSearchAnalytics = async (limit = 100) => {
  try {
    const { data, error } = await supabase
      .from('search_analytics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Failed to fetch search analytics:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching search analytics:', error);
    return [];
  }
};

export const getSearchStats = async () => {
  try {
    const { data, error } = await supabase
      .from('search_analytics')
      .select('search_type, ai_parsing_success, created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours
    
    if (error) {
      console.error('Failed to fetch search stats:', error);
      return null;
    }
    
    const stats = {
      total: data.length,
      ai_searches: data.filter(d => d.search_type === 'ai').length,
      basic_searches: data.filter(d => d.search_type === 'basic').length,
      manual_searches: data.filter(d => d.search_type === 'manual').length,
      ai_success_rate: 0
    };
    
    const aiSearches = data.filter(d => d.search_type === 'ai');
    if (aiSearches.length > 0) {
      const successful = aiSearches.filter(d => d.ai_parsing_success).length;
      stats.ai_success_rate = (successful / aiSearches.length) * 100;
    }
    
    return stats;
  } catch (error) {
    console.error('Error fetching search stats:', error);
    return null;
  }
};

// Generate or retrieve session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('search_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('search_session_id', sessionId);
  }
  return sessionId;
}