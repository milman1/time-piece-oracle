
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Star, ExternalLink, TrendingUp } from 'lucide-react';
import PriceHistoryChart from '@/components/PriceHistoryChart';
import { fetchPriceHistory } from '@/services/priceService';

const ProductDetail = () => {
  const { model } = useParams<{ model: string }>();
  const [sortBy, setSortBy] = useState('price');
  const [priceRange, setPriceRange] = useState<30 | 90 | 180>(90);
  
  // Mock data for the watch detail page
  const watchName = "Rolex Submariner Date";
  const referenceNumber = "126610LN";
  const watchId = 1; // This would come from your watch service based on the model param
  
  const listings = [
    {
      id: 1,
      price: 13500,
      condition: "Excellent",
      seller: "Crown & Caliber",
      trustScore: 4.9,
      location: "Atlanta, GA",
      url: "#"
    },
    {
      id: 2,
      price: 13750,
      condition: "Very Good",
      seller: "Bob's Watches",
      trustScore: 4.8,
      location: "Newport Beach, CA",
      url: "#"
    },
    {
      id: 3,
      price: 14200,
      condition: "New",
      seller: "Chrono24 Seller",
      trustScore: 4.7,
      location: "New York, NY",
      url: "#"
    }
  ];

  const relatedModels = [
    "Rolex Submariner No Date (124060)",
    "Rolex GMT-Master II (126710BLNR)",
    "Omega Seamaster Planet Ocean",
    "Tudor Black Bay 58"
  ];

  // Query for price history
  const { data: pricePoints = [], isFetching: isLoadingPrices } = useQuery({
    queryKey: ["price-history", { watchId, range: priceRange }],
    queryFn: () => fetchPriceHistory(watchId, priceRange),
    enabled: !!watchId,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const sortedListings = [...listings].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'condition') return b.condition.localeCompare(a.condition);
    if (sortBy === 'trust') return b.trustScore - a.trustScore;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{watchName} ({referenceNumber}) - Compare Best Prices | Hours</title>
        <meta 
          name="description" 
          content={`Find the best prices for ${watchName} ${referenceNumber}. Compare listings across Chrono24, eBay, WatchBox and more trusted dealers. Current lowest price from $${Math.min(...listings.map(l => l.price)).toLocaleString()}.`}
        />
        <meta name="keywords" content={`${watchName}, ${referenceNumber}, Rolex watch prices, luxury watch marketplace, authentic Rolex`} />
        <link rel="canonical" href={`https://www.hours.com/watch/${model}`} />
      </Helmet>
      <Header />
      
      <main className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-light tracking-tight text-foreground mb-4">
              {watchName} – Compare Best Prices
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Search real-time listings for this model across trusted sellers including Chrono24, WatchBox, eBay, and Bob's Watches. Updated daily.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Reference: <strong>{referenceNumber}</strong></span>
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {listings.length} listings found
              </Badge>
            </div>
          </div>

          {/* Sorting Controls */}
          <div className="mb-6">
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'price' ? 'default' : 'outline'}
                onClick={() => setSortBy('price')}
                size="sm"
              >
                Price Low to High
              </Button>
              <Button
                variant={sortBy === 'condition' ? 'default' : 'outline'}
                onClick={() => setSortBy('condition')}
                size="sm"
              >
                Condition
              </Button>
              <Button
                variant={sortBy === 'trust' ? 'default' : 'outline'}
                onClick={() => setSortBy('trust')}
                size="sm"
              >
                Trusted Sellers
              </Button>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid gap-4 mb-12">
            {sortedListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div className="md:col-span-2">
                      <div className="text-2xl font-semibold text-foreground">
                        ${listing.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">{listing.location}</div>
                    </div>
                    
                    <div className="text-center">
                      <Badge variant="secondary">{listing.condition}</Badge>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-medium">{listing.seller}</div>
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{listing.trustScore}</span>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 flex justify-end">
                      <Button variant="outline" className="flex items-center gap-2">
                        View Listing
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Price History Chart */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-medium">Price History</CardTitle>
                <div className="flex gap-2">
                  {[30, 90, 180].map((days) => (
                    <Button
                      key={days}
                      variant={priceRange === days ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPriceRange(days as 30 | 90 | 180)}
                      className="text-xs"
                    >
                      {days}d
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingPrices ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-muted-foreground">Loading price history...</div>
                </div>
              ) : (
                <PriceHistoryChart data={pricePoints} />
              )}
            </CardContent>
          </Card>

          {/* Related Models */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">You May Also Like</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedModels.map((model, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="font-medium text-foreground">{model}</div>
                    <div className="text-sm text-muted-foreground">Compare prices →</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
