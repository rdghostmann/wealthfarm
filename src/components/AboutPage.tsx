import React from 'react';
import { Button } from './ui/Button.js';
import { ShieldCheck, Target, Award, Users, MapPin, CheckCircle } from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="bg-[#F8FAF9] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-2">
            Institutional Identity & Mission
          </div>
          <h1 className="text-4xl font-extrabold text-[#17231C] tracking-tight">
            Building Nigeria's Trust Infrastructure for Sustainable Wealth Creation
          </h1>
          <p className="mt-4 text-base text-neutral-600 leading-relaxed">
            WEALTHFARM was founded on a fundamental conviction: enduring wealth is forged through tangible asset ownership, operational business excellence, and continuous capacity building. We connect individuals and enterprises to verified commercial real estate, strategic logistics assets, sustainable agribusiness infrastructure, and executive investment education.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#DCE8DF] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EEF7F0] text-[#176B3A] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#17231C] mb-2">Tangible Asset Ownership</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every commercial parcel, logistics vehicle, and infrastructure unit catalogued on WealthFarm is backed by verified legal documentation, physical audits, and clear title conveyance.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#DCE8DF] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EEF7F0] text-[#176B3A] flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#17231C] mb-2">Operational & Business Rigor</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We replace speculation with operational frameworks: cadastral boundary verification, fleet telematics audits, market feasibility surveys, and auditable task sign-offs.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#DCE8DF] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EEF7F0] text-[#176B3A] flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#17231C] mb-2">Strict Anti-Ponzi Charter</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              WealthFarm does not promise speculative returns, passive crowdsourced dividends, or get-rich-quick yields. We provide direct asset ownership, enterprise tooling, and executive education.
            </p>
          </div>
        </div>

        {/* Executive Directorate */}
        <div className="bg-white rounded-2xl border border-[#DCE8DF] p-8 md:p-12">
          <div className="max-w-2xl mb-8">
            <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-2">
              Leadership & Advisory
            </div>
            <h2 className="text-2xl font-bold text-[#17231C]">
              Institutional Directorate
            </h2>
            <p className="text-xs text-neutral-600 mt-2">
              Guided by experienced legal practitioners, asset surveyors, commercial agronomists, and logistics supply chain leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl bg-[#F8FAF9] border border-[#DCE8DF]">
              <div className="text-sm font-bold text-[#17231C]">Dr. Babatunde Adeleke, Ph.D.</div>
              <div className="text-xs text-[#176B3A] font-medium mb-3">Head of Enterprise Asset Operations & Compliance</div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Over 22 years of commercial enterprise operations and asset diligence across the Nigerian South-West and Middle Belt. Specializes in real property vetting, physical site audits, and operational compliance.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8FAF9] border border-[#DCE8DF]">
              <div className="text-sm font-bold text-[#17231C]">Barrister Amina Al-Hassan, LL.M.</div>
              <div className="text-xs text-[#176B3A] font-medium mb-3">Principal Legal Counsel & Title Verification</div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Specialist in Nigerian corporate property jurisprudence, Governor’s Consent processes, Gazette Excisions, commercial contract structuring, and institutional conveyance.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-8">
          <Button variant="primary" size="lg" onClick={() => navigate('/products')}>
            Inspect Approved Commercial Assets
          </Button>
        </div>
      </div>
    </div>
  );
};
