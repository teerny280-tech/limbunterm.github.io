import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SectionEditBadge } from './cms/SectionEditBadge';

export const Hero: React.FC = () => {
  const { openForWork, openContactWithService, studioProfile, heroConfig } = usePortfolio();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = heroConfig.images && heroConfig.images.length > 0
    ? heroConfig.images
    : [
        {
          id: 'default-hero',
          url: '/src/assets/images/hero_designer_portrait_1793179168215.jpg',
          title: 'Design Director',
          caption: 'Brand Architect & Graphic Designer',
          order: 1
        }
      ];

  const totalSlides = slides.length;

  // Autoplay timer
  useEffect(() => {
    if (!heroConfig.autoplay || isPaused || totalSlides <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const durationMs = (heroConfig.slideDuration || 4.5) * 1000;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, durationMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [heroConfig.autoplay, heroConfig.slideDuration, isPaused, totalSlides]);

  const scrollToWork = () => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  // Animation variants based on chosen animationStyle
  const getAnimationVariants = () => {
    const speed = heroConfig.transitionSpeed || 0.8;
    switch (heroConfig.animationStyle) {
      case 'slide-left':
        return {
          initial: { opacity: 0, x: 80 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -80 },
          transition: { duration: speed, ease: 'easeOut' as const }
        };
      case 'slide-right':
        return {
          initial: { opacity: 0, x: -80 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 80 },
          transition: { duration: speed, ease: 'easeOut' as const }
        };
      case 'zoom-in':
        return {
          initial: { opacity: 0, scale: 0.88 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.1 },
          transition: { duration: speed, ease: 'easeOut' as const }
        };
      case 'ken-burns':
        return {
          initial: { opacity: 0, scale: 1 },
          animate: { opacity: 1, scale: 1.15 },
          exit: { opacity: 0, scale: 1.2 },
          transition: { duration: (heroConfig.slideDuration || 5) * 1.1, ease: 'linear' as const }
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: speed, ease: 'easeInOut' as const }
        };
    }
  };

  // Aspect ratio classes
  const getAspectClass = () => {
    switch (heroConfig.aspectRatio) {
      case '1:1':
        return 'aspect-square';
      case '16:9':
        return 'aspect-video';
      case 'asymmetric':
        return 'aspect-[4/5] rounded-[48px] rounded-tr-[12px]';
      case '4:5':
      default:
        return 'aspect-[4/5] rounded-3xl';
    }
  };

  // Image object fit
  const getObjectFitClass = () => {
    switch (heroConfig.displayStyle) {
      case 'contain':
        return 'object-contain';
      case 'fill':
        return 'object-fill';
      case 'cover':
      default:
        return 'object-cover';
    }
  };

  // Image position
  const getObjectPositionClass = () => {
    switch (heroConfig.imagePosition) {
      case 'top':
        return 'object-top';
      case 'bottom':
        return 'object-bottom';
      case 'center':
      default:
        return 'object-center';
    }
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section id="hero" className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden">
      {/* Quick Edit Badge for Section */}
      <SectionEditBadge sectionKey="hero" sectionTitle="Hero Slideshow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start space-y-6 sm:space-y-8"
          >
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 shadow-xs">
              <span className={`w-2 h-2 rounded-full ${openForWork ? 'bg-[#EA580C] animate-pulse' : 'bg-zinc-400'}`} />
              <span className="text-xs font-semibold tracking-wide uppercase text-[#C2410C]">
                {openForWork ? 'Open for Selected Projects' : 'Fully Booked · Waitlist Open'}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#EA580C]" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-950 tracking-tight leading-[1.08] text-balance">
              {studioProfile.headlinePrefix} <br />
              <span className="text-zinc-950 inline-block">
                <span className="text-[#EA580C]">{studioProfile.headlineHighlight}</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-zinc-600 max-w-xl font-normal leading-relaxed">
              {studioProfile.subtitle}
            </p>

            {/* CTAs and Experience Badge */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={scrollToWork}
                className="inline-flex items-center gap-2.5 bg-[#EA580C] hover:bg-[#D94F04] text-white px-7 py-3.5 rounded-full text-base font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>View My Work</span>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </button>

              <button
                onClick={() => openContactWithService()}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-zinc-300 hover:border-zinc-400 bg-white/80 hover:bg-zinc-50 text-zinc-800 text-base font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Hire Me</span>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
              </button>

              <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-100/80 border border-zinc-200 text-zinc-800">
                <div className="w-7 h-7 rounded-xl bg-orange-100 flex items-center justify-center text-[#EA580C]">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-xs leading-tight">
                  <span className="font-bold text-zinc-900 block text-sm">{studioProfile.metricYears}</span>
                  <span className="text-zinc-500 font-medium">Studio Experience</span>
                </div>
              </div>
            </div>

            {/* Quick Skills highlights */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-zinc-500 font-medium border-t border-zinc-200/60 w-full">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C]" /> Brand Systems
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C]" /> Luxury Packaging
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C]" /> Swiss Grid Editorial
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C]" /> High-Res Art Direction
              </span>
            </div>
          </motion.div>

          {/* Right Column: Dynamic Animated Graphic / Portrait Slideshow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center items-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Ambient Background Aura */}
            <div className="relative w-full max-w-[440px] flex items-center justify-center">
              
              {/* Vibrant Warm Orange Circle Glow */}
              <div 
                className="absolute w-[290px] h-[290px] sm:w-[360px] sm:h-[360px] rounded-full bg-gradient-to-tr from-[#EA580C] to-[#FB923C] opacity-90 shadow-2xl -top-2"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(234, 88, 12, 0.35))' }}
              />

              {/* Inner Soft Gradient Ring */}
              <div className="absolute w-[310px] h-[310px] sm:w-[380px] sm:h-[380px] rounded-full border border-orange-300/40 pointer-events-none" />

              {/* High-Resolution Graphic Slideshow Frame */}
              <div className={`relative z-10 w-full overflow-hidden shadow-2xl bg-zinc-900 border-4 border-white/90 ${getAspectClass()}`}>
                <AnimatePresence mode="wait">
                  {currentSlide && (
                    <motion.div
                      key={currentSlide.id}
                      {...getAnimationVariants()}
                      className="absolute inset-0 w-full h-full"
                    >
                      <img
                        src={currentSlide.url}
                        alt={currentSlide.title || 'Studio Showcase Graphic'}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full ${getObjectFitClass()} ${getObjectPositionClass()} filter contrast-[1.02]`}
                      />

                      {/* Subtle Vignette Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                      {/* Slide Caption Banner */}
                      <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                        <p className="text-sm font-bold tracking-tight drop-shadow-sm truncate">
                          {currentSlide.title || 'Studio Direction'}
                        </p>
                        <p className="text-xs text-orange-200/90 font-medium drop-shadow-sm truncate">
                          {currentSlide.caption || 'Brand Identity & Packaging'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Manual Navigation Arrows */}
                {heroConfig.showControls && totalSlides > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-[#EA580C] text-white flex items-center justify-center backdrop-blur-md transition-all z-20 shadow-md"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-[#EA580C] text-white flex items-center justify-center backdrop-blur-md transition-all z-20 shadow-md"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Slide Indicators Dots */}
                {heroConfig.showIndicators && totalSlides > 1 && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          currentIndex === idx ? 'w-5 bg-[#EA580C]' : 'w-1.5 bg-white/70 hover:bg-white'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Floating Mini Accolade Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-4 -left-3 sm:-left-6 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-zinc-200/80 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EA580C] flex items-center justify-center text-white shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-900 leading-snug">Design Excellence</p>
                  <p className="text-[11px] text-zinc-500">Selected Brand Works</p>
                </div>
              </motion.div>

              {/* Floating Client rating chip */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -top-3 -right-3 sm:-right-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-zinc-200/80 flex items-center gap-2 text-xs font-semibold text-zinc-800"
              >
                <span className="text-[#EA580C] text-sm">★</span>
                <span>5.0 Client Rating</span>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
