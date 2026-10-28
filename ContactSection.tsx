import React from 'react';
import { Mail, Phone, MapPin, ArrowRight, MessageSquare, Send, Clock } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SectionEditBadge } from './cms/SectionEditBadge';

export const ContactSection: React.FC = () => {
  const { openContactWithService, siteSettings } = usePortfolio();

  return (
    <section id="contact" className="py-14 sm:py-20 border-t border-zinc-200/80 relative">
      <SectionEditBadge sectionKey="contact" sectionTitle="Contact & Socials" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] block">
              Contact &amp; Inquiries
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight">
              Ready to elevate your visual identity?
            </h2>
            <p className="text-zinc-600 text-base leading-relaxed max-w-xl">
              Whether you need end-to-end luxury packaging, brand identity guidelines, or editorial print direction, get in touch to discuss your timeline and vision.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <a 
                href={`mailto:${siteSettings.contactEmail}`} 
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-zinc-200 hover:border-[#EA580C] transition-colors group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-zinc-400 block font-medium">Direct Email</span>
                  <span className="text-sm font-bold text-zinc-900 group-hover:text-[#EA580C] transition-colors truncate block max-w-[200px]">
                    {siteSettings.contactEmail}
                  </span>
                </div>
              </a>

              <a 
                href={`tel:${siteSettings.contactPhone.replace(/[^0-9+]/g, '')}`} 
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-zinc-200 hover:border-[#EA580C] transition-colors group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-zinc-400 block font-medium">Direct Phone</span>
                  <span className="text-sm font-bold text-zinc-900 group-hover:text-[#EA580C] transition-colors truncate block max-w-[200px]">
                    {siteSettings.contactPhone}
                  </span>
                </div>
              </a>
            </div>

            {/* Telegram and Hours info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 pt-1">
              {siteSettings.contactTelegram && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Send className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>Telegram: <strong>{siteSettings.contactTelegram}</strong></span>
                </span>
              )}
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>{siteSettings.workingHours}</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-zinc-900 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-2">
                Fast-Track Project Brief
              </span>
              <h3 className="text-2xl font-bold text-white mb-3">
                Send a Project Request
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Fill out our guided client intake form with your project scope and timeline to receive a consultation and proposal.
              </p>
            </div>

            <button
              onClick={() => openContactWithService()}
              className="w-full bg-[#EA580C] hover:bg-[#D94F04] text-white py-4 px-6 rounded-2xl font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 hover:scale-101"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open Intake Form</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
