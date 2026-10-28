import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Users } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SectionEditBadge } from './cms/SectionEditBadge';

export const BrandsSection: React.FC = () => {
  const { brands } = usePortfolio();

  const visibleBrands = brands
    .filter((b) => b.visible !== false)
    .sort((a, b) => a.order - b.order);

  if (visibleBrands.length === 0) return null;

  return (
    <section id="brands" className="py-12 sm:py-16 bg-zinc-50/60 border-y border-zinc-200/60 relative">
      <SectionEditBadge sectionKey="brands" sectionTitle="Clients & Brands" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] block mb-2">
            Collaborations
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            Trusted by Ambitious Brands<span className="text-[#EA580C]">.</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2">
            Partnering with visionary startups and global leaders to deliver iconic packaging, editorial design, and visual brand identities.
          </p>
        </div>

        {/* Brands Grid / Logo Showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {visibleBrands.map((brand, idx) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group bg-white rounded-2xl p-5 border border-zinc-200/80 hover:border-orange-500/50 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center space-y-2.5 min-h-[140px]"
            >
              {/* Logo container */}
              <div className="w-14 h-14 rounded-xl flex items-center justify-center p-1 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                />
              </div>

              <div>
                <h4 className="text-xs font-bold text-zinc-900 group-hover:text-[#EA580C] transition-colors leading-tight">
                  {brand.name}
                </h4>
                {brand.industry && (
                  <span className="text-[10px] text-zinc-400 font-medium block">
                    {brand.industry}
                  </span>
                )}
              </div>

              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-semibold text-zinc-400 hover:text-[#EA580C] inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span>Visit</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
