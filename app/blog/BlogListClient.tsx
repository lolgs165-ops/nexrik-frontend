'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Article {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  imageUrl: string;
  excerpt: string;
}

export default function BlogListClient({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 假设后端还有更多

  // 分类从已加载的文章中提取
  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const offset = articles.length; // 当前已有数量
      const res = await fetch(`/api/articles?offset=${offset}`);
      const data = await res.json();
      if (data.articles.length === 0) {
        setHasMore(false);
      } else {
        setArticles(prev => [...prev, ...data.articles]);
      }
    } catch (err) {
      console.error('Load more failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-carbon-black text-gray-200 min-h-screen">
      {/* 导航栏（与主页完全一致） */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-carbon-light bg-carbon-black/80 border-opacity-80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-white">NEX</span><span className="text-accent-green">RIK</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium uppercase tracking-wider">
            <Link href="/#about" className="text-gray-200 hover:text-white transition-colors">The Model</Link>
            <Link href="/#process" className="text-gray-200 hover:text-white transition-colors">Process</Link>
            <Link href="/#technical" className="text-gray-200 hover:text-white transition-colors">Specs</Link>
            <Link href="/#products" className="text-gray-200 hover:text-white transition-colors">Solutions</Link>
            <Link href="/blog" className="text-accent-green hover:text-accent-green/80 transition-colors">Insights</Link>
            <Link href="/#rfq" className="bg-accent-green text-carbon-black px-6 py-2 rounded-md hover:bg-opacity-90 transition-all">Request a Quote</Link>
          </div>
        </div>
      </nav>

      {/* 页面头部 */}
      <section className="pt-32 pb-16 bg-carbon-black border-b border-carbon-light">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-tight">Technical Insights</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Engineering deep dives from 10+ years of composite manufacturing. No marketing fluff, just straight technical advice.
          </p>
        </div>
      </section>

      {/* 搜索与过滤栏 */}
      <section className="py-8 bg-carbon-dark border-b border-carbon-light sticky top-[73px] z-40 backdrop-blur-sm bg-carbon-dark/80">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-80">
              <i className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-carbon-medium border border-carbon-light rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-accent-green focus:ring-1 focus:ring-accent-green outline-none text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    activeCategory === cat
                      ? 'bg-accent-green text-carbon-black'
                      : 'bg-carbon-medium text-gray-400 border border-carbon-light hover:text-white hover:border-accent-green'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 文章列表网格 */}
      <section className="py-16 bg-carbon-black">
        <div className="container mx-auto px-4 max-w-7xl">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <i className="fa fa-file-text-o text-5xl text-gray-700 mb-6"></i>
              <h3 className="text-2xl font-bold text-white mb-2">No articles found</h3>
              <p className="text-gray-400">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map(article => (
                  <Link
                    href={`/blog/${article.slug}`}
                    key={article.id}
                    className="group bg-carbon-medium rounded-lg border border-carbon-light overflow-hidden hover:border-accent-green transition-all duration-300 flex flex-col"
                  >
                    <div className="h-52 overflow-hidden relative">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-carbon-black/80 backdrop-blur border border-carbon-light text-white px-3 py-1 rounded-sm text-xs font-mono">
                        {article.date}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-[10px] font-bold text-accent-green uppercase tracking-widest mb-3">
                        {article.category}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-green transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="mt-auto text-accent-silver text-sm font-bold uppercase flex items-center group-hover:text-white transition-colors">
                        Read Article <i className="fa fa-long-arrow-right ml-2"></i>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 加载更多按钮 */}
              {hasMore && (
                <div className="mt-12 text-center">
                    <button
                    onClick={loadMore}
                    disabled={loading}
                    className="min-w-[220px] px-8 py-3 bg-carbon-medium border border-carbon-light rounded-lg text-sm font-bold uppercase tracking-widest text-gray-300 hover:border-accent-green hover:text-white transition-all disabled:opacity-50 inline-flex items-center justify-center"
                    >
                    {loading ? (
                        <>
                        <i className="fa fa-spinner fa-spin mr-2"></i> Loading...
                        </>
                    ) : (
                        <>
                        Load More Articles <i className="fa fa-arrow-down ml-2"></i>
                        </>
                    )}
                    </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* 底部订阅区（保持原样） */}
      <section className="py-16 bg-carbon-dark">
        {/* ... 与之前完全一致，省略 ... */}
      </section>

      {/* 页脚（保持原样） */}
      <footer className="bg-[#050505] border-t border-white/15 py-16">
        {/* ... 与之前完全一致，省略 ... */}
      </footer>
    </main>
  );
}