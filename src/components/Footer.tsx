import React from 'react';
import { Sprout, ShieldCheck, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-[#17231C] text-neutral-300 border-t border-neutral-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800">
          {/* Col 1: Institutional Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#176B3A] text-white flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">WEALTHFARM</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Institutional platform for verified Nigerian commercial assets, real estate, logistics haulage, enterprise infrastructure, and executive wealth creation education.
            </p>
            <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Registered Corporate Entity · RC: 1849204</span>
            </div>
          </div>

          {/* Col 2: Solutions & Marketplace */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Approved Assets
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button type="button" onClick={() => navigate('/products?cat=property')} className="hover:text-white transition-colors">
                  Commercial Real Estate & Land
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/products?cat=infrastructure')} className="hover:text-white transition-colors">
                  Enterprise Infrastructure
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/products?cat=vehicle')} className="hover:text-white transition-colors">
                  Haulage & Logistics Fleets
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/learning')} className="hover:text-white transition-colors">
                  Wealth Creation Executive Academy
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/ecosystem')} className="hover:text-white transition-colors">
                  Commercial Operations Ecosystem
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Governance & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Governance & Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button type="button" onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">
                  Privacy Policy (NDPR)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/terms')} className="hover:text-white transition-colors">
                  Institutional Terms of Service
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/refund-policy')} className="hover:text-white transition-colors">
                  Asset & Course Refund Policy
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/task-policy')} className="hover:text-white transition-colors">
                  Task Participation Policy
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/support')} className="hover:text-white transition-colors">
                  Resolution & Support Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Operations & Contact */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Operating Corridors
            </h4>
            <div className="space-y-3 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>Victoria Island Corporate Directorate, Lagos State & Sagamu Commercial Logistics Hub, Ogun State, Nigeria.</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>directorate@wealthfarm.ng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer section enforcing prompt safety guidelines */}
        <div className="pt-8 text-[11px] text-neutral-400 space-y-3">
          <p className="leading-relaxed">
            <strong className="text-neutral-300">Regulatory Disclaimer:</strong> WEALTHFARM is an enterprise commercial asset aggregation, verified procurement, and business development portal. WealthFarm is not a collective investment scheme, micro-finance bank, or deposit-money institution. We do not offer guaranteed percentage returns, speculative financial rewards, or high-yield investment schemes. All physical property and land assets undergo independent title verification with the respective State Bureau of Lands.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-neutral-800 text-neutral-400">
            <div>© {new Date().getFullYear()} WEALTHFARM Nigeria. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => navigate('/privacy')} className="hover:text-white">Privacy</button>
              <span>·</span>
              <button type="button" onClick={() => navigate('/terms')} className="hover:text-white">Terms</button>
              <span>·</span>
              <button type="button" onClick={() => navigate('/task-policy')} className="hover:text-white">Field Policy</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
