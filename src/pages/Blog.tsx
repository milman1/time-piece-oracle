
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Calendar, Clock, TrendingUp, ArrowRight } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Most Tracked Watches This Week",
      excerpt: "Discover which luxury timepieces are capturing the attention of collectors and investors worldwide.",
      date: "2025-01-08",
      readTime: "5 min read",
      category: "Market Trends",
      featured: true
    },
    {
      id: 2,
      title: "Why Rolex Prices Are Increasing in 2025",
      excerpt: "An in-depth analysis of the factors driving Rolex price increases and what it means for collectors.",
      date: "2025-01-06",
      readTime: "8 min read",
      category: "Price Analysis",
      featured: true
    },
    {
      id: 3,
      title: "Chrono24 vs WatchBox – Which Has the Better Deals?",
      excerpt: "We compared thousands of listings to find out which marketplace offers the best value for luxury watches.",
      date: "2025-01-04",
      readTime: "6 min read",
      category: "Marketplace Comparison",
      featured: false
    },
    {
      id: 4,
      title: "Investment Grade Watches: 2025 Edition",
      excerpt: "Which luxury watches are likely to appreciate in value this year? Our data-driven predictions.",
      date: "2025-01-02",
      readTime: "12 min read",
      category: "Investment Guide",
      featured: false
    },
    {
      id: 5,
      title: "Patek Philippe Market Analysis: December 2024",
      excerpt: "Monthly deep-dive into Patek Philippe pricing trends and market performance across all major models.",
      date: "2024-12-30",
      readTime: "10 min read",
      category: "Brand Focus",
      featured: false
    },
    {
      id: 6,
      title: "How to Spot Fake Luxury Watches Online",
      excerpt: "Essential tips for identifying authentic timepieces when shopping on marketplaces and avoiding counterfeits.",
      date: "2024-12-28",
      readTime: "7 min read",
      category: "Buying Guide",
      featured: false
    }
  ];

  const categories = ["All", "Market Trends", "Price Analysis", "Investment Guide", "Brand Focus", "Buying Guide"];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-foreground mb-4">
              Luxury Watch Market Insights & Trends
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Guides, price comparisons, and collector updates — powered by data from Hours.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer hover:bg-slate-200 transition-colors px-4 py-2"
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Featured Posts */}
          <section className="mb-16">
            <h2 className="text-2xl font-serif font-medium mb-8 text-foreground">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.filter(post => post.featured).map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{post.category}</Badge>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-serif leading-tight group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      Read Article
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* All Posts Grid */}
          <section>
            <h2 className="text-2xl font-serif font-medium mb-8 text-foreground">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.filter(post => !post.featured).map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <Badge variant="outline" className="w-fit mb-3">{post.category}</Badge>
                    <CardTitle className="text-lg font-serif leading-tight group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Newsletter Signup */}
          <section className="mt-16 text-center p-8 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-serif font-medium text-foreground">
                Stay Updated on Watch Market Trends
              </h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get weekly insights on luxury watch pricing, market analysis, and investment opportunities delivered to your inbox.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Blog;
