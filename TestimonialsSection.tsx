import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SectionEditBadge } from './cms/SectionEditBadge';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = usePortfolio();
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleTestimonials = testimonials.filter((t) => t.visible !== false);

  if (visibleTestimonials.length === 0) return null;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? visibleTestimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === visibleTestimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="py-14 sm:py-20 bg-zinc-50/50 border-y border-zinc-200/60 relative">
      <SectionEditBadge sectionKey="content" sectionTitle="Testimonials" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] block mb-2">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950">
              Trusted by Great Clients<span className="text-[#EA580C]">.</span>
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-100 text-zinc-700 flex items-center justify-center transition-all shadow-xs"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-100 text-zinc-700 flex items-center justify-center transition-all shadow-xs"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonials in Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {visibleTestimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* 5 Orange Stars */}
                <div className="flex items-center gap-1 mb-4 text-[#EA580C]">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#EA580C]" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-zinc-700 text-sm sm:text-base leading-relaxed italic mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-[#EA580C] font-bold text-xs flex items-center justify-center border border-orange-200">
                  {item.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 leading-tight">
                    {item.author}
                  </h4>
                  <p className="text-xs text-zinc-500">
                    {item.role}, <span className="text-zinc-700 font-medium">{item.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
