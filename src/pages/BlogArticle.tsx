
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { getPostBySlug, blogPosts } from '@/data/blogPosts';
import EmailCapture from '@/components/EmailCapture';
import NotFound from './NotFound';

const BlogArticle = () => {
    const { slug } = useParams<{ slug: string }>();
    const post = slug ? getPostBySlug(slug) : undefined;

    if (!post) return <NotFound />;

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        });

    // Parse content into sections (split by ## headings)
    const renderContent = (content: string) => {
        const lines = content.split('\n');
        const elements: React.ReactNode[] = [];
        let key = 0;

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) {
                elements.push(<div key={key++} className="h-3" />);
            } else if (trimmed.startsWith('### ')) {
                elements.push(
                    <h3 key={key++} className="text-lg font-semibold text-foreground mt-6 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {trimmed.replace('### ', '')}
                    </h3>
                );
            } else if (trimmed.startsWith('## ')) {
                elements.push(
                    <h2 key={key++} className="text-xl md:text-2xl font-semibold text-foreground mt-8 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {trimmed.replace('## ', '')}
                    </h2>
                );
            } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                elements.push(
                    <p key={key++} className="text-[15px] font-semibold text-foreground my-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {trimmed.replace(/\*\*/g, '')}
                    </p>
                );
            } else if (trimmed.startsWith('- **')) {
                const match = trimmed.match(/^- \*\*(.+?)\*\*\s*(.*)$/);
                if (match) {
                    elements.push(
                        <li key={key++} className="text-[15px] text-muted-foreground leading-relaxed ml-4 mb-1.5 list-disc" style={{ fontFamily: 'Inter, sans-serif' }}>
                            <strong className="text-foreground">{match[1]}</strong> {match[2]}
                        </li>
                    );
                }
            } else if (trimmed.startsWith('- ')) {
                elements.push(
                    <li key={key++} className="text-[15px] text-muted-foreground leading-relaxed ml-4 mb-1.5 list-disc" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {trimmed.replace('- ', '')}
                    </li>
                );
            } else {
                // Render inline bold
                const parts = trimmed.split(/(\*\*.*?\*\*)/g);
                elements.push(
                    <p key={key++} className="text-[15px] text-muted-foreground leading-relaxed mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {parts.map((part, i) =>
                            part.startsWith('**') && part.endsWith('**')
                                ? <strong key={i} className="text-foreground font-medium">{part.replace(/\*\*/g, '')}</strong>
                                : part
                        )}
                    </p>
                );
            }
        }
        return elements;
    };

    // Related posts
    const relatedPosts = blogPosts.filter(p => p.slug !== post.slug).slice(0, 3);

    return (
        <div className="min-h-screen bg-[var(--warm-white)]">
            <Helmet>
                <title>{post.title} | Hours Blog</title>
                <meta name="description" content={post.metaDescription} />
                <meta name="keywords" content={post.keywords.join(', ')} />
                <link rel="canonical" href={`https://hours.com/blog/${post.slug}`} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.metaDescription} />
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={post.date} />
            </Helmet>
            <Header />

            <main className="pt-20 md:pt-24 pb-12 px-4">
                <article className="max-w-3xl mx-auto">

                    {/* Back link */}
                    <Link to="/blog" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-[var(--gold)] transition-colors mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <ArrowLeft className="h-3.5 w-3.5" /> All articles
                    </Link>

                    {/* Article header */}
                    <header className="mb-8">
                        <Badge variant="outline" className="text-[11px] border-slate-200/80 mb-4">{post.category}</Badge>
                        <h1 className="text-2xl md:text-4xl tracking-tight text-foreground leading-tight mb-4">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-4 text-[13px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(post.date)}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="mb-12">
                        {renderContent(post.content)}
                    </div>

                    {/* Email Capture */}
                    <div className="mb-12">
                        <EmailCapture source={`blog:${post.slug}`} />
                    </div>

                    {/* Related posts */}
                    {relatedPosts.length > 0 && (
                        <section>
                            <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                                More Articles
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {relatedPosts.map(p => (
                                    <Link
                                        key={p.slug}
                                        to={`/blog/${p.slug}`}
                                        className="bg-white rounded-2xl shadow-soft border border-slate-100/60 p-4 hover:shadow-elevated transition-all duration-400 group"
                                    >
                                        <Badge variant="outline" className="text-[10px] border-slate-200/80 mb-2">{p.category}</Badge>
                                        <h3 className="text-[14px] font-semibold text-foreground leading-snug group-hover:text-[var(--gold)] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            {p.title}
                                        </h3>
                                        <p className="text-[12px] text-muted-foreground mt-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            {p.readTime}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </article>
            </main>
            <Footer />
        </div>
    );
};

export default BlogArticle;
