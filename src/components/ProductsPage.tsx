import React, { useState, useEffect } from 'react';
import type { Product, ProductCategory } from '../types/index.js';
import { apiRequest } from '../lib/api.js';
import { ProductCard } from './ui/ProductCard.js';
import { Input } from './ui/Input.js';
import { Select } from './ui/Select.js';
import { EmptyState } from './ui/EmptyState.js';
import { Search, SlidersHorizontal, Package, RefreshCw } from 'lucide-react';

interface ProductsPageProps {
  navigate: (path: string) => void;
  onSelectProduct: (product: Product) => void;
  initialCategory?: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  navigate,
  onSelectProduct,
  initialCategory,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>(initialCategory || 'all');
  const [availability, setAvailability] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'newest'>('newest');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (category !== 'all') queryParams.append('category', category);
      if (availability !== 'all') queryParams.append('availability', availability);
      if (search) queryParams.append('search', search);

      const res = await apiRequest<{ products: Product[] }>(`/api/products?${queryParams.toString()}`);
      let list = res.products;

      // Sorting
      if (sortBy === 'price_asc') {
        list.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price_desc') {
        list.sort((a, b) => b.price - a.price);
      } else {
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      setProducts(list);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, availability, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const categories = [
    { label: 'All Categories', value: 'all' },
    { label: 'Real Estate & Land', value: 'property' },
    { label: 'Logistics Fleets', value: 'vehicle' },
    { label: 'Enterprise Infrastructure', value: 'infrastructure' },
    { label: 'Business Programmes', value: 'programme' },
  ];

  return (
    <div className="bg-[#F8FAF9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-1">
            Approved Commercial Marketplace
          </div>
          <h1 className="text-3xl font-extrabold text-[#17231C] tracking-tight">
            Commercial Real Estate, Transport Fleets & Enterprise Assets
          </h1>
          <p className="mt-2 text-sm text-neutral-600 max-w-2xl">
            Inspect title-verified commercial property, interstate haulage vehicles, precision production infrastructure, and enterprise incubation programmes with audited valuation benchmarks.
          </p>
        </div>

        {/* Filter Bar conforming to interactive controls guidelines */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DCE8DF] shadow-xs space-y-4">
          {/* Category Tabs - Segmented control */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((c) => {
              const isActive = category === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#176B3A] text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-600 hover:text-[#17231C] hover:bg-neutral-200'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Search and Secondary Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <form onSubmit={handleSearchSubmit} className="sm:col-span-6 flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by location (e.g. Lagos, Ogun, Oyo), specs or title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs text-[#17231C] bg-white border border-[#DCE8DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#176B3A] rounded-lg hover:bg-[#0F4927] whitespace-nowrap"
              >
                Search
              </button>
            </form>

            <div className="sm:col-span-3">
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-white border border-[#DCE8DF] rounded-lg text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                <option value="all">All Availability</option>
                <option value="AVAILABLE">Available Now</option>
                <option value="RESERVED">Reserved</option>
                <option value="SOLD_OUT">Allocated / Sold Out</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-white border border-[#DCE8DF] rounded-lg text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                <option value="newest">Sort: Newly Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-[#DCE8DF] rounded-xl p-4 h-80 animate-pulse">
                <div className="w-full h-48 bg-neutral-200 rounded-lg mb-4" />
                <div className="w-3/4 h-4 bg-neutral-200 rounded mb-2" />
                <div className="w-1/2 h-4 bg-neutral-200 rounded" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={<Package className="w-6 h-6" />}
            title="No Commercial Assets Matched"
            description="No properties, vehicles, or equipment match your selected filters. Try broadening your criteria or reset the search query."
            actionLabel="Reset All Filters"
            onAction={() => {
              setSearch('');
              setCategory('all');
              setAvailability('all');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={(selected) => {
                  onSelectProduct(selected);
                  navigate(`/products/${selected.slug}`);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
