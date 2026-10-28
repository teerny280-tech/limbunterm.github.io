import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowRight, Eye, Heart, Sparkles, Star } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';
import { SectionEditBadge } from './cms/SectionEditBadge';

export const ProjectsSection: React.FC = () => {
  const {
    projects,
    categories,
    setSelectedProject,
    incrementProjectViews,
    isOwnerMode,
    jumpToCmsSection
  } = usePortfolio();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Dynamic category options from database categories
  const categoryNames = ['All', ...categories.map((c) => c.name)];

  // Show only visible projects on the live site
  const visibleProjects = projects
    .filter((p) => p.visible !== false)
    .sort((a, b) => a.order - b.order);

  const filteredProjects = visibleProjects.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  const displayedProjects = filteredProjects.slice(0, visibleCount);

  const handleCardClick = (project: Project) => {
    incrementProjectViews(project.id);
    setSelectedProject(project);
  };

  return (
    <section id="projects" className="py-14 sm:py-20 relative">
      <SectionEditBadge sectionKey="projects" sectionTitle="Projects & Works" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] block mb-2">
              Featured Work
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950">
              Selected Projects<span className="text-[#EA580C]">.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Dynamic Interactive Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-zinc-100 rounded-full border border-zinc-200/80 overflow-x-auto">
              {categoryNames.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setVisibleCount(6);
                  }}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-[#EA580C] text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Quick Upload Button when in Owner Mode */}
            {isOwnerMode && (
              <button
                onClick={() => jumpToCmsSection('projects')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#EA580C] text-white shadow-xs hover:bg-[#D94F04] transition-all"
              >
                <span>+ Manage Projects</span>
              </button>
            )}
          </div>
        </div>

        {/* 3-Column Project Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => handleCardClick(project)}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-zinc-200/90 hover:border-zinc-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Media Image Showcase */}
                <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                  />

                  {/* Gradient Tint on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badges: Category & Featured */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-zinc-900 backdrop-blur-md shadow-xs">
                      {project.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {project.featured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EA580C] text-white shadow-xs">
                          <Star className="w-3 h-3 fill-white" /> Featured
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-mono text-zinc-700 bg-white/90 backdrop-blur-md">
                        {project.year}
                      </span>
                    </div>
                  </div>

                  {/* Hover Quick Action Indicator */}
                  <div className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 text-[#EA580C]" />
                  </div>
                </div>

                {/* Card Info Section */}
                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                      <span>{project.client}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="font-mono">{project.views}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                          <span className="font-mono">{project.likes}</span>
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-zinc-950 group-hover:text-[#EA580C] transition-colors leading-snug">
                      {project.title}
                    </h3>

                    <p className="text-zinc-600 text-sm leading-relaxed line-clamp-2">
                      {project.summary}
                    </p>
                  </div>

                  {/* Scope Tags / Deliverables */}
                  <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center gap-1.5">
                    {project.deliverables?.slice(0, 3).map((item, dIdx) => (
                      <span
                        key={dIdx}
                        className="px-2.5 py-1 rounded-lg bg-zinc-100 text-[11px] font-medium text-zinc-600"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button */}
        {filteredProjects.length > visibleCount && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 3)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 text-zinc-800 text-sm font-bold shadow-xs hover:shadow-md transition-all"
            >
              <span>Explore More Projects ({filteredProjects.length - visibleCount} remaining)</span>
              <ArrowRight className="w-4 h-4 text-[#EA580C]" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
