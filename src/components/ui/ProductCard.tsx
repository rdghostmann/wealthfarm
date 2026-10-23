import React from 'react';
import type { Product } from '../../types/index.js';
import { formatNaira } from '../../lib/utils.js';
import { StatusBadge } from './StatusBadge.js';
import { MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickOrder?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onQuickOrder }) => {
  return (
    <div className="group bg-white border border-[#DCE8DF] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Image container */}
      <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Graceful styled fallback container
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={product.availability} type="availability" />
        </div>
        {product.featured && (
          <div className="absolute top-3 right-3 bg-[#176B3A] text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Vetted Asset</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line without pill enclosures */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <span className="capitalize font-medium text-[#176B3A]">{product.category}</span>
            <span aria-hidden="true">·</span>
            {product.location ? (
              <span className="flex items-center gap-1 truncate max-w-[180px]">
                <MapPin className="w-3 h-3 shrink-0" />
                {product.location}
              </span>
            ) : (
              <span>Institutional Grade</span>
            )}
          </div>

          <h3
            className="text-base font-bold text-[#17231C] group-hover:text-[#176B3A] transition-colors line-clamp-2 cursor-pointer mb-2"
            onClick={() => onSelect(product)}
          >
            {product.name}
          </h3>

          <p className="text-xs text-neutral-600 line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing and Action */}
        <div className="pt-4 border-t border-[#DCE8DF] flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase font-semibold text-neutral-600 tracking-wider">Asset Valuation</div>
            <div className="text-lg font-bold text-[#17231C] tabular-nums">
              {formatNaira(product.price)}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelect(product)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#176B3A] bg-[#EEF7F0] hover:bg-[#DEEFE2] rounded-lg transition-colors"
          >
            <span>Inspect</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
