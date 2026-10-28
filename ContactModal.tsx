import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const ContactModal: React.FC = () => {
  const { isContactModalOpen, setIsContactModalOpen, selectedServiceForInquiry, addInquiry } = usePortfolio();

  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState(selectedServiceForInquiry || 'Brand Identity');
  const [budget, setBudget] = useState('$5k - $10k');
  const [timeline, setTimeline] = useState('3 - 4 weeks');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  // Keep service in sync when opened from specific card
  React.useEffect(() => {
    if (selectedServiceForInquiry) {
      setService(selectedServiceForInquiry);
    }
  }, [selectedServiceForInquiry]);

  if (!isContactModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !email.trim()) return;

    addInquiry({
      clientName,
      email,
      company,
      service,
      timeline,
      message: message || 'Interested in starting a new design engagement.'
    });

    const generatedRef = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    setReferenceId(generatedRef);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsContactModalOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setMessage('');
    }, 300);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <div className="fixed inset-0" onClick={handleClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 bg-white text-zinc-900 rounded-[30px] max-w-3xl w-full shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-zinc-100 bg-zinc-50/80 shrink-0">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                Client Inquiry Portal
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950">
                Let&apos;s Build Your Brand
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-zinc-200/80 hover:bg-zinc-300 text-zinc-700 transition-colors"
              aria-label="Close contact modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="overflow-y-auto p-6 sm:p-8">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 px-4 text-center max-w-md mx-auto space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-orange-100 text-[#EA580C] mx-auto flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-2xl font-bold text-zinc-900">Inquiry Received!</h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Thank you, <span className="font-semibold text-zinc-900">{clientName}</span>. Your brief has been logged in our studio dashboard with reference <span className="font-mono font-bold text-[#EA580C]">{referenceId}</span>.
                </p>
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-600 space-y-1">
                  <p>● Guaranteed response within 24 hours.</p>
                  <p>● Direct email confirmation dispatched to <span className="font-medium text-zinc-800">{email}</span>.</p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleClose}
                    className="w-full bg-[#EA580C] hover:bg-[#D94F04] text-white py-3 px-6 rounded-full font-semibold text-sm transition-all shadow-sm"
                  >
                    Done & Return to Portfolio
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left Side: Form */}
                <form onSubmit={handleSubmit} className="md:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-[#EA580C] focus:ring-2 focus:ring-orange-200 text-sm outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="sarah@company.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-[#EA580C] focus:ring-2 focus:ring-orange-200 text-sm outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Company / Brand
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder="Company name"
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-[#EA580C] focus:ring-2 focus:ring-orange-200 text-sm outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Service Required
                      </label>
                      <select
                        value={service}
                        onChange={e => setService(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-[#EA580C] focus:ring-2 focus:ring-orange-200 text-sm outline-none transition-all bg-white"
                      >
                        <option value="Brand Identity">Brand Identity & Strategy</option>
                        <option value="Graphic Design">Graphic Design & Packaging</option>
                        <option value="Packaging">Luxury Packaging Suite</option>
                        <option value="Editorial">Editorial & Swiss Grid Print</option>
                        <option value="Web Design">Web & UI/UX Design</option>
                        <option value="Full Retainer">Full Studio Retainer</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Project Scope / Type
                      </label>
                      <select
                        value={service}
                        onChange={e => setService(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-[#EA580C] focus:ring-2 focus:ring-orange-200 text-sm outline-none transition-all bg-white"
                      >
                        <option value="New Brand Launch">New Brand Launch</option>
                        <option value="Packaging & Box Redesign">Packaging & Box Redesign</option>
                        <option value="Editorial & Monograph">Editorial & Monograph</option>
                        <option value="Digital UI System">Digital UI System</option>
                        <option value="Full Identity Retainer">Full Identity Retainer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Target Timeline
                      </label>
                      <select
                        value={timeline}
                        onChange={e => setTimeline(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-[#EA580C] focus:ring-2 focus:ring-orange-200 text-sm outline-none transition-all bg-white"
                      >
                        <option value="Within 2 weeks">Within 2 weeks (Rush)</option>
                        <option value="3 - 4 weeks">3 – 4 weeks</option>
                        <option value="1 - 2 months">1 – 2 months</option>
                        <option value="Flexible">Flexible schedule</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Project Goals & Context
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Tell me about your product, audience, and what you aim to achieve..."
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-[#EA580C] focus:ring-2 focus:ring-orange-200 text-sm outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#EA580C] hover:bg-[#D94F04] text-white py-3.5 px-6 rounded-full font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 hover:scale-101 active:scale-99"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Project Inquiry</span>
                    </button>
                  </div>
                </form>

                {/* Right Side: Direct Contact Details & Availability */}
                <div className="md:col-span-4 bg-zinc-50 rounded-2xl p-6 border border-zinc-200/80 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
                      Direct Information
                    </h4>

                    <div className="space-y-3.5 text-xs text-zinc-700">
                      <div className="flex items-start gap-2.5">
                        <Mail className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-zinc-900">Email Directly</p>
                          <a href="mailto:hello@talmeezdesign.com" className="text-zinc-600 hover:text-[#EA580C]">
                            hello@talmeezdesign.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Phone className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-zinc-900">Studio Direct Line</p>
                          <a href="tel:+15553928100" className="text-zinc-600 hover:text-[#EA580C]">
                            +1 (555) 392-8100
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-zinc-900">Studio Base</p>
                          <p className="text-zinc-600">London & Worldwide Remote</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-zinc-900">Working Hours</p>
                          <p className="text-zinc-600">Mon - Fri: 09:00 - 18:00 GMT</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-orange-50/80 rounded-xl border border-orange-200/60 text-xs text-zinc-700">
                    <p className="font-semibold text-[#EA580C] mb-1">Looking for a quick chat?</p>
                    <p className="text-zinc-600 leading-snug">
                      We offer free 20-minute strategic chemistry calls to assess project fit.
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
