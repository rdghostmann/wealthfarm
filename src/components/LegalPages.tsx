import React from 'react';
import { Breadcrumbs } from './ui/Breadcrumbs.js';
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  navigate: (path: string) => void;
  children: React.ReactNode;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ title, subtitle, navigate, children }) => (
  <div className="bg-[#F8FAF9] py-12">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => navigate('/') },
          { label: 'Institutional Governance' },
          { label: title },
        ]}
      />
      <div>
        <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-1">
          Institutional Governance
        </div>
        <h1 className="text-3xl font-extrabold text-[#17231C] tracking-tight">{title}</h1>
        <p className="mt-2 text-xs text-neutral-500">{subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#DCE8DF] p-8 md:p-12 shadow-xs text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-6">
        {children}
      </div>
    </div>
  </div>
);

export const PrivacyPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => (
  <LegalLayout
    title="Privacy & Data Protection Policy"
    subtitle="Governed under the Nigeria Data Protection Act (NDPA) 2023 and NDPR standards."
    navigate={navigate}
  >
    <div className="p-4 rounded-xl bg-[#EEF7F0] border border-[#DCE8DF] text-xs text-[#176B3A] font-medium flex items-center gap-2">
      <ShieldCheck className="w-4 h-4 shrink-0" />
      <span>WealthFarm is committed to institutional data confidentiality and strict NDPA compliance.</span>
    </div>

    <h3 className="text-base font-bold text-[#17231C]">1. Scope & Data Controller</h3>
    <p>
      WEALTHFARM ("Platform", "we", "us") operates as a multi-sector commercial asset verification, business development, and enterprise operations infrastructure in Nigeria. This policy details how we collect, process, and safeguard the personal and corporate identification data of our registered members, asset purchasers, and field compliance participants.
    </p>

    <h3 className="text-base font-bold text-[#17231C]">2. Information We Collect</h3>
    <p>
      We collect corporate registration credentials, valid government-issued identification (NIN, Driver’s License, or International Passport) for title conveyance purposes, contact numbers, email addresses, and geotagged field survey evidence. We do not store sensitive payment card details or CVV codes; all payment tokenization is handled securely via Paystack.
    </p>

    <h3 className="text-base font-bold text-[#17231C]">3. Purpose of Processing</h3>
    <p>
      Personal and corporate data is processed strictly for:
    </p>
    <ul className="list-disc pl-5 space-y-1">
      <li>Executing legal title conveyance at State Ministries of Lands and Cadastral Bureaus.</li>
      <li>Issuing authoritative purchase orders and Paystack transaction receipts.</li>
      <li>Verifying operational task submissions and field audit logs.</li>
      <li>Enrolling designated personnel in Executive Academy programmes.</li>
    </ul>

    <h3 className="text-base font-bold text-[#17231C]">4. Data Retention & Security</h3>
    <p>
      Data is stored in high-security, encrypted databases protected by role-based access controls and cryptographically signed session tokens. We never sell, rent, or lease member data to third-party marketing entities.
    </p>
  </LegalLayout>
);

