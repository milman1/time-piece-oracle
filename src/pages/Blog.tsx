
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(blogPosts.map(p => p.category)))];
  const filtered = activeCategory === 'All' ? blogPosts : blogPosts.filter(p => p.category === activeCategory);
  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

  return (
    <div className="min-h-screen bg-[var(--warm-white)]">
      <Helmet>
        <title>Luxury Watch Market Insights & Guides | Hours Blog</title>
        <meta name="description" content="Expert guides, price comparisons, and market analysis for luxury watches. Covering Rolex, Omega, Patek Philippe and more." />
      </Helmet>
      <Header />

      <main className="pt-20 md:pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl tracking-tight text-foreground mb-3 leading-tight">
              Market Insights & Guides
            </h1>
            <p className="text-[15px] text-muted-foreground max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Price guides, marketplace comparisons, and collector updates — powered by data from Hours.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[12px] px-3.5 py-1.5 rounded-full font-medium transition-all duration-300 ${activeCategory === cat ? 'bg-[var(--navy)] text-white' : 'bg-white text-muted-foreground border border-slate-200/80 hover:border-[var(--gold)] hover:text-[var(--gold)]'}`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured posts */}
          {featured.length > 0 && (
            <section className="mb-12">
              <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>Featured</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featured.map(post => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="bg-white rounded-2xl shadow-soft border border-slate-100/60 p-6 hover:shadow-elevated transition-all duration-400 group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-[11px] border-slate-200/80">{post.category}</Badge>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Calendar className="h-3 w-3" /> {formatDate(post.date)}
                      </span>
                    </div>
                    <h3 className="text-[17px] md:text-lg font-semibold text-foreground leading-snug group-hover:text-[var(--gold)] transition-colors mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {post.title}
                    </h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {post.excerpt}
                    </p>
                    <span className="text-[12px] font-medium text-[var(--gold)] flex items-center gap-1 group-hover:gap-2 transition-all" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Read article <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* All posts */}
          {rest.length > 0 && (
            <section className="mb-12">
              <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>Latest Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {rest.map(post => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="bg-white rounded-2xl shadow-soft border border-slate-100/60 p-5 hover:shadow-elevated transition-all duration-400 group"
                  >
                    <Badge variant="outline" className="text-[10px] border-slate-200/80 mb-3">{post.category}</Badge>
                    <h3 className="text-[14px] font-semibold text-foreground leading-snug group-hover:text-[var(--gold)] transition-colors mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {post.title}
                    </h3>
                    <p className="text-[12px] text-muted-foreground leading-relaxed mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(post.date)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Newsletter CTA */}
          <section className="bg-white rounded-2xl shadow-soft border border-slate-100/60 p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-[var(--gold)]" />
              <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                Stay Updated
              </h3>
            </div>
            <p className="text-[14px] text-muted-foreground max-w-xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
              Weekly insights on luxury watch pricing, market analysis, and investment opportunities.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
