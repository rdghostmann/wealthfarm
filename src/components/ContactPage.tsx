import React, { useState } from 'react';
import { Button } from './ui/Button.js';
import { Input } from './ui/Input.js';
import { Textarea } from './ui/Textarea.js';
import { Select } from './ui/Select.js';
import { useToast } from '../context/ToastContext.js';
import { MapPin, Mail, Phone, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    inquiryType: 'farmland_inspection',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please complete all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Your formal briefing request has been recorded with our Directorate.');
    }, 800);
  };

  return (
    <div className="bg-[#F8FAF9] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-1">
            Directorate Inquiries
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17231C] tracking-tight">
            Schedule an Asset Audit, Enterprise Consultation, or Partnership
          </h1>
          <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
            Connect directly with WealthFarm's legal surveyors, commercial real estate analysts, logistics directors, or enterprise advisory team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DCE8DF] p-8 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#17231C]">Inquiry Successfully Dispatched</h3>
                <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-[#17231C]">{formData.name}</span>. A designated Directorate officer will review your request and contact you via {formData.email} within 24 business hours.
                </p>
                <div className="pt-4">
                  <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    Submit Another Inquiry
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    required
                    placeholder="e.g., Aliyu Danjuma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Corporate Email Address"
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    placeholder="+234 803 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Input
                    label="Organization / Entity"
                    placeholder="e.g., Prime Commercial Ventures"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                </div>

                <Select
                  label="Inquiry Category"
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  options={[
                    { label: 'Commercial Real Estate & Land Title Verification', value: 'property_inspection' },
                    { label: 'Haulage Fleet & Logistics Operations', value: 'fleet_logistics' },
                    { label: 'Turnkey Enterprise Infrastructure & Facilities', value: 'turnkey_facilities' },
                    { label: 'Executive Wealth Creation & Business Masterclasses', value: 'executive_training' },
                    { label: 'Corporate Enterprise & Venture Partnership', value: 'enterprise_partnership' },
                  ]}
                />

                <Textarea
                  label="Inquiry Details & Corridor Specifics"
                  required
                  rows={4}
                  placeholder="Detail your requirements, target asset sector, corridor preference (Lagos/Ogun/Oyo), or operational timelines..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />

                <Button variant="primary" size="lg" className="w-full" loading={loading}>
                  Submit Directorate Consultation Request
                </Button>
              </form>
            )}
          </div>

          {/* Institutional Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-[#DCE8DF] p-6 sm:p-8 space-y-6 shadow-xs">
              <h3 className="font-bold text-base text-[#17231C]">Corporate Directorate Headquarters</h3>

              <div className="space-y-4 text-xs text-neutral-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#176B3A] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#17231C]">Victoria Island Directorate Office</div>
                    <div>Plot 14B, Adeola Hopewell Street, Victoria Island, Lagos State, Nigeria.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#176B3A] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#17231C]">Sagamu Commercial Operations Hub</div>
                    <div>Km 44, Lagos-Ibadan Expressway Commercial Corridor, Sagamu, Ogun State.</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#176B3A] shrink-0" />
                  <div>
                    <div className="font-semibold text-[#17231C]">Official Directorate Email</div>
                    <div>directorate@wealthfarm.ng</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#176B3A] shrink-0" />
                  <div>
                    <div className="font-semibold text-[#17231C]">Operational Hours</div>
                    <div>Monday – Friday: 08:00 – 17:30 WAT (Field Audits by Appointment)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#17231C] text-white rounded-2xl p-6 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>Regulatory Notice</span>
              </div>
              <p className="text-neutral-300 leading-relaxed">
                WEALTHFARM does not solicit cash deposits or investment funds via unofficial social media channels. All communications originate exclusively from official @wealthfarm.ng addresses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
