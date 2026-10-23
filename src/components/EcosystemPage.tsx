import React from 'react';
import { Button } from './ui/Button.js';
import {
  MapPin,
  Truck,
  Building2,
  GraduationCap,
  CheckSquare,
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface EcosystemPageProps {
  navigate: (path: string) => void;
}

export const EcosystemPage: React.FC<EcosystemPageProps> = ({ navigate }) => {
  const components = [
    {
      title: 'Commercial Real Estate & Land Aggregation',
      description: 'Acquiring commercial property and strategic land in Nigeria requires rigorous scrutiny of boundary overlaps, unexcised community claims, and invalid documentation. WealthFarm performs full forensic cadastral searches, coordinates charting at State Surveyor-General departments, and guarantees clean titles before listing.',
      icon: MapPin,
      action: () => navigate('/products?cat=property'),
      actionText: 'Browse Real Estate & Land',
    },
    {
      title: 'Logistics Fleet & Supply Chain Infrastructure',
      description: 'Reliable transport is the backbone of Nigerian commerce and industrial distribution. Our vetted haulage fleet and commercial vehicles feature verified maintenance histories, telematics tracking, and transit reliability audits between key production zones and commercial distribution corridors.',
      icon: Truck,
      action: () => navigate('/products?cat=vehicle'),
      actionText: 'Inspect Haulage Fleet',
    },
    {
      title: 'Enterprise Infrastructure & Production Facilities',
      description: 'Scalable enterprise requires modern production capacity. WealthFarm catalogues turnkey commercial facilities, precision hydroponics, and light industrial infrastructure built to withstand local operating environments and optimize operational margins.',
      icon: Building2,
      action: () => navigate('/products?cat=infrastructure'),
      actionText: 'View Enterprise Units',
    },
    {
      title: 'Field Operational Tasks & Evidence Verification',
      description: 'Business and asset management requires verifiable accountability. WealthFarm provides a structured task verification module for cadastral ground surveys, fleet roadworthiness inspections, equipment calibration, and market feasibility audits with auditable evidence submission.',
      icon: CheckSquare,
      action: () => navigate('/dashboard/tasks'),
      actionText: 'Explore Field Tasks',
    },
    {
      title: 'Wealth Creation & Executive Academy',
      description: 'Professional development led by seasoned investment analysts, commercial real estate surveyors, corporate accountants, and enterprise operators. Modules cover financial modeling, asset valuation, business scalability, commercial contract negotiation, and agribusiness economics.',
      icon: GraduationCap,
      action: () => navigate('/learning'),
      actionText: 'View Course Modules',
    },
  ];

  return (
    <div className="bg-[#F8FAF9] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-2">
            Integrated Enterprise Value Ecosystem
          </div>
          <h1 className="text-4xl font-extrabold text-[#17231C] tracking-tight">
            The WEALTHFARM Platform Ecosystem
          </h1>
          <p className="mt-4 text-base text-neutral-600 leading-relaxed">
            Sustainable wealth creation is not based on speculation; it is built on a synchronized foundation of verified tangible asset ownership, efficient logistics, modern production infrastructure, operational diligence, and institutional financial mastery.
          </p>
        </div>

        <div className="space-y-8">
          {components.map((comp, idx) => {
            const Icon = comp.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#DCE8DF] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#EEF7F0] text-[#176B3A] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#17231C]">{comp.title}</h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-3xl">
                      {comp.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <Button variant="secondary" size="md" className="w-full md:w-auto" onClick={comp.action}>
                    <span>{comp.actionText}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-8 rounded-2xl bg-[#17231C] text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Partner with WealthFarm</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl">
              Are you a commercial property developer, logistics fleet operator, enterprise equipment supplier, or educational institution? Submit an asset or partnership inquiry to our Directorate.
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={() => navigate('/contact')}>
            Submit Partnership Inquiry
          </Button>
        </div>
      </div>
    </div>
  );
};
