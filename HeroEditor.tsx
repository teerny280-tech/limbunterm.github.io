import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  Sliders,
  Image as ImageIcon,
  Sparkles,
  Save,
  Eye,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  RotateCw,
  FolderOpen
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  HeroSlideImage,
  SlideshowAnimationStyle,
  ImageDisplayStyle,
  ImageAspectRatio,
  ImagePosition
} from '../../types';
import { MediaPickerModal } from './MediaPickerModal';

export const HeroEditor: React.FC = () => {
  const {
    heroConfig,
    updateHeroConfig,
    studioProfile,
    updateStudioProfile,
    saveDraft,
    publishAll,
    setIsPreviewMode,
    setCurrentView,
    uploadMedia
  } = usePortfolio();

  // Local state for live preview testing
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  // Current slides
  const slides = heroConfig.images || [];

  // Reorder slide up/down
  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === slides.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...slides];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const normalized = reordered.map((s, idx) => ({ ...s, order: idx + 1 }));
    updateHeroConfig({ images: normalized });
  };

  // Delete slide
  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      alert('You must have at least one hero banner image.');
      return;
    }
    const filtered = slides
      .filter((s) => s.id !== id)
      .map((s, idx) => ({ ...s, order: idx + 1 }));
    updateHeroConfig({ images: filtered });
    if (activeSlideIndex >= filtered.length) {
      setActiveSlideIndex(Math.max(0, filtered.length - 1));
    }
  };

  // Multiple files direct upload
  const handleMultipleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newSlides: HeroSlideImage[] = [...slides];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const asset = await uploadMedia(file);
        newSlides.push({
          id: `slide-${Date.now()}-${i}`,
          url: asset.dataUrl,
          title: file.name.replace(/\.[^/.]+$/, ''),
          caption: 'Studio Creative Showcase',
          order: newSlides.length + 1
        });
      } catch (err) {
        console.error('Error uploading slide file:', err);
      }
    }

    updateHeroConfig({ images: newSlides });
    if (multiFileInputRef.current) multiFileInputRef.current.value = '';
  };

  // Handle media picked from Media Assets Library
  const handleMediaPicked = (url: string) => {
    if (replaceTargetId) {
      // Replace existing slide image
      const updated = slides.map((s) => (s.id === replaceTargetId ? { ...s, url } : s));
      updateHeroConfig({ images: updated });
      setReplaceTargetId(null);
    } else {
      // Add new slide
      const newSlide: HeroSlideImage = {
        id: `slide-${Date.now()}`,
        url,
        title: 'New Hero Graphic',
        caption: 'Creative Direction',
        order: slides.length + 1
      };
      updateHeroConfig({ images: [...slides, newSlide] });
    }
    setIsMediaPickerOpen(false);
  };

  // Edit slide title / caption
  const handleSlideTextChange = (id: string, field: 'title' | 'caption', val: string) => {
    const updated = slides.map((s) => (s.id === id ? { ...s, [field]: val } : s));
    updateHeroConfig({ images: updated });
  };

  // Animation style variants for preview
  const getAnimationProps = () => {
    switch (heroConfig.animationStyle) {
      case 'slide-left':
        return {
          initial: { opacity: 0, x: 60 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -60 }
        };
      case 'slide-right':
        return {
          initial: { opacity: 0, x: -60 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 60 }
        };
      case 'zoom-in':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.08 }
        };
      case 'ken-burns':
        return {
          initial: { opacity: 0, scale: 1 },
          animate: { opacity: 1, scale: 1.12 },
          exit: { opacity: 0, scale: 1.18 }
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar with Save Draft, Preview, Publish */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            Homepage Center Editor
          </span>
          <h2 className="text-2xl font-extrabold text-zinc-950">
            Hero Portrait &amp; Banner Graphic Slideshow
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Manage single or multi-image slideshow, transitions, autoplay, aspect ratio, and typography.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => saveDraft('Hero settings saved to draft')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all shadow-xs"
          >
            <Save className="w-4 h-4 text-zinc-500" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => {
              setIsPreviewMode(true);
              setCurrentView('portfolio');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Eye className="w-4 h-4 text-orange-400" />
            <span>Preview on Website</span>
          </button>

          <button
            onClick={() => publishAll()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Slideshow Settings & Images Manager (cols 1-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section A: Multi-Image Slides List */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-950">
                  Banner Images ({slides.length})
                </h3>
                <p className="text-xs text-zinc-500">
                  Upload multiple graphics, reorder sequence, or pick from Media Assets Library.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Hidden multiple file upload input */}
                <input
                  ref={multiFileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleMultipleUpload}
                  className="hidden"
                />

                <button
                  onClick={() => multiFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-xs font-bold text-zinc-700 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Files</span>
                </button>

                <button
                  onClick={() => {
                    setReplaceTargetId(null);
                    setIsMediaPickerOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-xs font-bold text-white transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Media Library</span>
                </button>
              </div>
            </div>

            {/* Slide items list */}
            <div className="space-y-3">
              {slides.map((slide, index) => {
                const isActive = activeSlideIndex === index;
                return (
                  <div
                    key={slide.id}
                    className={`flex flex-col sm:flex-row sm:items-center gap-4 p-3.5 rounded-2xl border transition-all ${
                      isActive
                        ? 'border-[#EA580C] bg-orange-50/40 shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/60'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => setActiveSlideIndex(index)}
                      className="w-16 h-16 rounded-xl bg-zinc-200 overflow-hidden relative shrink-0 cursor-pointer border border-zinc-300"
                    >
                      <img
                        src={slide.url}
                        alt={slide.title || `Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1 rounded">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Metadata inputs */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <input
                        type="text"
                        placeholder="Slide title / label"
                        value={slide.title || ''}
                        onChange={(e) => handleSlideTextChange(slide.id, 'title', e.target.value)}
                        className="w-full text-xs font-bold text-zinc-900 bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#EA580C]"
                      />
                      <input
                        type="text"
                        placeholder="Subtitle / caption"
                        value={slide.caption || ''}
                        onChange={(e) => handleSlideTextChange(slide.id, 'caption', e.target.value)}
                        className="w-full text-[11px] text-zinc-500 bg-white border border-zinc-200 rounded-lg px-2.5 py-1 outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    {/* Actions: Reorder, Replace, Delete */}
                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleMoveSlide(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveSlide(index, 'down')}
                        disabled={index === slides.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setReplaceTargetId(slide.id);
                          setIsMediaPickerOpen(true);
                        }}
                        title="Replace Image"
                        className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlide(slide.id)}
                        disabled={slides.length <= 1}
                        title="Delete Slide"
                        className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-rose-50 text-rose-600 disabled:opacity-30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: Slideshow Animation & Timing Settings */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#EA580C]" />
              <span>Slideshow &amp; Animation Styles</span>
            </h3>

            {/* Animation Style Selector */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Slide Transition Animation Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: 'fade', label: 'Fade' },
                  { id: 'slide-left', label: 'Slide Left' },
                  { id: 'slide-right', label: 'Slide Right' },
                  { id: 'zoom-in', label: 'Zoom In' },
                  { id: 'ken-burns', label: 'Ken Burns' }
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() =>
                      updateHeroConfig({ animationStyle: style.id as SlideshowAnimationStyle })
                    }
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                      heroConfig.animationStyle === style.id
                        ? 'border-[#EA580C] bg-orange-50 text-[#EA580C] shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-600 bg-zinc-50/50'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders: Duration & Transition Speed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-700">Slide Display Duration</span>
                  <span className="font-mono font-bold text-[#EA580C]">
                    {heroConfig.slideDuration}s
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="0.5"
                  value={heroConfig.slideDuration}
                  onChange={(e) => updateHeroConfig({ slideDuration: parseFloat(e.target.value) })}
                  className="w-full accent-[#EA580C] cursor-pointer"
                />
                <span className="text-[10px] text-zinc-400 block">
                  Time each graphic stays visible before advancing.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-700">Transition Animation Speed</span>
                  <span className="font-mono font-bold text-[#EA580C]">
                    {heroConfig.transitionSpeed}s
                  </span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.5"
                  step="0.1"
                  value={heroConfig.transitionSpeed}
                  onChange={(e) =>
                    updateHeroConfig({ transitionSpeed: parseFloat(e.target.value) })}
                  className="w-full accent-[#EA580C] cursor-pointer"
                />
                <span className="text-[10px] text-zinc-400 block">
                  Smoothness duration of cross-fade or motion.
                </span>
              </div>
            </div>

            {/* Autoplay & Controls toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={heroConfig.autoplay}
                  onChange={(e) => updateHeroConfig({ autoplay: e.target.checked })}
                  className="w-4 h-4 accent-[#EA580C] rounded"
                />
                <span className="text-xs font-bold text-zinc-800">Autoplay Slides</span>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={heroConfig.showControls}
                  onChange={(e) => updateHeroConfig({ showControls: e.target.checked })}
                  className="w-4 h-4 accent-[#EA580C] rounded"
                />
                <span className="text-xs font-bold text-zinc-800">Prev/Next Arrows</span>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={heroConfig.showIndicators}
                  onChange={(e) => updateHeroConfig({ showIndicators: e.target.checked })}
                  className="w-4 h-4 accent-[#EA580C] rounded"
                />
                <span className="text-xs font-bold text-zinc-800">Slide Indicators</span>
              </label>
            </div>

            {/* Display Style, Aspect Ratio & Image Positioning */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Display Style
                </label>
                <select
                  value={heroConfig.displayStyle}
                  onChange={(e) =>
                    updateHeroConfig({ displayStyle: e.target.value as ImageDisplayStyle })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-semibold bg-white outline-none focus:border-[#EA580C]"
                >
                  <option value="cover">Cover (Fill &amp; Crop)</option>
                  <option value="contain">Contain (Full Image)</option>
                  <option value="fill">Stretch / Fill</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Aspect Ratio
                </label>
                <select
                  value={heroConfig.aspectRatio}
                  onChange={(e) =>
                    updateHeroConfig({ aspectRatio: e.target.value as ImageAspectRatio })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-semibold bg-white outline-none focus:border-[#EA580C]"
                >
                  <option value="4:5">Portrait (4:5) — Classic Designer</option>
                  <option value="1:1">Square (1:1) — Clean Grid</option>
                  <option value="16:9">Wide Landscape (16:9)</option>
                  <option value="asymmetric">Modern Asymmetric Rounded</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Image Positioning
                </label>
                <select
                  value={heroConfig.imagePosition}
                  onChange={(e) =>
                    updateHeroConfig({ imagePosition: e.target.value as ImagePosition })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-semibold bg-white outline-none focus:border-[#EA580C]"
                >
                  <option value="center">Center / Balance</option>
                  <option value="top">Focus Top (Face / Subject)</option>
                  <option value="bottom">Focus Bottom</option>
                </select>
              </div>
            </div>

          </div>

          {/* Section C: Hero Copy & Headlines */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-zinc-950">
              Hero Headlines &amp; Callout Text
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Headline Prefix
                </label>
                <input
                  type="text"
                  value={studioProfile.headlinePrefix}
                  onChange={(e) => updateStudioProfile({ headlinePrefix: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Headline Highlight (Orange)
                </label>
                <input
                  type="text"
                  value={studioProfile.headlineHighlight}
                  onChange={(e) => updateStudioProfile({ headlineHighlight: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-[#EA580C] outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Hero Subtitle Copy
              </label>
              <textarea
                rows={3}
                value={studioProfile.subtitle}
                onChange={(e) => updateStudioProfile({ subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Live Interactive Slideshow Preview (cols 8-12) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                  Live Slideshow Simulator
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {activeSlideIndex + 1} / {slides.length}
              </span>
            </div>

            {/* Simulated Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-zinc-900 shadow-xl border border-zinc-800 aspect-[4/5] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {slides[activeSlideIndex] && (
                  <motion.div
                    key={slides[activeSlideIndex].id}
                    {...getAnimationProps()}
                    transition={{
                      duration: heroConfig.transitionSpeed || 0.8,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={slides[activeSlideIndex].url}
                      alt={slides[activeSlideIndex].title || 'Slide'}
                      className={`w-full h-full ${
                        heroConfig.displayStyle === 'contain'
                          ? 'object-contain'
                          : heroConfig.displayStyle === 'fill'
                          ? 'object-fill'
                          : 'object-cover'
                      } ${
                        heroConfig.imagePosition === 'top'
                          ? 'object-top'
                          : heroConfig.imagePosition === 'bottom'
                          ? 'object-bottom'
                          : 'object-center'
                      }`}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                    {/* Title / Caption Pill */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-sm font-bold truncate">
                        {slides[activeSlideIndex].title || 'Studio Showcase'}
                      </p>
                      <p className="text-xs text-orange-300 truncate">
                        {slides[activeSlideIndex].caption || 'Graphic Design & Packaging'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Prev / Next Arrows */}
              {heroConfig.showControls && slides.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
                    }
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-[#EA580C] text-white flex items-center justify-center backdrop-blur-xs transition-colors z-20"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-[#EA580C] text-white flex items-center justify-center backdrop-blur-xs transition-colors z-20"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Indicators */}
              {heroConfig.showIndicators && slides.length > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeSlideIndex === idx ? 'w-5 bg-[#EA580C]' : 'w-1.5 bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Summary Specs */}
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Transition:</span>
                <span className="font-bold text-zinc-900 uppercase">
                  {heroConfig.animationStyle}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duration / Speed:</span>
                <span className="font-bold text-zinc-900">
                  {heroConfig.slideDuration}s / {heroConfig.transitionSpeed}s
                </span>
              </div>
              <div className="flex justify-between">
                <span>Autoplay:</span>
                <span className="font-bold text-zinc-900">
                  {heroConfig.autoplay ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        title={replaceTargetId ? 'Replace Hero Banner Image' : 'Select Hero Banner Image'}
        allowedType="image"
        onSelect={handleMediaPicked}
        onClose={() => {
          setIsMediaPickerOpen(false);
          setReplaceTargetId(null);
        }}
      />
    </div>
  );
};
