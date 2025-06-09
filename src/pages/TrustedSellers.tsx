
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Shield, Star, RefreshCw, Award, Users, CheckCircle } from 'lucide-react';

const TrustedSellers = () => {
  const verificationPoints = [
    {
      icon: Star,
      title: "Seller Ratings",
      description: "Minimum 4.5+ star rating across multiple platforms with consistent positive feedback from verified buyers."
    },
    {
      icon: RefreshCw,
      title: "Return Policy",
      description: "Clear return policies with money-back guarantees and reasonable return windows for buyer protection."
    },
    {
      icon: Shield,
      title: "Authenticity Guarantee",
      description: "Professional authentication services and certificates of authenticity for all luxury timepieces."
    },
    {
      icon: Award,
      title: "Business Verification",
      description: "Licensed dealers with established business history and verifiable contact information."
    }
  ];

  const marketplaces = [
    { name: "Chrono24", description: "World's largest marketplace for luxury watches" },
    { name: "WatchBox", description: "Premium pre-owned watch marketplace" },
    { name: "Bob's Watches", description: "Rolex specialist with authentication guarantee" },
    { name: "Crown & Caliber", description: "Luxury watch retailer with expert curation" },
    { name: "eBay Authenticated", description: "eBay's authenticated watch program" },
    { name: "Hodinkee Shop", description: "Curated selection from watch enthusiasts" }
  ];

  const stats = [
    { number: "500K+", label: "Verified Transactions" },
    { number: "98.7%", label: "Customer Satisfaction" },
    { number: "24/7", label: "Fraud Monitoring" },
    { number: "100%", label: "Authentication Rate" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4">
              How We Verify Trusted Sellers
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Every listing on Hours is pulled from reputable marketplaces with strong seller ratings, warranties, and return policies.
            </p>
          </div>

          {/* Verification Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {verificationPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-3 text-foreground flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {point.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {point.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Trusted by Thousands Section */}
          <section className="text-center mb-16">
            <h2 className="text-3xl font-light mb-8 text-foreground">
              Trusted by Thousands
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-light text-foreground mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Supported Marketplaces */}
          <section className="text-center">
            <h2 className="text-3xl font-light mb-8 text-foreground">
              Supported Marketplaces
            </h2>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
              We partner with the most reputable luxury watch marketplaces to ensure every listing meets our quality standards.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplaces.map((marketplace, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-medium mb-2 text-foreground">
                      {marketplace.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {marketplace.description}
                    </p>
                    <div className="mt-4 flex justify-center">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Trust Building CTA */}
          <section className="text-center mt-16 p-8 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-medium text-foreground">
                Join Thousands of Confident Buyers
              </h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Start comparing prices from verified sellers and never overpay for a luxury watch again.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TrustedSellers;
