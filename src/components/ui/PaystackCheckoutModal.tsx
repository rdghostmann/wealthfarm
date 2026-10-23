import React, { useState } from 'react';
import { Modal } from './Modal.js';
import { Button } from './Button.js';
import { formatNaira } from '../../lib/utils.js';
import { apiRequest } from '../../lib/api.js';
import { useToast } from '../../context/ToastContext.js';
import { Shield, CreditCard, CheckCircle2, Lock, ExternalLink } from 'lucide-react';

interface PaystackCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  courseId?: string;
  itemTitle: string;
  amount: number; // authoritative display
  onPaymentSuccess: (transaction: any) => void;
}

export const PaystackCheckoutModal: React.FC<PaystackCheckoutModalProps> = ({
  isOpen,
  onClose,
  orderId,
  courseId,
  itemTitle,
  amount,
  onPaymentSuccess,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initData, setInitData] = useState<{
    reference: string;
    authorization_url?: string;
    mode: string;
  } | null>(null);
  const [step, setStep] = useState<'INITIAL' | 'PROCESSING' | 'SUCCESS'>('INITIAL');

  const startCheckout = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{
        reference: string;
        authorization_url?: string;
        mode: string;
        amount: number;
      }>('/api/payments/initialize', {
        method: 'POST',
        body: JSON.stringify({ orderId, courseId }),
      });

      setInitData(res);
      setStep('PROCESSING');
    } catch (err: any) {
      toast.error(err.message || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  const confirmVerification = async () => {
    if (!initData) return;
    setLoading(true);
    try {
      const verifyRes = await apiRequest<{ success: boolean; transaction: any }>('/api/payments/verify', {
        method: 'POST',
        body: JSON.stringify({
          reference: initData.reference,
          orderId,
          courseId,
        }),
      });

      if (verifyRes.success) {
        setStep('SUCCESS');
        toast.success(`Payment of ${formatNaira(amount)} verified successfully!`);
        setTimeout(() => {
          onPaymentSuccess(verifyRes.transaction);
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      toast.error(err.message || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Secure Paystack Checkout" maxWidth="md">
      <div className="space-y-4">
        {step === 'INITIAL' && (
          <div>
            <div className="p-4 rounded-xl bg-[#EEF7F0] border border-[#DCE8DF] mb-4">
              <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-1">
                Authoritative Checkout Summary
              </div>
              <h4 className="text-sm font-bold text-[#17231C]">{itemTitle}</h4>
              <div className="mt-3 flex items-baseline justify-between pt-3 border-t border-[#DCE8DF]">
                <span className="text-xs text-neutral-600">Total Due (NGN):</span>
                <span className="text-xl font-bold text-[#176B3A] tabular-nums">
                  {formatNaira(amount)}
                </span>
              </div>
            </div>

            <div className="text-xs text-neutral-500 space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#176B3A] shrink-0" />
                <span>256-bit SSL encrypted institutional transaction via Paystack.</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#176B3A] shrink-0" />
                <span>Prices verified server-side. Tamper-evident order references.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DCE8DF]">
              <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={startCheckout} loading={loading}>
                <CreditCard className="w-4 h-4 mr-1.5" />
                Pay {formatNaira(amount)} via Paystack
              </Button>
            </div>
          </div>
        )}

        {step === 'PROCESSING' && initData && (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#EEF7F0] text-[#176B3A] mx-auto flex items-center justify-center mb-3">
              <CreditCard className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="text-base font-bold text-[#17231C] mb-1">Awaiting Authorization</h4>
            <p className="text-xs text-neutral-500 mb-4">
              Paystack Reference: <span className="font-mono text-[#17231C] font-semibold">{initData.reference}</span>
            </p>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-left text-xs mb-6 space-y-2">
              <div className="font-semibold text-neutral-800">Verification Gateway Status:</div>
              <p className="text-neutral-600 leading-relaxed">
                Server-side transaction initialized. In production, the user completes authentication via 3D-Secure or bank USSD/transfer. Click below to confirm authoritative settlement.
              </p>
              <div className="pt-2 text-[11px] text-neutral-500">
                Mode: <span className="font-medium text-[#176B3A]">{initData.mode}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
                Abort
              </Button>
              <Button variant="primary" size="md" onClick={confirmVerification} loading={loading}>
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Confirm & Verify Settlement
              </Button>
            </div>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-[#17231C] mb-1">Payment Verified</h4>
            <p className="text-xs text-neutral-600">
              Your transaction has been confirmed on the server. Updating asset allocation records...
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
