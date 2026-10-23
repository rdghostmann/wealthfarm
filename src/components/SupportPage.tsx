import React from 'react';
import { Button } from './ui/Button.js';
import { LifeBuoy, FileText, Shield, ArrowRight, HelpCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface SupportPageProps {
  navigate: (path: string) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ navigate }) => {
  const { user } = useAuth();

  return (
    <div className="bg-[#F8FAF9] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-1">
            Institutional Resolution
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17231C] tracking-tight">
            WealthFarm Institutional Support Portal
          </h1>
          <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
            Direct access to operational ticket resolution, asset documentation queries, task submission technical reviews, and payment verification audits.
          </p>
        </div>

        {/* Quick Launch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#DCE8DF] shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF7F0] text-[#176B3A] flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#17231C]">Open Support Ticket</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Registered members can lodge structured tickets with assigned response SLAs for deed verification, order adjustments, and asset advisory.
              </p>
            </div>
            <div className="pt-6">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => {
                  if (!user) navigate('/login');
                  else navigate('/dashboard/support/new');
                }}
              >
                <span>{user ? 'Create Member Ticket' : 'Sign In to Submit Ticket'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCE8DF] shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF7F0] text-[#176B3A] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#17231C]">Task & Field Policy</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Review operational compliance standards for cadastral mapping, fleet roadworthiness inspections, equipment calibration, geotagged evidence, and reviewer sign-offs.
              </p>
            </div>
            <div className="pt-6">
              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/task-policy')}>
                Read Task Policy
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCE8DF] shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF7F0] text-[#176B3A] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#17231C]">Refund & Cancellation Policy</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Review terms governing asset reservation deposits, inspection timelines, and academy tuition guarantee schedules.
              </p>
            </div>
            <div className="pt-6">
              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/refund-policy')}>
                Read Refund Policy
              </Button>
            </div>
          </div>
        </div>

        {/* Support Directives */}
        <div className="bg-white rounded-2xl border border-[#DCE8DF] p-8 shadow-xs">
          <h2 className="text-lg font-bold text-[#17231C] mb-4">Standard Operational SLAs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#DCE8DF]">
              <div className="font-bold text-[#176B3A] uppercase tracking-wider mb-1">Billing & Settlement</div>
              <div className="font-bold text-base text-[#17231C] mb-1">&lt; 4 Hours</div>
              <p className="text-neutral-500">Paystack verification audits and official receipt issuance.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#DCE8DF]">
              <div className="font-bold text-[#176B3A] uppercase tracking-wider mb-1">Title & Deed Searches</div>
              <div className="font-bold text-base text-[#17231C] mb-1">&lt; 24 Hours</div>
              <p className="text-neutral-500">Cadastral coordinate checks and deed allocation abstracts.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#DCE8DF]">
              <div className="font-bold text-[#176B3A] uppercase tracking-wider mb-1">Task Evidence Review</div>
              <div className="font-bold text-base text-[#17231C] mb-1">&lt; 48 Hours</div>
              <p className="text-neutral-500">Technical feedback on survey reports, fleet audits, and site logs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
