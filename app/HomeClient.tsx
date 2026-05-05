'use client';

import { useState, useEffect, useRef } from 'react';

interface Product {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  tagColor: string;
}

interface Article {
  id: string;
  title: string;
  date: string;
  category: string;
  imageUrl: string;
  excerpt: string;
}

export default function HomeClient({
  initialProducts,
  initialArticles,
}: {
  initialProducts: Product[];
  initialArticles: Article[];
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [refNumber, setRefNumber] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // 直接用服务端传入的初始数据，不再有本地预设
  const [products] = useState<Product[]>(initialProducts);
  const [articles] = useState<Article[]>(initialArticles);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 滚动动画
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('pre-animation');
          entry.target.classList.add('animate-slide-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  };
  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  const handleRfqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setRefNumber('NX-' + Math.floor(100000 + Math.random() * 900000));
      setFormStatus('success');
      setSelectedFiles([]);
      if (formRef.current) formRef.current.reset();
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <main className="relative">
      {/* --- 悬浮按钮 --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4">
        <a href="#rfq" className="w-14 h-14 bg-carbon-medium border border-carbon-light rounded-full flex items-center justify-center text-accent-silver hover:text-white hover:border-accent-silver hover:scale-110 transition-all shadow-lg group relative">
          <i className="fa fa-envelope text-2xl"></i>
          <span className="absolute right-full mr-4 bg-carbon-dark text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-carbon-light">Email Us</span>
        </a>
        <a href="https://wa.me/+8618566177545" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-accent-green rounded-full flex items-center justify-center text-carbon-black hover:bg-opacity-90 hover:scale-110 transition-all shadow-[0_0_15px_rgba(160,249,0,0.4)] group relative">
          <i className="fa fa-whatsapp text-3xl"></i>
          <span className="absolute right-full mr-4 bg-carbon-dark text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-carbon-light">WhatsApp Us</span>
        </a>
      </div>

      {/* --- 导航栏 --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-carbon-light transition-all duration-300 ${isScrolled ? 'bg-carbon-black/70 border-opacity-80' : 'bg-carbon-black/30 border-opacity-20'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
          <a href="#" className="text-2xl font-bold tracking-tight">
            <span className="text-white">NEX</span><span className="text-accent-green">RIK</span>
          </a>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium uppercase tracking-wider">
            <a href="#about" className="text-gray-200 hover:text-white transition-colors">The Model</a>
            <a href="#process" className="text-gray-200 hover:text-white transition-colors">Process</a>
            <a href="#technical" className="text-gray-200 hover:text-white transition-colors">Specs</a>
            <a href="#products" className="text-gray-200 hover:text-white transition-colors">Solutions</a>
            <a href="/blog" className="text-gray-200 hover:text-white transition-colors">Insights</a>
            <a href="#rfq" className="bg-accent-green text-carbon-black px-6 py-2 rounded-md hover:bg-opacity-90 transition-all">Request a Quote</a>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-200"><i className="fa fa-bars text-xl"></i></button>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-carbon-dark/95 backdrop-blur-md border-t border-carbon-light">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4 text-sm font-medium uppercase">
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-200 py-2">The Model</a>
              <a href="#process" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-200 py-2">Process</a>
              <a href="#technical" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-200 py-2">Specs</a>
              <a href="#products" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-200 py-2">Solutions</a>
              <a href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-200 py-2">Insights</a>
              <a href="#rfq" onClick={() => setIsMobileMenuOpen(false)} className="bg-accent-green text-carbon-black px-6 py-2 rounded-md text-center">Request a Quote</a>
            </div>
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex flex-col justify-center bg-carbon-texture">
        <div className="absolute inset-0 bg-carbon-texture-overlay"></div>
        <div className="container mx-auto px-4 max-w-7xl z-10 flex-1 flex flex-col justify-center py-24 md:py-28 lg:py-32">
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-5 text-shadow leading-tight">
              Carbon Fiber Parts Done Right.<br />
              <span className="text-accent-green">By Engineers, For Engineers.</span>
            </h1>
            <p className="text-base md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Backed by a US LLC for secure contracting, and driven by 10+ years of hands-on manufacturing expertise. 
              We provide direct engineering oversight where the parts are made—ensuring factory-direct pricing with Western-level accountability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 font-bold text-sm mb-8">
              <a href="#rfq" className="bg-accent-green text-carbon-black px-8 py-4 rounded-md hover:bg-opacity-90 transition-all text-center tracking-widest uppercase">GET A TECHNICAL QUOTE</a>
              <a href="#about" className="border-2 border-white text-white px-8 py-4 rounded-md hover:bg-white/10 transition-all text-center tracking-widest uppercase">THE NEXRIK MODEL</a>
            </div>
            <div className="mb-10">
              <ul className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 text-sm text-gray-300">
                <li className="flex items-center"><i className="fa fa-check-circle text-accent-green mr-2"></i>Prototype to 10k+ Units</li>
                <li className="hidden sm:block mx-3 text-gray-600">|</li>
                <li className="flex items-center"><i className="fa fa-check-circle text-accent-green mr-2"></i>Direct Engineer Communication</li>
                <li className="hidden sm:block mx-3 text-gray-600">|</li>
                <li className="flex items-center"><i className="fa fa-check-circle text-accent-green mr-2"></i>Full Traceability & PPAP Support</li>
              </ul>
            </div>
            <div>
              <p className="text-gray-300 text-xs font-bold uppercase tracking-[0.3em] mb-5 opacity-70">COMPLIANCE & ENGINEERING STANDARDS</p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <div className="flex items-center space-x-3"><i className="fa fa-shield text-accent-silver/70 text-xl"></i><span className="font-mono text-sm font-medium text-gray-200">US Registered LLC</span></div>
                <div className="flex items-center space-x-3"><i className="fa fa-certificate text-accent-silver/70 text-xl"></i><span className="font-mono text-sm font-medium text-gray-200">ISO 9001:2015 QC</span></div>
                <div className="flex items-center space-x-2"><span className="text-lg font-bold text-accent-orange/80 font-mono tracking-tighter uppercase">Torayca®</span><span className="text-xs text-gray-300 font-sans tracking-widest uppercase">Authorized Materials</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- The Nexrik Model --- */}
      <section id="about" className="py-24 bg-carbon-black">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 animate-on-scroll pre-animation">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 uppercase tracking-tight">The Nexrik Model</h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              We built Nexrik to solve the biggest problem in offshore B2B sourcing: <span className="text-white font-medium">Balancing legal security with manufacturing agility.</span> Here is how our hybrid structure protects your IP while delivering uncompromised quality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-on-scroll pre-animation items-stretch mb-24">
            <div className="bg-carbon-medium border border-accent-green/50 rounded-xl p-10 hover:border-accent-green transition-all duration-500 relative overflow-hidden shadow-[0_0_30px_rgba(160,249,0,0.05)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent-green/5 to-transparent rounded-bl-full"></div>
              <div className="text-accent-green text-4xl mb-6"><i className="fa fa-bank"></i></div>
              <h3 className="text-2xl font-bold text-white mb-4">Nexrik LLC (United States)</h3>
              <p className="text-accent-green text-xs font-bold uppercase tracking-widest mb-6">Commercial & Legal Hub</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Your business relationship is with a registered United States entity. This isn&apos;t just for show—it means your IP is protected under Western legal standards, and your payments are processed securely through a US corporate bank.
              </p>
              <ul className="space-y-4 text-sm font-medium text-gray-300">
                <li className="flex items-center"><i className="fa fa-check-circle text-accent-green mr-3 text-lg"></i> Enforceable Non-Disclosure Agreements (NDAs)</li>
                <li className="flex items-center"><i className="fa fa-check-circle text-accent-green mr-3 text-lg"></i> Secure US Corporate Banking (No sketchy wire transfers)</li>
                <li className="flex items-center"><i className="fa fa-check-circle text-accent-green mr-3 text-lg"></i> Seamless vendor onboarding for Western companies</li>
              </ul>
            </div>

            <div className="bg-carbon-medium border border-accent-green/50 rounded-xl p-10 hover:border-accent-green transition-all duration-500 relative overflow-hidden shadow-[0_0_30px_rgba(160,249,0,0.05)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent-green/10 to-transparent rounded-bl-full"></div>
              <div className="text-accent-green text-4xl mb-6"><i className="fa fa-cogs"></i></div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Directed by <span className="text-accent-green">Alex Chen</span>
              </h3>
              <p className="text-accent-green text-xs font-bold uppercase tracking-widest mb-6">
                Lead Engineer | 10+ Year Toray Composite Experience
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                We are permanently stationed in the heart of Asia&apos;s composite manufacturing hub. By operating fabless, we leverage an agile network of 12+ specialized CNC, Autoclave, and Molding facilities, routing your CAD to the perfect machine for your project size and requirements.
              </p>
              <ul className="space-y-4 text-sm font-medium text-gray-300">
                <li className="flex items-center"><i className="fa fa-check-circle text-accent-green mr-3 text-lg"></i> Engineer-to-Engineer Communication (No sales reps)</li>
                <li className="flex items-center"><i className="fa fa-check-circle text-accent-green mr-3 text-lg"></i> We personally review your DFM and tolerances</li>
                <li className="flex items-start">
                  <i className="fa fa-check-circle text-accent-green mr-3 text-lg mt-1"></i>
                  <span>Our on-site engineering team conducts in-process inspections and <strong className="text-white">signs off on every shipment</strong> with photos and a dimensional report.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* --- How We Deliver --- */}
          <div className="text-center mb-14 animate-on-scroll pre-animation">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Deliver</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              No corporate red tape. Just direct access to the engineering team overseeing your entire project — from first review to final delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-on-scroll pre-animation">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
              <div className="bg-carbon-medium p-5 rounded-lg border border-carbon-light hover:border-accent-green transition-all">
                <div className="text-accent-green text-2xl mb-3"><i className="fa fa-comments-o"></i></div>
                <h4 className="text-lg font-semibold mb-1.5">Engineer-to-Engineer</h4>
                <p className="text-gray-400 text-xs leading-relaxed">You talk directly to our engineering team. No sales middlemen who don&apos;t understand your requirements.</p>
              </div>
              <div className="bg-carbon-medium p-5 rounded-lg border border-carbon-light hover:border-accent-green transition-all">
                <div className="text-accent-green text-2xl mb-3"><i className="fa fa-search-plus"></i></div>
                <h4 className="text-lg font-semibold mb-1.5">100% Quality Control</h4>
                <p className="text-gray-400 text-xs leading-relaxed">We inspect every part ourselves. If it doesn&apos;t meet our standards, it gets remade. No exceptions.</p>
              </div>
              <div className="bg-carbon-medium p-5 rounded-lg border border-carbon-light hover:border-accent-green transition-all">
                <div className="text-accent-green text-2xl mb-3"><i className="fa fa-cubes"></i></div>
                <h4 className="text-lg font-semibold mb-1.5">Flexible Order Quantities</h4>
                <p className="text-gray-400 text-xs leading-relaxed">From 1-piece prototypes to 10,000+ units. We scale with your project from R&D to mass production.</p>
              </div>
              <div className="bg-carbon-medium p-5 rounded-lg border border-carbon-light hover:border-accent-green transition-all">
                <div className="text-accent-green text-2xl mb-3"><i className="fa fa-bolt"></i></div>
                <h4 className="text-lg font-semibold mb-1.5">4-Hour Response</h4>
                <p className="text-gray-400 text-xs leading-relaxed">Most technical inquiries get a detailed response within 4 hours. Emergency support available 24/7.</p>
              </div>
            </div>

            <div className="relative pl-10">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-accent-green via-[#CFBA00] to-accent-orange rounded-full"></div>

              <div className="relative mb-10">
                <div className="absolute -left-10 top-1 w-6 h-6 rounded-full bg-accent-green flex items-center justify-center shadow-md shadow-black/50">
                  <span className="font-mono font-bold text-carbon-black text-xs">1</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Technical Review & Quotation</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We personally review your CAD files and specifications. You&apos;ll receive a detailed quote with material options, lead times and cost breakdowns within 24 hours.
                </p>
              </div>

              <div className="relative mb-10">
                <div className="absolute -left-10 top-1 w-6 h-6 rounded-full bg-[#CFBA00] flex items-center justify-center shadow-md shadow-black/50">
                  <span className="font-mono font-bold text-carbon-black text-xs">2</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Production & On-site Supervision</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We work directly with our trusted manufacturing partners. Our on-site team monitors production to ensure your specifications are followed exactly.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-10 top-1 w-6 h-6 rounded-full bg-accent-orange flex items-center justify-center shadow-md shadow-black/50">
                  <span className="font-mono font-bold text-carbon-black text-xs">3</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Final Inspection & Delivery</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We perform a 100% dimensional and visual inspection on every part. You&apos;ll get photos and inspection reports before shipping to your door.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 材料表 --- */}
      <section id="technical" className="py-20 bg-carbon-dark overflow-hidden border-t border-carbon-light">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 animate-on-scroll pre-animation">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight">Material Performance Data</h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-base font-light mb-6">Benchmarked against genuine Torayca® specifications. We only source materials from certified suppliers and verify every batch ourselves.</p>
            <div className="inline-block bg-accent-green/10 border border-accent-green/20 px-6 py-3 rounded mb-8">
              <p className="text-accent-green text-sm font-semibold tracking-wide"><i className="fa fa-info-circle mr-2"></i> Transparent Pricing: We provide both authentic Torayca® and high-performance domestic equivalents.</p>
            </div>
          </div>
          
          <div className="overflow-x-auto animate-on-scroll pre-animation bg-carbon-medium rounded-lg border border-carbon-light">
            <table className="w-full border-collapse text-gray-200">
              <thead>
                <tr className="bg-carbon-light/30">
                  <th className="py-5 px-8 text-left font-bold border-b border-carbon-light uppercase tracking-widest text-sm text-white">Fiber Grade</th>
                  <th className="py-5 px-8 text-left font-bold border-b border-carbon-light uppercase tracking-widest text-sm text-white">Tensile Strength (MPa)</th>
                  <th className="py-5 px-8 text-left font-bold border-b border-carbon-light uppercase tracking-widest text-sm text-white">Tensile Modulus (GPa)</th>
                  <th className="py-5 px-8 text-left font-bold border-b border-carbon-light uppercase tracking-widest text-sm text-white">Density (g/cm³)</th>
                </tr>
              </thead>
              <tbody className="text-base">
                <tr className="hover:bg-carbon-light transition-colors duration-200">
                  <td className="py-4 px-8 border-b border-carbon-light/30 flex items-center"><div className="w-3 h-3 bg-gray-500 rounded-full mr-4"></div><span className="font-medium text-gray-100">T300</span></td>
                  <td className="py-4 px-8 border-b border-carbon-light/30 font-mono text-gray-200">3,530</td>
                  <td className="py-4 px-8 border-b border-carbon-light/30 font-mono text-gray-200">230</td>
                  <td className="py-4 px-8 border-b border-carbon-light/30 font-mono text-accent-green font-bold">1.76</td>
                </tr>
                <tr className="hover:bg-carbon-light transition-colors duration-200 bg-white/5">
                  <td className="py-4 px-8 border-b border-carbon-light/30 flex items-center"><div className="w-3 h-3 bg-accent-green rounded-full mr-4"></div><span className="font-medium text-gray-100">T700S</span></td>
                  <td className="py-4 px-8 border-b border-carbon-light/30 font-mono text-gray-200">4,900</td>
                  <td className="py-4 px-8 border-b border-carbon-light/30 font-mono text-gray-200">230</td>
                  <td className="py-4 px-8 border-b border-carbon-light/30 font-mono text-gray-200">1.80</td>
                </tr>
                <tr className="hover:bg-carbon-light transition-colors duration-200 bg-white/5">
                  <td className="py-4 px-8 border-b border-carbon-light/30 flex items-center"><div className="w-3 h-3 bg-accent-green rounded-full mr-4"></div><span className="font-medium text-gray-100">T800S</span></td>
                  <td className="py-4 px-8 border-b border-carbon-light/30 font-mono text-accent-green font-bold">5,880</td>
                  <td className="py-4 px-8 border-b border-carbon-light/30 font-mono text-gray-200">294</td>
                  <td className="py-4 px-8 border-b border-carbon-light/30 font-mono text-gray-200">1.80</td>
                </tr>
                <tr className="hover:bg-carbon-light transition-colors duration-200">
                  <td className="py-4 px-8 border-b border-carbon-light/30 flex items-center"><div className="w-3 h-3 bg-accent-orange rounded-full mr-4"></div><span className="font-medium text-gray-100">M40J</span></td>
                  <td className="py-4 px-8 border-b border-carbon-light/30 font-mono text-gray-200">4,410</td>
                  <td className="py-4 px-8 border-b border-carbon-light/30 font-mono text-gray-200">377</td>
                  <td className="py-4 px-8 border-b border-carbon-light/30 font-mono text-gray-200">1.77</td>
                </tr>
                <tr className="hover:bg-carbon-light transition-colors duration-200">
                  <td className="py-4 px-8 border-b border-carbon-light/30 flex items-center"><div className="w-3 h-3 bg-accent-orange rounded-full mr-4"></div><span className="font-medium text-gray-100">M55J</span></td>
                  <td className="py-4 px-8 border-b border-carbon-light/30 font-mono text-gray-200">4,020</td>
                  <td className="py-4 px-8 border-b border-carbon-light/30 font-mono text-accent-green font-bold">540</td>
                  <td className="py-4 px-8 border-b border-carbon-light/30 font-mono text-gray-200">1.91</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- 产品展示 --- */}
  <section id="products" className="py-20 bg-carbon-black">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 animate-on-scroll pre-animation">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Composite Solutions</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From precision tubes to complex 3D geometries — every part is rigorously inspected by our resident team.
            </p>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-on-scroll pre-animation">
              {products.map(p => (
                <div key={p.id} className="group bg-carbon-medium rounded-lg border border-carbon-light overflow-hidden transition-all hover:border-accent-green">
                  <div className="relative h-64 overflow-hidden">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-4 right-4">
                      <span className="bg-carbon-black/80 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-carbon-light">
                        {p.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm">Our products are being updated. Please check back later or get in touch with our engineering team.</p>
          )}
        </div>
      </section>

      {/* --- By the Numbers --- */}
      <section className="py-20 bg-carbon-dark">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 animate-on-scroll pre-animation">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">By The Numbers</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Engineered for repeatability and trust.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-on-scroll pre-animation">
            <div className="text-center p-6">
              <div className="text-4xl md:text-5xl font-bold text-accent-green mb-2">3</div>
              <p className="text-gray-400 text-sm uppercase tracking-widest">Inspection Checkpoints per Part</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl md:text-5xl font-bold text-accent-green mb-2">98.5%</div>
              <p className="text-gray-400 text-sm uppercase tracking-widest">On-Time Delivery Rate</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl md:text-5xl font-bold text-accent-green mb-2">12+</div>
              <p className="text-gray-400 text-sm uppercase tracking-widest">Specialized Partner Facilities</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl md:text-5xl font-bold text-accent-green mb-2">15</div>
              <p className="text-gray-400 text-sm uppercase tracking-widest">Countries Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* 博客文章列表 */}
      <section id="blog" className="py-20 bg-carbon-dark">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 animate-on-scroll pre-animation">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 uppercase">Technical Insights</h2>
              <p className="text-gray-400">Engineering deep-dives from 10+ years of composite manufacturing.</p>
            </div>
            <a href="/blog" className="text-accent-green hover:text-white text-sm font-bold uppercase tracking-widest mt-4 md:mt-0 flex items-center gap-2">
              View All Articles <i className="fa fa-arrow-right"></i>
            </a>
          </div>
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-on-scroll pre-animation">
              {articles.map(article => (
                <a href={`/blog/${article.id}`} key={article.id} className="group flex flex-col bg-carbon-medium rounded-lg border border-carbon-light overflow-hidden hover:border-accent-green transition-all">
                  <div className="h-60 overflow-hidden relative">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                    <div className="absolute top-4 left-4 bg-carbon-black/80 border border-carbon-light text-white px-3 py-1 rounded-sm text-xs font-mono">{article.date}</div>
                  </div>
                  <div className="p-8">
                    <div className="text-[10px] font-bold text-accent-green uppercase tracking-widest mb-3">{article.category}</div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent-green transition-colors">{article.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">{article.excerpt}</p>
                    <div className="text-accent-silver text-sm font-bold uppercase flex items-center group-hover:text-white transition-colors">Read Article <i className="fa fa-long-arrow-right ml-2"></i></div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm">Technical articles are on the way. Subscribe to stay updated.</p>
          )}
        </div>
      </section>

      {/* --- RFQ 模块 --- */}
      <section id="rfq" className="py-24 bg-carbon-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14 animate-on-scroll pre-animation">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tight">Request an Engineering Quote</h2>
            <p className="text-gray-400 text-sm tracking-wide max-w-2xl mx-auto leading-relaxed">Our engineering team will review for DFM and respond with a detailed proposal within 24 hours.</p>
          </div>

          {formStatus !== 'success' ? (
            <div className="animate-on-scroll pre-animation">
              <form ref={formRef} onSubmit={handleRfqSubmit} className="bg-carbon-medium rounded-xl border border-carbon-light p-8 md:p-12 shadow-2xl">
                <h3 className="text-accent-green text-xs font-bold uppercase tracking-widest mb-6 border-b border-carbon-light pb-2">1. Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div><label className="block text-gray-300 mb-1.5 font-medium text-sm">Your Name *</label><input type="text" name="name" required className="w-full bg-carbon-dark border border-carbon-light rounded-lg px-4 py-3 text-white focus:border-accent-green focus:ring-1 focus:ring-accent-green outline-none text-sm" /></div>
                  <div><label className="block text-gray-300 mb-1.5 font-medium text-sm">Business Email *</label><input type="email" name="email" required className="w-full bg-carbon-dark border border-carbon-light rounded-lg px-4 py-3 text-white focus:border-accent-green focus:ring-1 focus:ring-accent-green outline-none text-sm" /></div>
                </div>
                <div className="mb-10"><label className="block text-gray-300 mb-1.5 font-medium text-sm">Company Name (Optional)</label><input type="text" name="company" className="w-full bg-carbon-dark border border-carbon-light rounded-lg px-4 py-3 text-white focus:border-accent-green focus:ring-1 focus:ring-accent-green outline-none text-sm" /></div>

                <h3 className="text-accent-green text-xs font-bold uppercase tracking-widest mb-6 border-b border-carbon-light pb-2">2. Project Scope</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-gray-300 mb-1.5 font-medium text-sm">Project Type *</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <label className="flex items-center space-x-2 bg-carbon-dark p-3 rounded-lg border border-carbon-light cursor-pointer hover:border-accent-green transition-all text-xs flex-1"><input type="radio" name="projectType" value="prototype" className="accent-accent-green" defaultChecked /><span className="text-gray-300">Prototype / Small Batch</span></label>
                      <label className="flex items-center space-x-2 bg-carbon-dark p-3 rounded-lg border border-carbon-light cursor-pointer hover:border-accent-green transition-all text-xs flex-1"><input type="radio" name="projectType" value="production" className="accent-accent-green" /><span className="text-gray-300">Mass Production</span></label>
                    </div>
                  </div>
                  <div><label className="block text-gray-300 mb-1.5 font-medium text-sm">Estimated Quantity *</label><input type="text" name="quantity" placeholder="e.g., 5 prototypes" required className="w-full bg-carbon-dark border border-carbon-light rounded-lg px-4 py-3 text-white focus:border-accent-green outline-none text-sm" /></div>
                </div>

                <div className="mb-8 p-6 bg-carbon-dark/30 rounded-xl border border-carbon-light/50">
                  <h3 className="text-accent-green text-xs font-bold uppercase tracking-widest mb-4">Composite Preferences (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['Manufacturing Process', 'Surface Pattern', 'Material Grade', 'Surface Finish'].map((label, idx) => (
                      <div key={idx}><label className="block text-gray-400 mb-1.5 text-xs">{label}</label>
                        <div className="relative">
                          <select className="w-full bg-carbon-dark border border-carbon-light rounded-lg px-3 py-2.5 text-white appearance-none focus:border-accent-green outline-none text-xs cursor-pointer">
                            <option>Recommend for me / Not sure</option>
                            {label === 'Surface Pattern' && ['3K Twill', '3K Plain', 'Forged', 'UD'].map(v => <option key={v}>{v}</option>)}
                            {label === 'Surface Finish' && ['Glossy', 'Matte', 'Raw / Machined'].map(v => <option key={v}>{v}</option>)}
                          </select>
                          <i className="fa fa-angle-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"></i>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8"><label className="block text-gray-300 mb-1.5 font-medium text-sm">Additional Details</label><textarea name="specs" rows={4} className="w-full bg-carbon-dark border border-carbon-light rounded-lg px-4 py-3 text-white focus:border-accent-green outline-none text-sm" placeholder="Tolerances, target budget, delivery dates..."></textarea></div>

                <div className="mb-10 text-center">
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-carbon-light hover:border-accent-green rounded-xl p-8 cursor-pointer transition-all bg-carbon-black/30 group">
                    <i className="fa fa-cloud-upload text-3xl text-gray-500 group-hover:text-accent-green mb-2"></i>
                    <p className="text-gray-300 font-bold uppercase text-xs tracking-widest">Upload CAD Files</p>
                    <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">{selectedFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between bg-carbon-dark p-3 rounded-lg border border-carbon-light"><span className="text-xs font-mono text-gray-300 truncate">{f.name}</span><button type="button" onClick={() => removeFile(i)} className="text-red-500 hover:text-red-400 transition-colors"><i className="fa fa-times"></i></button></div>
                    ))}</div>
                  )}
                </div>

                <div className="text-center"><button type="submit" disabled={formStatus === 'submitting'} className="w-full sm:w-auto px-16 py-4 bg-accent-green text-carbon-black rounded-lg font-bold text-sm hover:bg-white disabled:opacity-50 transition-all uppercase tracking-[0.2em]">{formStatus === 'submitting' ? 'Processing...' : 'Submit for Review'}</button><p className="text-gray-500 text-[10px] mt-4 uppercase tracking-widest"><i className="fa fa-lock mr-1"></i> Strictly Confidential under NDA</p></div>
              </form>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-carbon-medium p-16 rounded-2xl border border-accent-green text-center animate-slide-up shadow-[0_0_50px_rgba(160,249,0,0.1)]">
              <i className="fa fa-check-circle text-5xl text-accent-green mb-6"></i>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-[0.1em] text-white">RFQ Received</h3>
              <p className="text-gray-400 mb-8 text-sm">We&apos;ll respond within 24 hours. REF: <span className="text-accent-green font-mono">{refNumber}</span></p>
              <button onClick={() => setFormStatus('idle')} className="text-gray-400 hover:text-accent-green font-bold text-xs uppercase underline tracking-widest">Submit Another Request</button>
            </div>
          )}
        </div>
      </section>

      {/* --- 页脚 --- */}
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
                {[['#about', 'The Nexrik Model'], ['#products', 'Capabilities'], ['#technical', 'Material Data'], ['/blog', 'Technical Articles'], ['#rfq', 'Get a Quote']].map(([href, label]) => (
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