// app/blog/[id]/page.tsx
import Link from 'next/link'
import { ArrowLeft, User, Clock, ShieldCheck, SearchCheck, MessageCircle, ChevronRight, MapPin, Mail } from 'lucide-react'

// 1. 获取数据的核心函数（已修正环境变量 + ISR）
async function getPost(slug: string) {
  const query = `
    query GetPostBySlug($slug: String!) {
      posts(where: { name: $slug }, first: 1) {
        nodes {
          title
          date
          content
          excerpt
          featuredImage { node { sourceUrl } }
          categories { nodes { name } }
        }
      }
    }
  `;
  
  try {
    // 使用服务端环境变量，并开启 ISR 缓存
    const res = await fetch(process.env.WORDPRESS_API_URL as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { slug } }),
      next: { revalidate: 3600 } // 每小时重新验证一次
    });
    const json = await res.json();
    return { error: null, data: json.data?.posts?.nodes[0] };
  } catch (error: any) {
    return { error: error.message || "Network connection failed", data: null };
  }
}

// 2. 详情页主组件
export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.id);
  
  const result = await getPost(decodedSlug);
  const post = result.data;

  if (!post) {
    return (
      <div className="min-h-screen bg-carbon-black flex flex-col items-center justify-center text-foreground p-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">404 - POST NOT FOUND</h1>
        <p className="text-muted-foreground mb-8 font-mono text-sm bg-carbon-dark p-4 rounded-lg border border-carbon-light max-w-xl text-center">
          Attempted Slug: <span className="text-accent-orange break-all">{decodedSlug}</span>
        </p>
        <Link href="/#blog" className="text-accent-green hover:text-accent-green/80 transition-colors uppercase tracking-widest font-bold text-sm flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Return to Insights
        </Link>
      </div>
    );
  }

  const formattedDate = post.date 
    ? new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() 
    : 'UNKNOWN DATE';

  return (
    <main className="relative min-h-screen bg-carbon-black selection:bg-accent-green/30">
      
      {/* 导航 */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-carbon-light bg-carbon-black/90 border-opacity-80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-foreground">NEX</span><span className="text-accent-green">RIK</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-wider">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">The Model</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Specs</Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Solutions</Link>
            <Link href="/#blog" className="text-accent-green hover:text-accent-green/80 transition-colors">Insights</Link>
            <Link href="/#rfq" className="bg-accent-green text-carbon-black px-6 py-2 rounded-md hover:bg-accent-green/90 transition-all">Request a Quote</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-carbon-texture relative border-b border-carbon-light">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-carbon-black/80 to-carbon-black"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          
          <Link href="/#blog" className="inline-flex items-center gap-2 text-accent-green hover:text-accent-green/80 mb-10 font-mono text-xs uppercase tracking-widest transition-colors duration-300">
            <ArrowLeft className="w-4 h-4" /> Back to Technical Insights
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-xs font-mono">
              <span className="bg-accent-green text-carbon-black px-3 py-1 rounded-sm font-bold uppercase tracking-wider">
                {post.categories?.nodes[0]?.name || 'Material Science'}
              </span>
              <span className="text-muted-foreground flex items-center gap-2">
                <Clock className="w-3 h-3" /> {formattedDate}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight tracking-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 border-t border-carbon-light pt-6 mt-6">
              <div className="w-12 h-12 rounded-full bg-carbon-medium border border-carbon-light flex items-center justify-center text-muted-foreground">
                <User className="w-6 h-6" />
              </div>
              <div className="text-xs uppercase tracking-widest">
                <p className="font-bold text-foreground mb-1 text-sm">Alex Li</p>
                <p className="text-accent-green">Lead Engineer & QC Director</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <section className="py-16 bg-carbon-black">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col lg:flex-row gap-12">
          
          {/* 左侧：正文区域 */}
          <article className="lg:w-2/3">
            {post.featuredImage && (
              <div className="w-full h-[300px] md:h-[450px] overflow-hidden rounded-xl border border-carbon-light mb-12 relative group">
                <div className="absolute inset-0 bg-accent-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                <img 
                  src={post.featuredImage.node.sourceUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}

            <div 
              className="wp-content text-muted-foreground text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />

            <div className="mt-16 p-8 md:p-12 bg-carbon-medium rounded-xl border border-carbon-light relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold text-foreground mb-3">Discuss Your Specific Requirements</h3>
                 <p className="text-muted-foreground text-sm mb-8 max-w-md leading-relaxed">
                   Stop guessing with standard tolerances. Let our engineering team review your CAD files for actionable DFM feedback.
                 </p>
                 <Link href="/#rfq" className="inline-block bg-accent-green text-carbon-black px-8 py-3 rounded-md font-bold uppercase tracking-wider hover:bg-accent-green/90 transition-all text-sm">
                   Request Engineering Review
                 </Link>
               </div>
            </div>
          </article>

          {/* 右侧：专业侧边栏 */}
          <aside className="lg:w-1/3">
            <div className="sticky top-32 space-y-8">
              
              {/* 模块 1：合规与资质徽章 */}
              <div className="bg-carbon-medium p-6 md:p-8 rounded-xl border border-carbon-light">
                <h4 className="text-accent-green text-xs font-bold uppercase tracking-widest mb-6 border-b border-carbon-light pb-3">
                  Production Standards
                </h4>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-carbon-dark p-2 rounded border border-carbon-light">
                      <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground mb-1">US LLC Operations</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Legally bound contracts and secure IP protection for all designs.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-carbon-dark p-2 rounded border border-carbon-light">
                      <SearchCheck className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground mb-1">100% Dimensional QC</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Every batch includes full CMM reporting and surface porosity checks.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 模块 2：工程师直联通道 — 与模块 1 样式完全统一，按钮改为绿色高亮 */}
              <div className="bg-carbon-medium p-6 md:p-8 rounded-xl border border-carbon-light">
                <h4 className="text-accent-green text-xs font-bold uppercase tracking-widest mb-6 border-b border-carbon-light pb-3">
                  Direct Engineer Line
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Skip the sales reps. Send your technical specs directly to our lead engineer for immediate feasibility analysis.
                </p>
                <a 
                  href="https://wa.me/+8618566177545" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 w-full bg-accent-green text-carbon-black py-3 px-4 rounded-md font-bold text-sm hover:bg-white transition-colors uppercase tracking-wider"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Consult
                </a>
              </div>

            </div>
          </aside>

        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-carbon-dark">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground uppercase tracking-tight">
            Stay Updated
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Get the latest composite engineering insights delivered to your inbox. No spam, just technical knowledge.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-carbon-medium border border-carbon-light rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent-green focus:ring-1 focus:ring-accent-green outline-none text-sm"
            />
            <button 
              type="button"
              className="bg-accent-green text-carbon-black px-8 py-3 rounded-lg font-bold text-sm hover:bg-accent-green/90 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
            >
              Subscribe <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* --- 页脚 (背景色已改为 bg-gray-950，与内容区区分) --- */}
      <footer className="bg-[#050505] border-t border-white/15 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
            <div className="lg:col-span-1">
              <a href="#" className="text-2xl font-bold tracking-tight mb-5 inline-block">
                <span className="text-white">NEX</span><span className="text-[#a0f900]">RIK</span>
              </a>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">Precision carbon fiber solutions. Backed by US compliance, driven by direct engineering expertise from Asia-Pacific.</p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/15 flex items-center justify-center text-gray-400 hover:text-[#a0f900] hover:border-[#a0f900]/30 transition-all text-sm">
                  <i className="fa fa-linkedin"></i>
                </a>
                <a href="https://wa.me/+8618566177545" className="w-8 h-8 rounded-lg bg-white/5 border border-white/15 flex items-center justify-center text-gray-400 hover:text-[#a0f900] hover:border-[#a0f900]/30 transition-all text-sm">
                  <i className="fa fa-whatsapp"></i>
                </a>
              </div>
            </div>
 
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-5">Navigation</h4>
              <ul className="space-y-3 text-sm">
                {[['#about', 'The Nexrik Model'], ['#products', 'Capabilities'], ['#technical', 'Material Data'], ['#blog', 'Technical Articles'], ['#rfq', 'Get a Quote']].map(([href, label]) => (
                  <li key={href}><a href={href} className="text-gray-300 hover:text-[#a0f900] transition-colors">{label}</a></li>
                ))}
              </ul>
            </div>
 
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-5">Industries</h4>
              <ul className="space-y-3 text-sm">
                {['Aerospace & Defense', 'Autonomous Systems (UAV)', 'Performance Automotive', 'Medical Devices', 'Industrial Robotics', 'Precision Instrumentation'].map(l => (
                  <li key={l}><a href="#products" className="text-gray-300 hover:text-[#a0f900] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
 
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-5">Contact</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3 text-gray-300">
                  <i className="fa fa-map-marker text-[#a0f900]/80 mt-0.5 flex-shrink-0"></i>
                  <span>Nexrik LLC, Wyoming, USA<br /><span className="text-gray-400 text-xs">Engineering Office: Asia Pacific</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa fa-envelope text-[#a0f900]/80 flex-shrink-0"></i>
                  <a href="mailto:info@nexrik.com" className="text-gray-300 hover:text-[#a0f900] transition-colors">info@nexrik.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa fa-whatsapp text-[#a0f900]/80 flex-shrink-0"></i>
                  <a href="https://wa.me/+8618566177545" className="text-gray-300 hover:text-[#a0f900] transition-colors">+86 185 6617 7545</a>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-white/15">
                <a href="#rfq" className="inline-flex items-center gap-2 bg-[#a0f900] text-black px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#b8ff1a] transition-all">
                  <i className="fa fa-file-text-o"></i> Get a Quote
                </a>
              </div>
            </div>
          </div>
 
          <div className="border-t border-white/15 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs font-mono">© 2026 NEXRIK LLC. All rights reserved.</p>
            <div className="flex gap-6 text-xs">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">NDA Template</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}