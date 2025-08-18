
import React from 'react';
import { Star, ShieldCheck, Eye, Heart, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Watch } from '@/services/watchService';
import { WatchImage } from './WatchImage';

interface WatchGridProps {
  watches: Watch[];
}

export const WatchGrid = ({ watches }: WatchGridProps) => {
  const handleWatchlist = (watchId: number) => {
    console.log(`Added watch ${watchId} to watchlist`);
    // This would integrate with backend later
  };

  const isBestDeal = (watch: Watch) => {
    if (!watch.avgPrice) return false;
    const discountPercentage = ((watch.avgPrice - watch.price) / watch.avgPrice) * 100;
    return discountPercentage >= 15;
  };

  const getAffiliateUrl = (watch: Watch) => {
    if (!watch.seller_id) {
      // Fallback for watches without seller_id
      return `/go?watch_id=${watch.id}&seller_id=&utm_source=tpo&utm_medium=affiliate&utm_campaign=listing`;
    }
    return `/go?watch_id=${watch.id}&seller_id=${watch.seller_id}&utm_source=tpo&utm_medium=affiliate&utm_campaign=listing`;
  };

  if (watches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No watches found</h3>
        <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {watches.map((watch) => (
        <Card key={watch.id} className="group hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-slate-300 rounded-xl shadow-md">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {/* Watch Image */}
              <div className="flex-shrink-0">
                <WatchImage
                  reference={watch.reference}
                  brand={watch.brand}
                  model={watch.model}
                  className="w-24 h-24 rounded-lg shadow-sm"
                />
              </div>
              
              {/* Watch Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-slate-600 transition-colors">
                      {watch.brand} {watch.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Ref: {watch.reference} • {watch.year}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {watch.trusted && (
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleWatchlist(watch.id)}
                      className="p-1 h-8 w-8 hover:bg-slate-100 rounded-full"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Price */}
                <div className="mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      ${watch.price.toLocaleString()}
                    </span>
                    {watch.originalPrice && watch.originalPrice > watch.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${watch.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {watch.originalPrice && watch.originalPrice > watch.price && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 rounded-full">
                        Save ${(watch.originalPrice - watch.price).toLocaleString()}
                      </Badge>
                    )}
                    {isBestDeal(watch) && (
                      <Badge className="text-xs bg-orange-500 text-white font-semibold rounded-full">
                        🔥 Best Deal
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Seller Info */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium">{watch.seller}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">
                        {watch.rating} ({watch.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs rounded-full">
                    {watch.condition}
                  </Badge>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button 
                    asChild
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Link 
                      to={getAffiliateUrl(watch)}
                      className="flex items-center justify-center gap-2"
                    >
                      Buy Now
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Link 
                    to={`/watch/${watch.reference}`} 
                  >
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-lg hover:bg-slate-50 border-slate-300"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                  <span>Available on {watch.marketplace} • We may earn a commission when you buy through links on our site.</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
