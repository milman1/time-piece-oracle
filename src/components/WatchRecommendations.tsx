
import React from 'react';
import { Lightbulb, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WatchRecommendation } from '@/services/searchService';

interface WatchRecommendationsProps {
  recommendations: WatchRecommendation[];
  originalQuery: string;
  onSearchRecommendation: (brand: string, model: string) => void;
}

export const WatchRecommendations = ({ 
  recommendations, 
  originalQuery, 
  onSearchRecommendation 
}: WatchRecommendationsProps) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-blue-900">
            We couldn't find an exact match for "{originalQuery}"
          </h3>
          <p className="text-sm text-blue-700">
            Here are some suggestions you might like based on your search:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec, index) => (
          <Card key={index} className="bg-white border-blue-200 hover:border-blue-300 transition-colors">
            <CardContent className="p-4">
              <div className="mb-3">
                <h4 className="font-medium text-foreground">
                  {rec.brand} {rec.model}
                </h4>
                <Badge variant="outline" className="mt-1 text-xs">
                  {rec.style}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {rec.reason}
              </p>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSearchRecommendation(rec.brand, rec.model)}
                className="w-full flex items-center gap-2"
              >
                <Search className="h-3 w-3" />
                Search This Watch
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
