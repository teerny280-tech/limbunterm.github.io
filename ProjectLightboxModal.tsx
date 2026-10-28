import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Heart,
  Eye,
  ArrowUpRight,
  Check,
  Calendar,
  User,
  Tag,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const ProjectLightboxModal: React.FC = () => {
  const { selectedProject, setSelectedProject, likeProject, openContactWithService } = usePortfolio();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    setActiveImageIndex(0);
    setZoomLevel(1);
    setHasLiked(false);
  }, [selectedProject?.id]);

  if (!selectedProject) return null;

  const gallery = selectedProject.galleryImages && selectedProject.galleryImages.length > 0
    ? selectedProject.galleryImages
    : [selectedProject.image];

  const currentImageUrl = gallery[activeImageIndex] || selectedProject.image;

  const handleClose = () => {
    setZoomLevel(1);
    setHasLiked(false);
    setSelectedProject(null);
  };

  const handleLike = () => {
    if (!hasLiked) {
      likeProject(selectedProject.id);
      setHasLiked(true);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % gallery.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        
        {/* Click outside to close */}
        <div className="fixed inset-0" onClick={handleClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 bg-white text-zinc-900 rounded-[28px] max-w-5xl w-full shadow-2xl overflow-hidden border border-zinc-200 my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/70 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                {selectedProject.category}
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-xs text-zinc-500 font-mono">{selectedProject.year}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="hidden sm:flex items-center bg-zinc-100 rounded-full p-1 border border-zinc-200">
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(1, prev - 0.25))}
                  disabled={zoomLevel <= 1}
                  className="p-1.5 rounded-full hover:bg-white text-zinc-600 disabled:opacity-40 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 text-zinc-600">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.25))}
                  disabled={zoomLevel >= 2.5}
                  className="p-1.5 rounded-full hover:bg-white text-zinc-600 disabled:opacity-40 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  hasLiked 
                    ? 'bg-rose-50 border-rose-200 text-rose-600' 
                    : 'bg-white border-zinc-200 text-zinc-700 hover:border-rose-300 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span className="font-mono">{selectedProject.likes + (hasLiked ? 1 : 0)}</span>
              </button>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Content Area */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
            
            {/* High-Resolution Media Container with Gallery Controls & Zoom */}
            <div className="relative bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200/80 flex items-center justify-center min-h-[320px] sm:min-h-[460px]">
              <div 
                className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out cursor-zoom-in"
                style={{ transform: `scale(${zoomLevel})` }}
                onClick={() => setZoomLevel((prev) => (prev === 1 ? 1.5 : 1))}
              >
                <img
                  src={currentImageUrl}
                  alt={selectedProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[580px] object-contain rounded-xl shadow-xs"
                />
              </div>

              {/* Gallery Prev / Next */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#EA580C] text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md z-20"
                    title="Previous Image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#EA580C] text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md z-20"
                    title="Next Image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* High-Res Tag & Counter */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                {gallery.length > 1 && (
                  <span className="bg-black/70 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-full">
                    {activeImageIndex + 1} / {gallery.length}
                  </span>
                )}
                <div className="bg-black/70 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-orange-400" />
                  <span>High-Resolution Master</span>
                </div>
              </div>
            </div>

            {/* Gallery Thumbnails Strip */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
                {gallery.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#EA580C] ring-2 ring-[#EA580C]/20 shadow-md scale-105'
                        : 'border-zinc-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Project Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Title, Client, Narrative */}
              <div className="lg:col-span-8 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                  {selectedProject.title}
                </h3>
                
                <p className="text-zinc-600 text-base leading-relaxed">
                  {selectedProject.description}
                </p>

                {/* Key Deliverables */}
                {selectedProject.deliverables && selectedProject.deliverables.length > 0 && (
                  <div className="pt-4">
                    <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-3">
                      Project Deliverables &amp; Scope
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedProject.deliverables.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-zinc-700 bg-zinc-50 border border-zinc-200/70 px-3.5 py-2 rounded-xl">
                          <Check className="w-4 h-4 text-[#EA580C] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Palette Chips */}
                {selectedProject.colorPalette && selectedProject.colorPalette.length > 0 && (
                  <div className="pt-4">
                    <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2.5">
                      Curated Color Architecture
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedProject.colorPalette.map((hex, index) => (
                        <div key={index} className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 rounded-lg px-2.5 py-1.5">
                          <div className="w-4 h-4 rounded-md shadow-xs border border-black/10" style={{ backgroundColor: hex }} />
                          <span className="text-xs font-mono text-zinc-700 font-medium">{hex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Project Meta Sidebar */}
              <div className="lg:col-span-4 bg-zinc-50 rounded-2xl p-6 border border-zinc-200/80 space-y-5">
                <div className="space-y-3 pb-5 border-b border-zinc-200/80">
                  <div className="flex items-center gap-2.5 text-zinc-600 text-xs font-semibold">
                    <User className="w-4 h-4 text-zinc-400" />
                    <span>Client: <strong className="text-zinc-900">{selectedProject.client}</strong></span>
                  </div>

                  <div className="flex items-center gap-2.5 text-zinc-600 text-xs font-semibold">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span>Year: <strong className="text-zinc-900">{selectedProject.year}</strong></span>
                  </div>

                  <div className="flex items-center gap-2.5 text-zinc-600 text-xs font-semibold">
                    <Eye className="w-4 h-4 text-zinc-400" />
                    <span>Portfolio Views: <strong className="text-zinc-900 font-mono">{selectedProject.views}</strong></span>
                  </div>
                </div>

                {/* Tags */}
                {selectedProject.tags && selectedProject.tags.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                      Discipline Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.tags.map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-zinc-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA inside Lightbox */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      const service = selectedProject.category;
                      handleClose();
                      openContactWithService(service);
                    }}
                    className="w-full bg-[#EA580C] hover:bg-[#D94F04] text-white py-3 px-4 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Commission Similar Project</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
