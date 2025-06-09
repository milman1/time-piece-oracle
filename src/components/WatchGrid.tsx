
import React from 'react';
import { Star, ShieldCheck, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const WatchGrid = () => {
  const mockWatches = [
    {
      id: 1,
      brand: 'Rolex',
      model: 'Submariner Date',
      reference: '126610LN',
      price: 12950,
      originalPrice: 13500,
      condition: 'Excellent',
      seller: 'Crown & Caliber',
      rating: 4.9,
      reviews: 2847,
      marketplace: 'WatchBox',
      image: '/placeholder.svg',
      trusted: true,
      year: 2022
    },
    {
      id: 2,
      brand: 'Omega',
      model: 'Speedmaster Professional',
      reference: '310.30.42.50.01.001',
      price: 4250,
      originalPrice: 4850,
      condition: 'Very Good',
      seller: 'Hodinkee Shop',
      rating: 4.8,
      reviews: 1923,
      marketplace: 'Chrono24',
      image: '/placeholder.svg',
      trusted: true,
      year: 2021
    },
    {
      id: 3,
      brand: 'Tudor',
      model: 'Black Bay 58',
      reference: '79030N',
      price: 2890,
      originalPrice: 3200,
      condition: 'New',
      seller: 'Tourneau',
      rating: 4.7,
      reviews: 756,
      marketplace: 'eBay',
      image: '/placeholder.svg',
      trusted: true,
      year: 2023
    },
    {
      id: 4,
      brand: 'Cartier',
      model: 'Santos Medium',
      reference: 'WSSA0029',
      price: 5650,
      originalPrice: 6100,
      condition: 'Excellent',
      seller: 'Bob\'s Watches',
      rating: 4.9,
      reviews: 3421,
      marketplace: 'WatchStation',
      image: '/placeholder.svg',
      trusted: true,
      year: 2022
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {mockWatches.map((watch) => (
        <Card key={watch.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-slate-300">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {/* Watch Image */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center">
                  <div className="w-16 h-16 bg-slate-300 rounded-full"></div>
                </div>
              </div>
              
              {/* Watch Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-lg text-foreground group-hover:text-slate-600 transition-colors">
                      {watch.brand} {watch.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Ref: {watch.reference} • {watch.year}
                    </p>
                  </div>
                  {watch.trusted && (
                    <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
                  )}
                </div>
                
                {/* Price */}
                <div className="mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-foreground">
                      ${watch.price.toLocaleString()}
                    </span>
                    {watch.originalPrice > watch.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${watch.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {watch.originalPrice > watch.price && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Save ${(watch.originalPrice - watch.price).toLocaleString()}
                    </Badge>
                  )}
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
                  <Badge variant="outline" className="text-xs">
                    {watch.condition}
                  </Badge>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Listed on {watch.marketplace}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
