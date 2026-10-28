import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Sliders,
  Star,
  Quote,
  Plus,
  Edit3,
  Trash2,
  Upload,
  Check,
  X,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Sparkles,
  FileText
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Testimonial } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { MediaPickerModal } from './MediaPickerModal';

export const WebsiteContentEditor: React.FC = () => {
  const {
    siteSettings,
    updateSiteSettings,
    studioProfile,
    updateStudioProfile,
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial
  } = usePortfolio();

  const [activeSubTab, setActiveSubTab] = useState<'branding' | 'about' | 'testimonials' | 'cta' | 'footer'>('branding');

  // Testimonial Modal State
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [testQuote, setTestQuote] = useState('');
  const [testAuthor, setTestAuthor] = useState('');
  const [testRole, setTestRole] = useState('');
  const [testCompany, setTestCompany] = useState('');
  const [testRating, setTestRating] = useState(5);
  const [testAvatar, setTestAvatar] = useState('JS');
  const [deleteTargetTestimonial, setDeleteTargetTestimonial] = useState<Testimonial | null>(null);

  // Media picker for Logo or Favicon
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerField, setMediaPickerField] = useState<'logo' | 'favicon'>('logo');

  const handleOpenAddTestimonial = () => {
    setEditingTestimonialId(null);
    setTestQuote('');
    setTestAuthor('');
    setTestRole('Founder & CEO');
    setTestCompany('Brand Co');
    setTestRating(5);
    setTestAvatar('BC');
    setIsTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonial = (t: Testimonial) => {
    setEditingTestimonialId(t.id);
    setTestQuote(t.quote);
    setTestAuthor(t.author);
    setTestRole(t.role);
    setTestCompany(t.company);
    setTestRating(t.rating);
    setTestAvatar(t.avatar);
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuote.trim() || !testAuthor.trim()) {
      alert('Please fill out quote and author');
      return;
    }

    const payload = {
      quote: testQuote.trim(),
      author: testAuthor.trim(),
      role: testRole.trim(),
      company: testCompany.trim(),
      rating: testRating,
      avatar: testAvatar.trim() || testAuthor.substring(0, 2).toUpperCase(),
      visible: true
    };

    if (editingTestimonialId) {
      await updateTestimonial(editingTestimonialId, payload);
    } else {
      await addTestimonial(payload);
    }
    setIsTestimonialModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            Website Copy &amp; Metadata
          </span>
          <h2 className="text-2xl font-extrabold text-zinc-950">Content Management</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Modify brand name, logo, favicon, About stats, client testimonials, CTA banner, and footer information.
          </p>
        </div>

        {/* Sub-tab Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-zinc-100 rounded-2xl">
          {[
            { id: 'branding', label: 'Identity & Logo' },
            { id: 'about', label: 'About & Milestones' },
            { id: 'testimonials', label: 'Testimonials' },
            { id: 'cta', label: 'CTA Banner' },
            { id: 'footer', label: 'Footer & Legal' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === tab.id
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Branding, Logo & Favicon */}
      {activeSubTab === 'branding' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-6">
          <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#EA580C]" />
            <span>Site Identity, Logo &amp; Favicon</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Website Meta Title &amp; Document Name
              </label>
              <input
                type="text"
                value={siteSettings.siteName}
                onChange={(e) => updateSiteSettings({ siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
              />
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Displayed in browser tab header and search engine bookmarks.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Navbar Wordmark (Text Logo)
              </label>
              <input
                type="text"
                value={siteSettings.logoText}
                onChange={(e) => updateSiteSettings({ logoText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold outline-none focus:border-[#EA580C]"
              />
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Brand title shown in the top navigation bar with accent period.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Website Meta Description (SEO)
            </label>
            <textarea
              rows={2}
              value={siteSettings.siteDescription}
              onChange={(e) => updateSiteSettings({ siteDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
            />
          </div>

          {/* Logo & Favicon Graphics Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Custom Navbar Logo Graphic
              </label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center overflow-hidden p-1">
                  {siteSettings.logoUrl ? (
                    <img src={siteSettings.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-zinc-400 font-mono">Text Logo</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMediaPickerField('logo');
                      setIsMediaPickerOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700"
                  >
                    Select Graphic
                  </button>
                  {siteSettings.logoUrl && (
                    <button
                      onClick={() => updateSiteSettings({ logoUrl: '' })}
                      className="px-2.5 py-1.5 rounded-xl border border-zinc-200 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Browser Favicon (.ico / .png)
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center overflow-hidden p-1">
                  {siteSettings.faviconUrl ? (
                    <img src={siteSettings.faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" />
                  ) : (
                    <Globe className="w-6 h-6 text-zinc-400" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMediaPickerField('favicon');
                      setIsMediaPickerOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700"
                  >
                    Select Favicon
                  </button>
                  {siteSettings.faviconUrl && (
                    <button
                      onClick={() => updateSiteSettings({ faviconUrl: '' })}
                      className="px-2.5 py-1.5 rounded-xl border border-zinc-200 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: About & Milestones Counter */}
      {activeSubTab === 'about' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-6">
          <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#EA580C]" />
            <span>About Us &amp; Key Metrics Milestones</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60 space-y-2">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Years Experience
              </label>
              <input
                type="text"
                value={studioProfile.metricYears}
                onChange={(e) => updateStudioProfile({ metricYears: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-base font-bold font-mono outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60 space-y-2">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Projects Completed
              </label>
              <input
                type="text"
                value={studioProfile.metricProjects}
                onChange={(e) => updateStudioProfile({ metricProjects: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-base font-bold font-mono outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60 space-y-2">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Happy Clients
              </label>
              <input
                type="text"
                value={studioProfile.metricClients}
                onChange={(e) => updateStudioProfile({ metricClients: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-base font-bold font-mono outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60 space-y-2">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Countries Reached
              </label>
              <input
                type="text"
                value={studioProfile.metricCountries}
                onChange={(e) => updateStudioProfile({ metricCountries: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-base font-bold font-mono outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Testimonials */}
      {activeSubTab === 'testimonials' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
                <Quote className="w-5 h-5 text-[#EA580C]" />
                <span>Client Testimonials ({testimonials.length})</span>
              </h3>
              <p className="text-xs text-zinc-500">
                Manage client quotes, ratings, and authors displayed on the public site.
              </p>
            </div>

            <button
              onClick={handleOpenAddTestimonial}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Testimonial</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-[#EA580C]">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#EA580C]" />
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditTestimonial(t)}
                        className="p-1 rounded-lg hover:bg-zinc-200 text-zinc-600"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetTestimonial(t)}
                        className="p-1 rounded-lg hover:bg-rose-100 text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-700 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-zinc-200/60 text-xs">
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-[#EA580C] font-bold text-[10px] flex items-center justify-center">
                    {t.avatar}
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 block">{t.author}</span>
                    <span className="text-[11px] text-zinc-500">
                      {t.role}, {t.company}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: CTA Banner */}
      {activeSubTab === 'cta' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-5">
          <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#EA580C]" />
            <span>Call to Action (CTA) Banner</span>
          </h3>

          <div className="p-5 rounded-2xl bg-[#EA580C] text-white space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-200">
              Live Preview of CTA Banner
            </p>
            <h4 className="text-2xl font-extrabold">Have a project in mind? Let&apos;s create something bold.</h4>
            <p className="text-xs text-orange-100 max-w-lg">
              Currently accepting selected brand identity, editorial design, and packaging commissions.
            </p>
          </div>
        </div>
      )}

      {/* Tab 5: Footer & Legal */}
      {activeSubTab === 'footer' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-5">
          <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#EA580C]" />
            <span>Footer Text &amp; Copyright Notice</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Footer Brand Bio
            </label>
            <textarea
              rows={2}
              value={siteSettings.footerText}
              onChange={(e) => updateSiteSettings({ footerText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Copyright Notice
            </label>
            <input
              type="text"
              value={siteSettings.copyrightText}
              onChange={(e) => updateSiteSettings({ copyrightText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
            />
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      <AnimatePresence>
        {isTestimonialModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="fixed inset-0" onClick={() => setIsTestimonialModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-zinc-950">
                  {editingTestimonialId ? 'Edit Testimonial' : 'Add Testimonial'}
                </h4>
                <button onClick={() => setIsTestimonialModalOpen(false)}>
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <form onSubmit={handleSaveTestimonial} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Client Quote *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={testQuote}
                    onChange={(e) => setTestQuote(e.target.value)}
                    placeholder="Describe collaboration and measurable outcomes..."
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={testAuthor}
                      onChange={(e) => setTestAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={testRole}
                      onChange={(e) => setTestRole(e.target.value)}
                      placeholder="Founder / CMO"
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={testCompany}
                      onChange={(e) => setTestCompany(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Star Rating (1-5)
                    </label>
                    <select
                      value={testRating}
                      onChange={(e) => setTestRating(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-semibold outline-none"
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsTestimonialModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-300 text-xs font-bold text-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-bold"
                  >
                    Save Testimonial
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Testimonial */}
      <ConfirmDeleteModal
        isOpen={!!deleteTargetTestimonial}
        title="Delete Testimonial?"
        message="Are you sure you want to delete testimonial by"
        itemName={deleteTargetTestimonial?.author}
        onConfirm={async () => {
          if (deleteTargetTestimonial) {
            await deleteTestimonial(deleteTargetTestimonial.id);
            setDeleteTargetTestimonial(null);
          }
        }}
        onCancel={() => setDeleteTargetTestimonial(null)}
      />

      {/* Media Picker for Logo or Favicon */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        allowedType="image"
        onSelect={(url) => {
          if (mediaPickerField === 'logo') {
            updateSiteSettings({ logoUrl: url });
          } else {
            updateSiteSettings({ faviconUrl: url });
          }
          setIsMediaPickerOpen(false);
        }}
        onClose={() => setIsMediaPickerOpen(false)}
      />
    </div>
  );
};
