import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layout,
  Globe,
  Sparkles,
  PenTool,
  Layers,
  Palette,
  Package,
  Eye,
  ArrowUpRight,
  Check,
  X,
  ArrowRight
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ServiceItem } from '../types';
import { SectionEditBadge } from './cms/SectionEditBadge';

export const ServicesSection: React.FC = () => {
  const { services, openContactWithService } = usePortfolio();
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const visibleServices = services
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-5 h-5 text-white" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-white" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-white" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-white" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-white" />;
      case 'Package':
        return <Package className="w-5 h-5 text-white" />;
      case 'PenTool':
      default:
        return <PenTool className="w-5 h-5 text-white" />;
    }
  };

  return (
    <section id="services" className="py-12 sm:py-16 relative">
      <SectionEditBadge sectionKey="services" sectionTitle="Services" className="top-8 right-8" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sleek Dark Rounded Container */}
        <div className="bg-[#141416] text-white rounded-[32px] p-6 sm:p-10 lg:p-14 shadow-2xl border border-zinc-800 relative overflow-hidden">
          
          {/* Ambient light gradient */}
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-zinc-800/80">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] block mb-2">
                Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                What I Do<span className="text-[#EA580C]">.</span>
              </h2>
            </div>
            <div className="flex items-center gap-3 text-zinc-400 text-sm max-w-sm">
              <p className="leading-relaxed">
                Design solutions that are user-focused, strategy-driven and visually powerful.
              </p>
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Dynamic Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
            {visibleServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                onClick={() => setActiveModalService(service)}
                className="group relative bg-[#1E1E22] hover:bg-[#25252A] p-6 sm:p-7 rounded-2xl border border-zinc-800/90 hover:border-orange-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer min-h-[290px]"
              >
                <div>
                  {/* Service Icon or Graphic */}
                  <div className="w-12 h-12 rounded-xl bg-[#EA580C] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 mb-6 overflow-hidden">
                    {service.image ? (
                      <img src={service.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      getServiceIcon(service.iconName)
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-400 text-sm leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-medium">
                    {service.deliverables?.length || 4} Key Deliverables
                  </span>

                  <div className="w-9 h-9 rounded-full bg-[#EA580C] group-hover:bg-[#FF6A1A] text-white flex items-center justify-center shadow-md transition-all duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>

      {/* Service Scope Modal */}
      <AnimatePresence>
        {activeModalService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="fixed inset-0" onClick={() => setActiveModalService(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 bg-[#1A1A1E] text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-zinc-800 shadow-2xl space-y-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#EA580C] flex items-center justify-center text-white">
                    {getServiceIcon(activeModalService.iconName)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{activeModalService.title}</h3>
                    <span className="text-xs text-orange-400 uppercase tracking-wider font-bold">
                      Full Scope &amp; Delivery
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModalService(null)}
                  className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                {activeModalService.description}
              </p>

              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-zinc-400 mb-2.5">
                  Included In Scope:
                </h4>
                <div className="space-y-2">
                  {activeModalService.deliverables?.map((deliv, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-200">
                      <div className="w-5 h-5 rounded-full bg-orange-500/20 text-[#EA580C] flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    const s = activeModalService.title;
                    setActiveModalService(null);
                    openContactWithService(s);
                  }}
                  className="w-full py-3 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold transition-all text-center"
                >
                  Request Brief for {activeModalService.title} &rarr;
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
