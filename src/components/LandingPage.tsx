import React, { useState, useEffect } from 'react';
import type { Product, Course } from '../types/index.js';
import { apiRequest } from '../lib/api.js';
import { Button } from './ui/Button.js';
import { ProductCard } from './ui/ProductCard.js';
import { CourseCard } from './ui/CourseCard.js';
import {
  ShieldCheck,
  TrendingUp,
  Truck,
  Building2,
  CheckCircle,
  GraduationCap,
  ArrowRight,
  MapPin,
  ChevronRight,
  HelpCircle,
  FileText
} from 'lucide-react';

interface LandingPageProps {
  navigate: (path: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate, onSelectProduct }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [announcement, setAnnouncement] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, courseRes, contentRes] = await Promise.all([
          apiRequest<{ products: Product[] }>('/api/products?status=PUBLISHED'),
          apiRequest<{ courses: Course[] }>('/api/courses'),
          apiRequest<{ content: Array<{ key: string; headline: string }> }>('/api/site-content'),
        ]);
        setFeaturedProducts(prodRes.products.slice(0, 3));
        setFeaturedCourses(courseRes.courses.slice(0, 2));
        if (contentRes.content && contentRes.content.length > 0) {
          setAnnouncement(contentRes.content[0].headline);
        }
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="bg-[#F8FAF9]">
      {/* Editorial Announcement Banner */}
      {announcement && (
        <div className="bg-[#176B3A] text-white py-2.5 px-4 text-xs font-medium text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span className="font-bold uppercase tracking-wider text-emerald-200">Executive Notice:</span>
            <span>{announcement}</span>
            <button
              onClick={() => navigate('/products')}
              className="underline hover:text-emerald-100 font-semibold ml-2 cursor-pointer"
            >
              Inspect Listings
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-[#DCE8DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#176B3A] tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Institutional Wealth Creation, Enterprise Assets & Executive Education</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#17231C] leading-[1.1] text-balance">
                Building Defensible Wealth Through Real Assets, Enterprise & Knowledge.
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
                WEALTHFARM provides an integrated ecosystem for commercial asset ownership, enterprise logistics, sustainable agribusiness infrastructure, verified operational tasks, and executive investment education for Nigerian entrepreneurs, professionals, and forward-thinking businesses.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button variant="primary" size="lg" onClick={() => navigate('/products')}>
                  <span>Inspect Commercial Assets</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/ecosystem')}>
                  Explore Wealth Ecosystem
                </Button>
              </div>

              {/* Claim-to-Proof Adjacency Strip */}
              <div className="pt-6 border-t border-[#DCE8DF] grid grid-cols-3 gap-6 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[#17231C] tabular-nums">100%</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Title Due Diligence & Legal Searches</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[#17231C] tabular-nums">₦400M+</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Commercial Asset Valuations Catalogued</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[#17231C] tabular-nums">0%</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Speculative Schemes (Real Assets & Skills Only)</div>
                </div>
              </div>
            </div>

            {/* Right Column: High-Impact Real Asset Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#DCE8DF] shadow-xl bg-white aspect-4/3 lg:aspect-square">
                <img
                  src="/src/assets/images/wealthfarm_hero_1792745951252.jpg"
                  alt="Modern Nigerian Commercial Agribusiness and Enterprise Estate"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17231C]/90 via-[#17231C]/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                    Integrated Commercial Asset Cluster
                  </div>
                  <div className="text-base font-bold">Sagamu-Benin Enterprise & Agro Corridor</div>
                  <div className="text-xs text-neutral-300 mt-1">
                    Demarcated commercial real estate, logistics staging hubs, and precision processing infrastructure.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Bento Section */}
      <section className="py-20 bg-white border-b border-[#DCE8DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-2">
              The WealthFarm Pillars
            </div>
            <h2 className="text-3xl font-extrabold text-[#17231C] tracking-tight">
              An Integrated Wealth Creation & Enterprise Infrastructure
            </h2>
            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
              We empower sustainable wealth generation across tangible commercial real estate, logistics fleets, scalable enterprise infrastructure, verified operational tasks, and executive capacity building.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1 */}
            <div className="p-6 rounded-2xl bg-[#F8FAF9] border border-[#DCE8DF] hover:border-[#176B3A] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#EEF7F0] text-[#176B3A] flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#17231C] mb-2">
                01. Commercial Real Estate & Land
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                We catalogue only physical land assets, agribusiness tracts, and commercial logistics parcels backed by verified Certificates of Occupancy (C of O), Governor’s Consents, and registered perimeter cadastral surveys.
              </p>
              <button
                type="button"
                onClick={() => navigate('/products?cat=property')}
                className="text-xs font-semibold text-[#176B3A] hover:underline flex items-center gap-1"
              >
                <span>View Real Estate & Parcels</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Box 2 */}
            <div className="p-6 rounded-2xl bg-[#F8FAF9] border border-[#DCE8DF] hover:border-[#176B3A] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#EEF7F0] text-[#176B3A] flex items-center justify-center mb-4">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#17231C] mb-2">
                02. Logistics, Fleet & Supply Chains
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                Certified commercial haulage trucks, refrigerated supply-chain vehicles, and enterprise transport assets equipped with GPS telematics and operational logging to power Nigerian distribution.
              </p>
              <button
                type="button"
                onClick={() => navigate('/products?cat=vehicle')}
                className="text-xs font-semibold text-[#176B3A] hover:underline flex items-center gap-1"
              >
                <span>Inspect Fleet Assets</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Box 3 */}
            <div className="p-6 rounded-2xl bg-[#F8FAF9] border border-[#DCE8DF] hover:border-[#176B3A] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#EEF7F0] text-[#176B3A] flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#17231C] mb-2">
                03. Wealth Creation & Executive Academy
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                Executive masterclasses in asset ownership, financial modeling, digital business ventures, and commercial agribusiness economics. Practical, grounded skills for enduring success.
              </p>
              <button
                type="button"
                onClick={() => navigate('/learning')}
                className="text-xs font-semibold text-[#176B3A] hover:underline flex items-center gap-1"
              >
                <span>Explore Masterclasses</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Approved Products */}
      <section className="py-20 border-b border-[#DCE8DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-1">
                Approved Commercial Asset Catalog
              </div>
              <h2 className="text-3xl font-extrabold text-[#17231C] tracking-tight">
                Featured Wealth-Building Commercial Assets
              </h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/products')}>
              Browse All Listings ({featuredProducts.length}+)
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => {
                  onSelectProduct(p);
                  navigate(`/products/${p.slug}`);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white border-b border-[#DCE8DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-2">
              Institutional Framework
            </div>
            <h2 className="text-3xl font-extrabold text-[#17231C] tracking-tight">
              From Asset Due Diligence to Sustainable Ownership
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#176B3A] text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-base text-[#17231C]">Rigorous Due Diligence</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Legal and technical audits of title deeds, cadastral coordinates, physical asset roadworthiness, and zoning permits.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#176B3A] text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-base text-[#17231C]">Transparent Order Allocation</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Server-side price verification and institutional Paystack settlement with tamper-evident purchase contracts.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#176B3A] text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-base text-[#17231C]">Operational Tasks & Audits</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Assign and monitor property surveys, vehicle telematics checklists, and business feasibility tasks with verified review.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#176B3A] text-white flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="font-bold text-base text-[#17231C]">Executive Education</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Continuous financial literacy, enterprise management frameworks, and strategic off-taker coordination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-20 border-b border-[#DCE8DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-1">
                  Executive Capacity Building
                </div>
                <h2 className="text-3xl font-extrabold text-[#17231C] tracking-tight">
                  Wealth Creation & Executive Masterclasses
                </h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/learning')}>
                View Academy Curriculum
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredCourses.map((c) => (
                <CourseCard
                  key={c.id}
                  course={c}
                  onSelect={(course) => navigate(`/learning/${course.id}`)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ & Anti-Ponzi Integrity Guarantee */}
      <section className="py-20 bg-white border-b border-[#DCE8DF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-2">
              Institutional Governance
            </div>
            <h2 className="text-3xl font-extrabold text-[#17231C] tracking-tight">
              Frequently Asked Questions & Standards
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-[#DCE8DF] bg-[#F8FAF9]">
              <h3 className="font-bold text-sm text-[#17231C] flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-[#176B3A]" />
                Does WealthFarm offer guaranteed percentage returns, interest rates, or passive yield funds?
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed pl-6">
                <strong>No.</strong> WEALTHFARM is an enterprise wealth creation platform, asset marketplace, and executive academy. We do not operate as a collective investment scheme, and we strictly prohibit any promised returns, crowdsourced dividend schemes, or speculative interest payouts. Users acquire physical titled real estate, commercial transport assets, precision equipment, or educational curriculum directly.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#DCE8DF] bg-[#F8FAF9]">
              <h3 className="font-bold text-sm text-[#17231C] flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-[#176B3A]" />
                What pathways to wealth creation are represented on the platform?
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed pl-6">
                WealthFarm bridges multiple legitimate pillars of wealth: direct commercial land and real estate ownership, logistics and haulage fleet assets, controlled-environment enterprise infrastructure, practical business operational tasks, and executive investment education spanning financial modeling and venture development.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#DCE8DF] bg-[#F8FAF9]">
              <h3 className="font-bold text-sm text-[#17231C] flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-[#176B3A]" />
                How are commercial property titles and asset documentation verified?
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed pl-6">
                Every listed property undergoes physical cadastral charting by registered Nigerian surveyors, official title search at the relevant State Land Registry (e.g. Ogun State Bureau of Lands or Lagos State Lands Bureau), and legal certification prior to publication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#17231C] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Build Enduring Wealth Through Real Assets and Skills?
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Create your institutional account to inspect property survey coordinates, review commercial logistics assets, access verified enterprise tasks, and enroll in certified executive masterclasses.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
              Create Member Account
            </Button>
            <Button variant="outline" size="lg" className="border-neutral-700 text-white hover:bg-neutral-800" onClick={() => navigate('/contact')}>
              Request Directorate Briefing
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
