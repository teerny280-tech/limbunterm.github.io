import React from 'react';
import {
  ArrowUpRight,
  Mail,
  Phone,
  Send,
  Facebook,
  Instagram,
  MapPin,
  Clock
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SectionEditBadge } from './cms/SectionEditBadge';

export const Footer: React.FC = () => {
  const { setCurrentView, openContactWithService, siteSettings, studioProfile } = usePortfolio();

  const handleLinkClick = (id: string) => {
    setCurrentView('portfolio');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-[#121214] text-white pt-16 pb-12 border-t border-zinc-800 relative">
      <SectionEditBadge sectionKey="content" sectionTitle="Footer" className="top-6 right-6" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-800/80">
          
          {/* Brand & Mission (cols 1-5) */}
          <div className="lg:col-span-5 space-y-4">
            <button
              onClick={() => {
                setCurrentView('portfolio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-2xl font-extrabold tracking-tight text-white font-sans hover:opacity-90 transition-opacity"
            >
              {siteSettings.logoText || 'talmeez'}<span className="text-[#EA580C]">.</span>
            </button>

            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              {siteSettings.footerText}
            </p>

            {/* Social Icons (Telegram, Facebook, Instagram, TikTok, LinkedIn, Twitter) */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 text-zinc-400">
              {siteSettings.contactTelegram && (
                <a
                  href={siteSettings.contactTelegram.startsWith('http') ? siteSettings.contactTelegram : `https://t.me/${siteSettings.contactTelegram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-[#EA580C] hover:text-white transition-colors flex items-center justify-center text-xs font-semibold"
                  title="Telegram"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}

              {siteSettings.contactInstagram && (
                <a
                  href={siteSettings.contactInstagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-[#EA580C] hover:text-white transition-colors flex items-center justify-center text-xs font-semibold"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}

              {siteSettings.contactFacebook && (
                <a
                  href={siteSettings.contactFacebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-[#EA580C] hover:text-white transition-colors flex items-center justify-center text-xs font-semibold"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}

              {siteSettings.contactTikTok && (
                <a
                  href={siteSettings.contactTikTok}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-[#EA580C] hover:text-white transition-colors flex items-center justify-center text-xs font-semibold"
                  title="TikTok"
                >
                  TK
                </a>
              )}

              {siteSettings.contactLinkedIn && (
                <a
                  href={siteSettings.contactLinkedIn}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-[#EA580C] hover:text-white transition-colors flex items-center justify-center text-xs font-semibold"
                  title="LinkedIn"
                >
                  IN
                </a>
              )}

              {siteSettings.contactTwitter && (
                <a
                  href={siteSettings.contactTwitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-[#EA580C] hover:text-white transition-colors flex items-center justify-center text-xs font-semibold"
                  title="X / Twitter"
                >
                  X
                </a>
              )}
            </div>
          </div>

          {/* Quick Links (cols 6-7) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <button onClick={() => handleLinkClick('hero')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white transition-colors">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('projects')} className="hover:text-white transition-colors">
                  Selected Work
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('brands')} className="hover:text-white transition-colors">
                  Clients &amp; Brands
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('contact')} className="hover:text-white transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Direct Info (cols 8-12) */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
              Direct Inquiries
            </h4>
            
            <div className="space-y-2.5 text-sm text-zinc-400">
              <a
                href={`mailto:${siteSettings.contactEmail}`}
                className="flex items-center gap-2 hover:text-white transition-colors group"
              >
                <Mail className="w-4 h-4 text-[#EA580C]" />
                <span className="font-semibold text-zinc-200 group-hover:text-white">{siteSettings.contactEmail}</span>
              </a>

              <a
                href={`tel:${siteSettings.contactPhone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 hover:text-white transition-colors group"
              >
                <Phone className="w-4 h-4 text-[#EA580C]" />
                <span className="font-semibold text-zinc-200 group-hover:text-white">{siteSettings.contactPhone}</span>
              </a>

              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-zinc-400">{siteSettings.address}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#EA580C] shrink-0" />
                <span className="text-xs text-zinc-400">{siteSettings.workingHours}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <p>{siteSettings.copyrightText}</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Powered by Studio CMS</span>
            <span>·</span>
            <button
              onClick={() => {
                setCurrentView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors text-orange-400"
            >
              Admin Dashboard
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