export const TermsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => (
  <LegalLayout
    title="Institutional Terms of Service"
    subtitle="Terms governing platform access, asset reservations, and verification standards."
    navigate={navigate}
  >
    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>Notice: WEALTHFARM is an asset marketplace, business development platform, and educational portal, NOT an investment scheme.</span>
    </div>

    <h3 className="text-base font-bold text-[#17231C]">1. Acceptance of Terms</h3>
    <p>
      By registering an account, placing a purchase order, or submitting operational evidence on WEALTHFARM, you acknowledge and agree to be bound by these Institutional Terms of Service.
    </p>

    <h3 className="text-base font-bold text-[#17231C]">2. Absolute Prohibition of Speculative Financial Schemes</h3>
    <p>
      WealthFarm does not offer guaranteed percentage returns, passive crowdsourced dividends, or deposit savings products. Any reference to asset valuation reflects physical asset market appraisals, surveyed land boundaries, commercial transport vehicles, or enterprise equipment specifications. All purchase transactions represent the direct acquisition of physical assets, equipment, or educational curriculum.
    </p>

    <h3 className="text-base font-bold text-[#17231C]">3. Authoritative Pricing & Allocation</h3>
    <p>
      All asset prices are calculated authoritatively on the server in Nigerian Naira (NGN). Client-side modification of prices, quantities, or order totals is strictly prohibited and invalidated by server security policies. Orders remain pending until verified through official payment channels or formal bank wire confirmation.
    </p>

    <h3 className="text-base font-bold text-[#17231C]">4. Title Due Diligence & Survey Handover</h3>
    <p>
      Purchasers of commercial real estate or land parcels have the right to request cadastral survey coordinate charting and physical boundary pegging audits prior to execution of final Governor’s Consent transfer documentation.
    </p>
  </LegalLayout>
);

export const RefundPolicyPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => (
  <LegalLayout
    title="Asset & Tuition Refund Policy"
    subtitle="Clear guidelines for asset allocations, physical inspections, and academy fees."
    navigate={navigate}
  >
    <h3 className="text-base font-bold text-[#17231C]">1. Commercial Real Estate & Land Allocation Deposits</h3>
    <p>
      If a prospective purchaser places an asset reservation order on a commercial real estate or land tract and a subsequent physical boundary audit reveals an unresolvable cadastral defect or title encumbrance, WealthFarm guarantees a 100% refund of the deposit within 14 business days.
    </p>

    <h3 className="text-base font-bold text-[#17231C]">2. Inspection Window</h3>
    <p>
      Purchasers have a 7-calendar-day physical inspection window following order initiation to inspect the asset site with our Directorate team. If the purchaser elects not to proceed before executing the final deed of assignment, funds are returned less applicable administrative search costs.
    </p>

    <h3 className="text-base font-bold text-[#17231C]">3. Executive Academy Tuition</h3>
    <p>
      Tuition fees for executive masterclasses are fully refundable within 48 hours of enrollment, provided the student has accessed fewer than two video lessons. Once more than two modules have been streamed or downloadable course materials accessed, tuition fees become non-refundable.
    </p>
  </LegalLayout>
);

export const TaskPolicyPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => (
  <LegalLayout
    title="Field Task Participation & Operational Policy"
    subtitle="Operational compliance standards, geotagged evidence protocols, and reward disclaimer."
    navigate={navigate}
  >
    <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-800 font-medium">
      <strong>Operational Clarification:</strong> Field tasks on WealthFarm represent standardized operational checklists (cadastral mapping, fleet roadworthiness inspections, equipment calibration, enterprise market feasibility). In compliance with our core charter, monetary reward schemes or withdrawable commission wallets remain strictly disabled.
    </div>

    <h3 className="text-base font-bold text-[#17231C]">1. Purpose of Field Tasks</h3>
    <p>
      The Task Management module exists to institutionalize operational quality control and ground truth verification. Asset managers, certified surveyors, and logistics supervisors utilize this module to submit verified field reports to the Directorate for review.
    </p>

    <h3 className="text-base font-bold text-[#17231C]">2. Submission Standards</h3>
    <p>
      All submitted evidence must adhere to the following:
    </p>
    <ul className="list-disc pl-5 space-y-1">
      <li>Photographic evidence must display visible date, time, and GPS coordinate watermarks.</li>
      <li>Cadastral and land surveys must reference verified beacon numbers and State Surveyor-General coordinates.</li>
      <li>Fleet roadworthiness audits must include odometer readings, brake inspection notes, and telematics logs.</li>
    </ul>

    <h3 className="text-base font-bold text-[#17231C]">3. Administrative Review States</h3>
    <p>
      Submissions are categorized as SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, or RESUBMISSION_REQUIRED. Our Technical Review Officers provide written remarks on every review.
    </p>
  </LegalLayout>
);
