import React from 'react';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit3,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { WebsiteSection } from '../../types';

export const SectionsManager: React.FC = () => {
  const { websiteSections, updateWebsiteSections, setActiveCmsTab } = usePortfolio();

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === websiteSections.length - 1)) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...websiteSections];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    updateWebsiteSections(reordered);
  };

  const handleToggle = (id: string) => {
    const updated = websiteSections.map((sec) =>
      sec.id === id ? { ...sec, visible: !sec.visible } : sec
    );
    updateWebsiteSections(updated);
  };

  const getSectionTargetTab = (key: WebsiteSection['key']) => {
    switch (key) {
      case 'hero':
        return 'hero';
      case 'projects':
        return 'projects';
      case 'services':
        return 'services';
      case 'brands':
        return 'brands';
      case 'about':
        return 'content';
      case 'testimonials':
        return 'content';
      case 'cta':
        return 'content';
      case 'contact':
        return 'contact';
      default:
        return 'overview';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            Homepage Architecture
          </span>
          <h2 className="text-2xl font-extrabold text-zinc-950">Homepage Section Order &amp; Visibility</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Reorder page sections or toggle visibility on the public facing site with a single click.
          </p>
        </div>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-3">
        {websiteSections.map((section, index) => (
          <div
            key={section.id}
            className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all ${
              section.visible
                ? 'border-zinc-200/80 bg-zinc-50/50 hover:border-zinc-300'
                : 'border-zinc-200 bg-zinc-100/60 opacity-60'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-xl bg-orange-100 text-[#EA580C] font-mono font-bold text-xs flex items-center justify-center">
                #{index + 1}
              </span>
              <div>
                <h4 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                  <span>{section.label}</span>
                  {!section.visible && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-600">
                      Hidden from Live Site
                    </span>
                  )}
                </h4>
                <p className="text-xs text-zinc-400 font-mono">
                  Anchor ID: #{section.key}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMove(index, 'up')}
                disabled={index === 0}
                className="p-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600 disabled:opacity-30"
                title="Move Section Up"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleMove(index, 'down')}
                disabled={index === websiteSections.length - 1}
                className="p-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600 disabled:opacity-30"
                title="Move Section Down"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleToggle(section.id)}
                className={`p-2 rounded-xl border transition-colors ${
                  section.visible
                    ? 'border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700'
                }`}
                title={section.visible ? 'Hide section' : 'Show section'}
              >
                {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setActiveCmsTab(getSectionTargetTab(section.key))}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-colors"
                title="Edit this section's content"
              >
                <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">Edit Content</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
