import React from 'react';
import { Edit3, Settings } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface SectionEditBadgeProps {
  sectionKey: string;
  sectionTitle: string;
  className?: string;
}

export const SectionEditBadge: React.FC<SectionEditBadgeProps> = ({
  sectionKey,
  sectionTitle,
  className = 'top-4 right-4'
}) => {
  const { isOwnerMode, jumpToCmsSection } = usePortfolio();

  if (!isOwnerMode) return null;

  return (
    <div className={`absolute z-30 ${className}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          jumpToCmsSection(sectionKey);
        }}
        className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-[#EA580C] text-white text-xs font-bold shadow-lg border border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
        title={`Edit ${sectionTitle} in Studio CMS`}
      >
        <Edit3 className="w-3.5 h-3.5 text-orange-400 group-hover:text-white transition-colors" />
        <span className="opacity-90 group-hover:opacity-100">Edit {sectionTitle}</span>
      </button>
    </div>
  );
};
