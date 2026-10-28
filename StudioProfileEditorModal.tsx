import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Sliders, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const StudioProfileEditorModal: React.FC = () => {
  const { 
    isStudioProfileEditorOpen, 
    setIsStudioProfileEditorOpen, 
    studioProfile, 
    updateStudioProfile 
  } = usePortfolio();

  const [form, setForm] = useState(studioProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setForm(studioProfile);
  }, [studioProfile, isStudioProfileEditorOpen]);

  if (!isStudioProfileEditorOpen) return null;

  const handleChange = (field: keyof typeof studioProfile, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudioProfile(form);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsStudioProfileEditorOpen(false);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <div className="fixed inset-0" onClick={() => setIsStudioProfileEditorOpen(false)} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 bg-white text-zinc-900 rounded-[28px] max-w-2xl w-full shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-zinc-100 bg-zinc-50/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                  Studio Configuration
                </span>
                <h3 className="text-xl font-extrabold text-zinc-950">
                  Edit Portfolio &amp; Studio Details
                </h3>
              </div>
            </div>
            <button
              onClick={() => setIsStudioProfileEditorOpen(false)}
              className="p-2 rounded-full bg-zinc-200/80 hover:bg-zinc-300 text-zinc-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* Branding & Hero copy */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Hero &amp; Identity Content
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Designer / Studio Name
                  </label>
                  <input
                    type="text"
                    value={form.designerName}
                    onChange={e => handleChange('designerName', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Brand Wordmark
                  </label>
                  <input
                    type="text"
                    value={form.brandTitle}
                    onChange={e => handleChange('brandTitle', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Headline Prefix
                  </label>
                  <input
                    type="text"
                    value={form.headlinePrefix}
                    onChange={e => handleChange('headlinePrefix', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Headline Highlight
                  </label>
                  <input
                    type="text"
                    value={form.headlineHighlight}
                    onChange={e => handleChange('headlineHighlight', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Hero Subtitle Narrative
                </label>
                <textarea
                  rows={2}
                  value={form.subtitle}
                  onChange={e => handleChange('subtitle', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C] resize-none"
                />
              </div>
            </div>

            {/* Metrics Counters */}
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Key Quantitative Stats
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Years Exp</label>
                  <input
                    type="text"
                    value={form.metricYears}
                    onChange={e => handleChange('metricYears', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-mono outline-none focus:border-[#EA580C]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Projects Done</label>
                  <input
                    type="text"
                    value={form.metricProjects}
                    onChange={e => handleChange('metricProjects', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-mono outline-none focus:border-[#EA580C]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Happy Clients</label>
                  <input
                    type="text"
                    value={form.metricClients}
                    onChange={e => handleChange('metricClients', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-mono outline-none focus:border-[#EA580C]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Countries</label>
                  <input
                    type="text"
                    value={form.metricCountries}
                    onChange={e => handleChange('metricCountries', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-mono outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Contact Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Direct Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Direct Phone
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Studio Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => handleChange('location', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    value={form.workingHours}
                    onChange={e => handleChange('workingHours', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsStudioProfileEditorOpen(false)}
                className="px-5 py-2 rounded-full border border-zinc-300 hover:bg-zinc-100 text-xs font-semibold text-zinc-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-sm transition-all"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Studio Details</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
