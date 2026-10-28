import React from 'react';
import {
  Phone,
  Mail,
  Send,
  Facebook,
  Instagram,
  MapPin,
  Clock,
  Globe,
  Share2,
  ExternalLink,
  Save
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const ContactSocialsManager: React.FC = () => {
  const { siteSettings, updateSiteSettings, studioProfile, updateStudioProfile, saveDraft } = usePortfolio();

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            Client Touchpoints
          </span>
          <h2 className="text-2xl font-extrabold text-zinc-950">Contact &amp; Social Media Manager</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Modify direct channels, Telegram, Facebook, Instagram, TikTok, physical studio address, hours, and Google Maps embed.
          </p>
        </div>

        <button
          onClick={() => saveDraft('Contact & social channels saved to draft')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Direct Communication Channels */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#EA580C]" />
            <span>Direct Communication &amp; Chat Channels</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Direct Phone Number
            </label>
            <input
              type="text"
              value={siteSettings.contactPhone}
              onChange={(e) => {
                updateSiteSettings({ contactPhone: e.target.value });
                updateStudioProfile({ phone: e.target.value });
              }}
              placeholder="+1 (555) 392-8100"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Primary Studio Email Address
            </label>
            <input
              type="email"
              value={siteSettings.contactEmail}
              onChange={(e) => {
                updateSiteSettings({ contactEmail: e.target.value });
                updateStudioProfile({ email: e.target.value });
              }}
              placeholder="hello@talmeezdesign.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Telegram Username or Direct Chat Link
            </label>
            <input
              type="text"
              value={siteSettings.contactTelegram}
              onChange={(e) => updateSiteSettings({ contactTelegram: e.target.value })}
              placeholder="@talmeez_studio or https://t.me/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Facebook Page Link
              </label>
              <input
                type="text"
                value={siteSettings.contactFacebook}
                onChange={(e) => updateSiteSettings({ contactFacebook: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Instagram Profile Link
              </label>
              <input
                type="text"
                value={siteSettings.contactInstagram}
                onChange={(e) => updateSiteSettings({ contactInstagram: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                TikTok Channel Link
              </label>
              <input
                type="text"
                value={siteSettings.contactTikTok}
                onChange={(e) => updateSiteSettings({ contactTikTok: e.target.value })}
                placeholder="https://tiktok.com/@..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                LinkedIn Profile Link
              </label>
              <input
                type="text"
                value={siteSettings.contactLinkedIn}
                onChange={(e) => updateSiteSettings({ contactLinkedIn: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Physical Studio Location, Hours & Google Maps */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#EA580C]" />
            <span>Studio Location, Hours &amp; Maps</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Physical Studio Address
            </label>
            <input
              type="text"
              value={siteSettings.address}
              onChange={(e) => {
                updateSiteSettings({ address: e.target.value });
                updateStudioProfile({ location: e.target.value });
              }}
              placeholder="14 Berkeley Square, Mayfair, London W1J 6BQ"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Opening / Closing Studio Working Hours
            </label>
            <input
              type="text"
              value={siteSettings.workingHours}
              onChange={(e) => {
                updateSiteSettings({ workingHours: e.target.value });
                updateStudioProfile({ workingHours: e.target.value });
              }}
              placeholder="Mon - Fri: 09:00 - 18:00 GMT / Worldwide Remote"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Google Maps Location (Embed URL or Search Link)
            </label>
            <input
              type="text"
              value={siteSettings.googleMapsEmbed}
              onChange={(e) => updateSiteSettings({ googleMapsEmbed: e.target.value })}
              placeholder="https://maps.google.com/maps?q=..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
            />
            <span className="text-[11px] text-zinc-400 mt-1 block">
              Enter any Google Maps embed link or address query link to render inside the interactive location card.
            </span>
          </div>

          {/* Map Preview iframe */}
          {siteSettings.googleMapsEmbed && (
            <div className="rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 h-44 relative">
              <iframe
                title="Google Maps Location Preview"
                src={siteSettings.googleMapsEmbed}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
