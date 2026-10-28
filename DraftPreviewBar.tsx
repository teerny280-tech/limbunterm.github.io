import React from 'react';
import { Eye, CheckCircle2, RotateCcw, ArrowLeft, LayoutDashboard, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const DraftPreviewBar: React.FC = () => {
  const { 
    isOwnerMode, 
    hasDraftChanges, 
    isPreviewMode, 
    setIsPreviewMode, 
    publishAll, 
    discardDraft, 
    setCurrentView 
  } = usePortfolio();

  if (!isOwnerMode) return null;
  if (!isPreviewMode && !hasDraftChanges) return null;

  return (
    <div className="sticky top-0 z-50 bg-[#18181B] text-white border-b border-orange-500/40 px-4 py-2.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left Status info */}
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#EA580C] animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-orange-400">
            {isPreviewMode ? 'Preview Mode Active' : 'Unpublished Draft Changes'}
          </span>
          <span className="hidden sm:inline text-zinc-400">·</span>
          <span className="hidden sm:inline text-zinc-300">
            {isPreviewMode 
              ? 'Viewing your website exactly as visitors will see it upon publishing.' 
              : 'You have changes saved as draft that are not yet live.'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-orange-400" />
            <span>Studio CMS</span>
          </button>

          {hasDraftChanges && (
            <button
              onClick={() => {
                if (window.confirm('Discard all unpublished draft changes and revert to live content?')) {
                  discardDraft();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Discard Draft</span>
            </button>
          )}

          <button
            onClick={() => publishAll()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#D94F04] text-white font-bold shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Publish to Live</span>
          </button>

          {isPreviewMode && (
            <button
              onClick={() => setIsPreviewMode(false)}
              className="px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-white font-medium transition-colors"
            >
              Exit Preview
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
