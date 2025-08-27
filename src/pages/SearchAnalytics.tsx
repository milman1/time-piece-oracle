import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSearchAnalytics, getSearchStats } from "@/services/analyticsService";
import { formatDistanceToNow } from "date-fns";
import { Search, TrendingUp, Target, AlertCircle } from "lucide-react";

interface SearchAnalyticsData {
  id: string;
  search_query: string;
  search_type: string;
  ai_filters_detected: any;
  ai_parsing_success: boolean;
  ai_parsing_error: string | null;
  results_count: number | null;
  created_at: string;
}

interface SearchStats {
  total: number;
  ai_searches: number;
  basic_searches: number;
  manual_searches: number;
  ai_success_rate: number;
}

export default function SearchAnalytics() {
  const [analytics, setAnalytics] = useState<SearchAnalyticsData[]>([]);
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, statsData] = await Promise.all([
          getSearchAnalytics(50),
          getSearchStats()
        ]);
        
        setAnalytics(analyticsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Analytics</h1>
        <p className="text-muted-foreground">
          Track AI search usage and performance metrics
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Searches</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.ai_searches}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.ai_searches / stats.total) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Success Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(stats.ai_success_rate)}%</div>
              <p className="text-xs text-muted-foreground">Filter detection success</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Basic Searches</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.basic_searches}</div>
              <p className="text-xs text-muted-foreground">Fallback searches</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Searches */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Search Queries</CardTitle>
          <CardDescription>
            Latest search attempts and their AI parsing results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.map((search) => (
              <div key={search.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{search.search_query}</h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(search.created_at))} ago
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge 
                      variant={search.search_type === 'ai' ? 'default' : 'secondary'}
                    >
                      {search.search_type}
                    </Badge>
                    {search.search_type === 'ai' && (
                    <Badge 
                      variant={search.ai_parsing_success ? 'default' : 'destructive'}
                    >
                      {search.ai_parsing_success ? 'Success' : 'Failed'}
                    </Badge>
                    )}
                  </div>
                </div>
                
                {search.ai_filters_detected && Object.keys(search.ai_filters_detected).length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Detected filters:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(search.ai_filters_detected).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}: {String(value)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {search.ai_parsing_error && (
                  <div className="mt-2 text-xs text-destructive">
                    Error: {search.ai_parsing_error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}