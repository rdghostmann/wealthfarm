import React, { useState } from 'react';
import type { Product, Order } from '../types/index.js';
import { formatNaira, formatDate } from '../lib/utils.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { apiRequest } from '../lib/api.js';
import { Button } from './ui/Button.js';
import { StatusBadge } from './ui/StatusBadge.js';
import { Breadcrumbs } from './ui/Breadcrumbs.js';
import { PaystackCheckoutModal } from './ui/PaystackCheckoutModal.js';
import {
  MapPin,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  FileText,
  Lock,
  PhoneCall,
  ShoppingBag
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  navigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, navigate }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState<number>(1);
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [isOrdering, setIsOrdering] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);

  const totalPrice = product.price * quantity;

  const handleCreateOrder = async () => {
    if (!user) {
      toast.info('Please sign in or create an account to initiate asset orders.');
      navigate('/login');
      return;
    }

    if (product.availability === 'SOLD_OUT') {
      toast.error('This asset is currently sold out and cannot be ordered.');
      return;
    }

    setIsOrdering(true);
    try {
      const res = await apiRequest<{ order: Order }>('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          productId: product.id,
          quantity,
          notes: orderNotes,
        }),
      });

      setActiveOrder(res.order);
      setCheckoutModalOpen(true);
      toast.success(`Purchase order ${res.order.orderNumber} initiated on the server.`);
    } catch (err: any) {
      toast.error(err.message || 'Order creation failed');
    } finally {
      setIsOrdering(false);
    }
  };

  const breadcrumbs = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Products & Assets', onClick: () => navigate('/products') },
    { label: product.name },
  ];

  return (
    <div className="bg-[#F8FAF9] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Image and Details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden border border-[#DCE8DF] bg-white shadow-xs">
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <StatusBadge status={product.availability} type="availability" />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-[#DCE8DF] p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-[#17231C]">Asset Description & Forensic Background</h2>
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>

              <div className="pt-4 border-t border-[#DCE8DF]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Institutional Due Diligence Guarantee</span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  All listings on WealthFarm undergo independent physical inspection, boundary coordinates verification, legal search at the State Ministry of Lands, and title authenticity review.
                </p>
              </div>
            </div>

            {/* Technical Specifications */}
            {product.detailedSpecs && Object.keys(product.detailedSpecs).length > 0 && (
              <div className="bg-white rounded-2xl border border-[#DCE8DF] p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[#17231C] mb-6">Technical Specifications & Field Audits</h2>
                <div className="divide-y divide-[#DCE8DF] text-xs">
                  {Object.entries(product.detailedSpecs).map(([specKey, specVal]) => (
                    <div key={specKey} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="font-semibold text-neutral-600 uppercase tracking-wider">{specKey}</span>
                      <span className="text-[#17231C] font-medium text-right sm:max-w-md">{specVal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Checkout & Valuation Sidebar */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-[#DCE8DF] p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-2">
                  <span className="capitalize">{product.category}</span>
                  {product.location && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {product.location}
                      </span>
                    </>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-[#17231C] tracking-tight">{product.name}</h1>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-xl bg-[#EEF7F0] border border-[#DCE8DF]">
                <div className="text-[11px] font-semibold text-[#176B3A] uppercase tracking-wider mb-1">
                  Authoritative Asset Valuation
                </div>
                <div className="text-3xl font-extrabold text-[#17231C] tabular-nums">
                  {formatNaira(product.price)}
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  Denominated in Nigerian Naira (NGN). Price calculated and verified server-side.
                </div>
              </div>

              {/* Order Form */}
              <div className="space-y-4 pt-2 border-t border-[#DCE8DF]">
                {product.category !== 'property' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#17231C] mb-1.5">
                      Units / Quantity
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3.5 py-2 text-sm text-[#17231C] bg-white border border-[#DCE8DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#17231C] mb-1.5">
                    Order Delivery & Technical Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="E.g., Preferred inspection date, cooperative name, or delivery corridor..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs text-[#17231C] bg-white border border-[#DCE8DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                </div>

                <div className="pt-2 flex items-baseline justify-between text-sm">
                  <span className="font-semibold text-neutral-600">Calculated Order Total:</span>
                  <span className="text-xl font-bold text-[#176B3A] tabular-nums">
                    {formatNaira(totalPrice)}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={product.availability === 'SOLD_OUT'}
                  loading={isOrdering}
                  onClick={handleCreateOrder}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {product.availability === 'SOLD_OUT'
                    ? 'Asset Fully Allocated'
                    : 'Initiate Purchase Order'}
                </Button>

                <p className="text-[11px] text-neutral-500 text-center flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#176B3A]" />
                  <span>Settlement processed through Paystack with verified webhooks.</span>
                </p>
              </div>
            </div>

            {/* Direct Directorate Advisory box */}
            <div className="bg-[#17231C] text-white rounded-2xl p-6 space-y-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Require an On-Site Physical Inspection?</span>
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Institutional investors, commercial operators, and enterprise representatives can schedule a guided physical inspection or technical asset audit with our survey team.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-neutral-700 text-white hover:bg-neutral-800"
                onClick={() => navigate('/contact')}
              >
                Schedule Physical Site Audit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {activeOrder && (
        <PaystackCheckoutModal
          isOpen={checkoutModalOpen}
          onClose={() => setCheckoutModalOpen(false)}
          orderId={activeOrder.id}
          itemTitle={product.name}
          amount={activeOrder.totalAmount}
          onPaymentSuccess={() => {
            navigate('/dashboard/orders');
          }}
        />
      )}
    </div>
  );
};
