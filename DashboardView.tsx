import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  Briefcase,
  Users,
  HardDrive,
  Globe,
  Menu,
  Phone,
  Sliders,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Eye,
  RotateCcw,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Download,
  PlusCircle,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

// Import CMS Sections
import { HeroEditor } from './cms/HeroEditor';
import { ProjectsManager } from './cms/ProjectsManager';
import { ServicesManager } from './cms/ServicesManager';
import { BrandsManager } from './cms/BrandsManager';
import { MediaLibraryManager } from './cms/MediaLibraryManager';
import { WebsiteContentEditor } from './cms/WebsiteContentEditor';
import { NavigationManager } from './cms/NavigationManager';
import { ContactSocialsManager } from './cms/ContactSocialsManager';
import { SectionsManager } from './cms/SectionsManager';
import { DatabaseSettingsManager } from './cms/DatabaseSettingsManager';
import { InquiryStatus } from '../types';

export const DashboardView: React.FC = () => {
  const {
    setCurrentView,
    activeCmsTab,
    setActiveCmsTab,
    isOwnerMode,
    setIsPinModalOpen,
    hasDraftChanges,
    saveDraft,
    publishAll,
    discardDraft,
    setIsPreviewMode,
    projects,
    categories,
    services,
    brands,
    mediaLibrary,
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    unreadInquiriesCount,
    siteSettings
  } = usePortfolio();

  // Inquiries filter for the Inquiries tab
  const [inquiryFilter, setInquiryFilter] = useState<'All' | InquiryStatus>('All');
  const [inquirySearch, setInquirySearch] = useState('');

  // If not in owner mode, prompt verification
  if (!isOwnerMode) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-zinc-200 text-center shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-[#EA580C] mx-auto flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-950">Studio CMS Protected</h2>
            <p className="text-xs text-zinc-500 mt-1">
              Access to the Website Content Management System is restricted to authorized studio administrators.
            </p>
          </div>
          <button
            onClick={() => setIsPinModalOpen(true)}
            className="w-full py-3 px-6 rounded-2xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-sm font-bold shadow-md transition-all"
          >
            Authenticate Admin Mode
          </button>
        </div>
      </div>
    );
  }

  // Tab definitions
  const NAV_TABS = [
    { id: 'overview', label: 'Overview & Stats', icon: LayoutDashboard },
    { id: 'hero', label: 'Hero Slideshow', icon: Sparkles, badge: 'Graphic' },
    { id: 'projects', label: 'Projects & Works', icon: Layers, count: projects.length },
    { id: 'services', label: 'Services', icon: Briefcase, count: services.length },
    { id: 'brands', label: 'Clients & Brands', icon: Users, count: brands.length },
    { id: 'media', label: 'Media Assets', icon: HardDrive, count: mediaLibrary.length },
    { id: 'content', label: 'Content & Branding', icon: Globe },
    { id: 'navigation', label: 'Navigation Menu', icon: Menu },
    { id: 'contact', label: 'Contact & Socials', icon: Phone },
    { id: 'sections', label: 'Section Ordering', icon: Sliders },
    { id: 'inquiries', label: 'Client Inquiries', icon: Mail, count: unreadInquiriesCount, highlight: unreadInquiriesCount > 0 },
    { id: 'database', label: 'Database & Security', icon: ShieldCheck }
  ];

  // Inquiries filtering
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = inquiryFilter === 'All' ? true : inq.status === inquiryFilter;
    const matchesSearch =
      inq.clientName.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      (inq.company && inq.company.toLowerCase().includes(inquirySearch.toLowerCase())) ||
      inq.service.toLowerCase().includes(inquirySearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-zinc-900 pb-20">
      
      {/* Top Admin Navigation Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand & Mode */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('portfolio')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors pr-3 border-r border-zinc-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Live Website</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-sm font-extrabold text-zinc-950 uppercase tracking-wider">
                Studio CMS Dashboard
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-[#EA580C] font-mono font-bold">
                Admin
              </span>
            </div>
          </div>

          {/* Quick Publish / Save Draft / Preview Controls */}
          <div className="flex items-center gap-2.5">
            {hasDraftChanges && (
              <span className="hidden sm:inline text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                Unsaved Draft Pending
              </span>
            )}

            <button
              onClick={() => {
                setIsPreviewMode(true);
                setCurrentView('portfolio');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-700 text-xs font-bold transition-all shadow-xs"
            >
              <Eye className="w-3.5 h-3.5 text-orange-600" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => publishAll()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Publish Live</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main CMS Layout with Sidebar + Work Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Navigation (cols 1-3) */}
          <div className="lg:col-span-3">
            <div className="sticky top-20 bg-white rounded-3xl p-3 border border-zinc-200/80 shadow-xs space-y-1">
              {NAV_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeCmsTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCmsTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#EA580C] text-white shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                      <span className="truncate">{tab.label}</span>
                    </div>

                    {tab.count !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : tab.highlight
                            ? 'bg-orange-100 text-[#EA580C] font-bold'
                            : 'bg-zinc-100 text-zinc-500'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                    {tab.badge && (
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${
                          isActive ? 'bg-white/20 text-white' : 'bg-orange-50 text-[#EA580C]'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Work Area Content (cols 4-12) */}
          <div className="lg:col-span-9 min-h-[600px]">
            
            {/* Tab: Overview & Analytics */}
            {activeCmsTab === 'overview' && (
              <div className="space-y-8">
                
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                  <div className="relative z-10 space-y-2 max-w-xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                      Studio Content Management Engine
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight">
                      Welcome, Studio Administrator.
                    </h2>
                    <p className="text-sm text-zinc-300 leading-relaxed pt-1">
                      Full control over every aspect of <span className="text-white font-bold">{siteSettings.siteName}</span> without touching code. Edit projects, upload multi-image media, reorder slides, and update client contact channels.
                    </p>
                  </div>
                </div>

                {/* 4-Card Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-1">
                    <span className="text-xs text-zinc-400 font-bold uppercase">Projects</span>
                    <h3 className="text-3xl font-extrabold text-zinc-950 font-mono">
                      {projects.length}
                    </h3>
                    <span className="text-[11px] text-zinc-500 block">
                      {projects.filter((p) => p.featured).length} featured showcase
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-1">
                    <span className="text-xs text-zinc-400 font-bold uppercase">Media Assets</span>
                    <h3 className="text-3xl font-extrabold text-zinc-950 font-mono">
                      {mediaLibrary.length}
                    </h3>
                    <span className="text-[11px] text-zinc-500 block">Stored in IndexedDB</span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-1">
                    <span className="text-xs text-zinc-400 font-bold uppercase">Services</span>
                    <h3 className="text-3xl font-extrabold text-zinc-950 font-mono">
                      {services.length}
                    </h3>
                    <span className="text-[11px] text-zinc-500 block">Active capabilities</span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-1">
                    <span className="text-xs text-zinc-400 font-bold uppercase">Client Leads</span>
                    <h3 className="text-3xl font-extrabold text-[#EA580C] font-mono">
                      {inquiries.length}
                    </h3>
                    <span className="text-[11px] text-zinc-500 block">
                      {unreadInquiriesCount} new inquiries
                    </span>
                  </div>
                </div>

                {/* Quick Navigation Shortcuts */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-zinc-950">Quick Editorial Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setActiveCmsTab('hero')}
                      className="p-4 rounded-2xl border border-zinc-200 hover:border-[#EA580C] bg-zinc-50/50 hover:bg-orange-50/30 text-left transition-all group"
                    >
                      <Sparkles className="w-5 h-5 text-[#EA580C] mb-2" />
                      <h4 className="text-xs font-bold text-zinc-900 group-hover:text-[#EA580C]">
                        Hero Slideshow Editor &rarr;
                      </h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Adjust transitions, autoplay, and banner graphics.
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveCmsTab('projects')}
                      className="p-4 rounded-2xl border border-zinc-200 hover:border-[#EA580C] bg-zinc-50/50 hover:bg-orange-50/30 text-left transition-all group"
                    >
                      <Layers className="w-5 h-5 text-[#EA580C] mb-2" />
                      <h4 className="text-xs font-bold text-zinc-900 group-hover:text-[#EA580C]">
                        Manage Projects &amp; Categories &rarr;
                      </h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Add works, multi-image uploads, and categories.
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveCmsTab('media')}
                      className="p-4 rounded-2xl border border-zinc-200 hover:border-[#EA580C] bg-zinc-50/50 hover:bg-orange-50/30 text-left transition-all group"
                    >
                      <HardDrive className="w-5 h-5 text-[#EA580C] mb-2" />
                      <h4 className="text-xs font-bold text-zinc-900 group-hover:text-[#EA580C]">
                        Media Assets Library &rarr;
                      </h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Upload images/videos with in-use checks.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Recent Inquiries Snippet */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-zinc-950">Recent Client Inquiries</h3>
                    <button
                      onClick={() => setActiveCmsTab('inquiries')}
                      className="text-xs font-bold text-[#EA580C] hover:underline"
                    >
                      View All ({inquiries.length}) &rarr;
                    </button>
                  </div>

                  <div className="divide-y divide-zinc-100">
                    {inquiries.slice(0, 3).map((inq) => (
                      <div key={inq.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="font-bold text-zinc-900 block">{inq.clientName}</span>
                          <span className="text-zinc-500">{inq.service} · {inq.email}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-[#EA580C]">
                          {inq.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab: Hero Slideshow */}
            {activeCmsTab === 'hero' && <HeroEditor />}

            {/* Tab: Projects & Works */}
            {activeCmsTab === 'projects' && <ProjectsManager />}

            {/* Tab: Services */}
            {activeCmsTab === 'services' && <ServicesManager />}

            {/* Tab: Clients & Brands */}
            {activeCmsTab === 'brands' && <BrandsManager />}

            {/* Tab: Media Assets Library */}
            {activeCmsTab === 'media' && <MediaLibraryManager />}

            {/* Tab: Content & Branding */}
            {activeCmsTab === 'content' && <WebsiteContentEditor />}

            {/* Tab: Navigation Menu */}
            {activeCmsTab === 'navigation' && <NavigationManager />}

            {/* Tab: Contact & Socials */}
            {activeCmsTab === 'contact' && <ContactSocialsManager />}

            {/* Tab: Section Ordering */}
            {activeCmsTab === 'sections' && <SectionsManager />}

            {/* Tab: Client Inquiries Portal */}
            {activeCmsTab === 'inquiries' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                      Lead Generation
                    </span>
                    <h2 className="text-2xl font-extrabold text-zinc-950">Client Inquiries Portal</h2>
                    <p className="text-sm text-zinc-500 mt-0.5">
                      Review client briefs submitted via the public contact intake form.
                    </p>
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {(['All', 'New', 'In Discussion', 'Booked', 'Archived'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setInquiryFilter(st as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          inquiryFilter === st
                            ? 'bg-[#EA580C] text-white shadow-xs'
                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search inquiries..."
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      className="w-full px-3.5 py-1.5 rounded-xl bg-zinc-100 border border-zinc-200 text-xs outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                {/* Inquiries List */}
                <div className="space-y-3">
                  {filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-zinc-950">{inq.clientName}</h4>
                            {inq.company && (
                              <span className="text-xs text-zinc-500 font-medium">({inq.company})</span>
                            )}
                            <span className="text-xs text-zinc-400 font-mono">· {inq.date}</span>
                          </div>
                          <span className="text-xs text-[#EA580C] font-semibold">{inq.service}</span>
                        </div>

                        {/* Status Select */}
                        <select
                          value={inq.status}
                          onChange={(e) => updateInquiryStatus(inq.id, e.target.value as InquiryStatus)}
                          className="px-2.5 py-1 rounded-lg border border-zinc-200 text-xs font-bold outline-none bg-zinc-50"
                        >
                          <option value="New">New</option>
                          <option value="In Discussion">In Discussion</option>
                          <option value="Booked">Booked</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>

                      <p className="text-xs text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-100 leading-relaxed">
                        {inq.message}
                      </p>

                      <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                        <span>Timeline: <strong className="text-zinc-800">{inq.timeline}</strong></span>
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${inq.email}`}
                            className="px-3 py-1 rounded-lg bg-zinc-800 text-white font-bold text-[11px]"
                          >
                            Reply Email
                          </a>
                          <button
                            onClick={() => deleteInquiry(inq.id)}
                            className="p-1 rounded-lg text-rose-600 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Database & Security */}
            {activeCmsTab === 'database' && <DatabaseSettingsManager />}

          </div>

        </div>
      </div>

    </div>
  );
};
