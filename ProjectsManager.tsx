import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ArrowUp,
  ArrowDown,
  Tag,
  FolderPlus,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Layers,
  Sparkles,
  Palette,
  ExternalLink
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project, ProjectCategoryItem } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { MediaPickerModal } from './MediaPickerModal';

export const ProjectsManager: React.FC = () => {
  const {
    projects,
    categories,
    addProject,
    updateProject,
    deleteProject,
    reorderProjects,
    addCategory,
    updateCategory,
    deleteCategory,
    saveDraft,
    publishAll,
    uploadMedia
  } = usePortfolio();

  // Search & Filter
  const [filterCat, setFilterCat] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Project Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formClient, setFormClient] = useState('');
  const [formYear, setFormYear] = useState('2026');
  const [formImage, setFormImage] = useState('');
  const [formGallery, setFormGallery] = useState<string[]>([]);
  const [formSummary, setFormSummary] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formVisible, setFormVisible] = useState(true);
  const [formDeliverables, setFormDeliverables] = useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [formColors, setFormColors] = useState<string[]>(['#EA580C', '#1E1E1E', '#FFFFFF']);
  const [newColor, setNewColor] = useState('#EA580C');
  const [formTags, setFormTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Category Manager Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  // Delete Confirmation State
  const [deleteTargetProject, setDeleteTargetProject] = useState<Project | null>(null);
  const [deleteTargetCat, setDeleteTargetCat] = useState<ProjectCategoryItem | null>(null);

  // Media Picker state
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'main' | 'gallery'>('main');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Open Add Project
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormTitle('');
    setFormCategory(categories[0]?.name || 'Graphic Design');
    setFormClient('');
    setFormYear(new Date().getFullYear().toString());
    setFormImage('');
    setFormGallery([]);
    setFormSummary('');
    setFormDescription('');
    setFormFeatured(false);
    setFormVisible(true);
    setFormDeliverables(['Brand Strategy', 'Visual Identity System', 'Packaging Guidelines']);
    setFormColors(['#EA580C', '#1E1E1E', '#FFFFFF']);
    setFormTags(['Graphic Design', 'Branding']);
    setIsEditorOpen(true);
  };

  // Open Edit Project
  const handleOpenEdit = (p: Project) => {
    setEditingId(p.id);
    setFormTitle(p.title);
    setFormCategory(p.category);
    setFormClient(p.client);
    setFormYear(p.year);
    setFormImage(p.image);
    setFormGallery(p.galleryImages || [p.image]);
    setFormSummary(p.summary);
    setFormDescription(p.description);
    setFormFeatured(p.featured);
    setFormVisible(p.visible !== undefined ? p.visible : true);
    setFormDeliverables(p.deliverables || []);
    setFormColors(p.colorPalette || ['#EA580C', '#1E1E1E', '#FFFFFF']);
    setFormTags(p.tags || []);
    setIsEditorOpen(true);
  };

  // Submit Project Form
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Please enter a project title');
      return;
    }
    if (!formImage.trim()) {
      alert('Please specify at least one primary project image');
      return;
    }

    const payload = {
      title: formTitle.trim(),
      category: formCategory || categories[0]?.name || 'Graphic Design',
      client: formClient.trim() || 'Studio Client',
      year: formYear.trim() || '2026',
      image: formImage.trim(),
      galleryImages: formGallery.length > 0 ? formGallery : [formImage.trim()],
      summary: formSummary.trim(),
      description: formDescription.trim(),
      featured: formFeatured,
      visible: formVisible,
      order: editingId
        ? projects.find((p) => p.id === editingId)?.order || 1
        : projects.length + 1,
      colorPalette: formColors,
      deliverables: formDeliverables,
      tags: formTags
    };

    if (editingId) {
      await updateProject(editingId, payload);
    } else {
      await addProject(payload);
    }

    setIsEditorOpen(false);
  };

  // Direct upload for main image
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const asset = await uploadMedia(file);
        setFormImage(asset.dataUrl);
        if (!formGallery.includes(asset.dataUrl)) {
          setFormGallery((prev) => [...prev, asset.dataUrl]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Direct upload for gallery images
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        try {
          const asset = await uploadMedia(files[i]);
          setFormGallery((prev) => [...prev, asset.dataUrl]);
          if (!formImage) setFormImage(asset.dataUrl);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  // Media picked from library
  const handleMediaPicked = (url: string) => {
    if (mediaPickerTarget === 'main') {
      setFormImage(url);
      if (!formGallery.includes(url)) {
        setFormGallery((prev) => [...prev, url]);
      }
    } else {
      if (!formGallery.includes(url)) {
        setFormGallery((prev) => [...prev, url]);
      }
      if (!formImage) setFormImage(url);
    }
    setIsMediaPickerOpen(false);
  };

  // Reorder project up/down
  const handleMoveProject = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === projects.length - 1)
    ) {
      return;
    }
    const target = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...projects];
    const temp = reordered[index];
    reordered[index] = reordered[target];
    reordered[target] = temp;
    reorderProjects(reordered);
  };

  // Filtered projects
  const filtered = projects.filter((p) => {
    const matchCat = filterCat === 'All' ? true : p.category === filterCat;
    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            Portfolio Content
          </span>
          <h2 className="text-2xl font-extrabold text-zinc-950">Projects &amp; Works Management</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Add creative projects, upload multi-image galleries, manage categories, reorder showcase, and toggle visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCatModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all shadow-xs"
          >
            <FolderPlus className="w-4 h-4 text-[#EA580C]" />
            <span>Manage Categories ({categories.length})</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mr-1">
            Category:
          </span>
          <button
            onClick={() => setFilterCat('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterCat === 'All'
                ? 'bg-[#EA580C] text-white shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            All ({projects.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCat(c.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterCat === c.name
                  ? 'bg-[#EA580C] text-white shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
              }`}
            >
              {c.name} ({projects.filter((p) => p.category === c.name).length})
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-1.5 rounded-xl bg-zinc-100 border border-zinc-200 text-xs outline-none focus:border-[#EA580C]"
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#EA580C] mx-auto flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-zinc-900">No projects match your filter</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try switching categories or click &ldquo;Add New Project&rdquo; to build your creative showcase.
            </p>
          </div>
        ) : (
          filtered.map((proj, index) => {
            const rawIndex = projects.findIndex((p) => p.id === proj.id);
            return (
              <div
                key={proj.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/80 hover:border-zinc-300 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Thumbnail & Main Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-20 h-20 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200 relative">
                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                    {proj.galleryImages && proj.galleryImages.length > 1 && (
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1 rounded">
                        +{proj.galleryImages.length - 1}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#EA580C]">
                        {proj.category}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">· {proj.year}</span>
                      {proj.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
                        </span>
                      )}
                      {!proj.visible && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-500">
                          Hidden
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-zinc-950 truncate">{proj.title}</h4>
                    <p className="text-xs text-zinc-500 truncate max-w-xl">
                      <span className="font-semibold text-zinc-700">{proj.client}</span> — {proj.summary}
                    </p>
                  </div>
                </div>

                {/* Right: Controls & Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {/* Reorder Buttons */}
                  <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50">
                    <button
                      onClick={() => handleMoveProject(rawIndex, 'up')}
                      disabled={rawIndex === 0}
                      title="Move Project Up"
                      className="p-2 hover:bg-zinc-200 text-zinc-600 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveProject(rawIndex, 'down')}
                      disabled={rawIndex === projects.length - 1}
                      title="Move Project Down"
                      className="p-2 hover:bg-zinc-200 text-zinc-600 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Toggle Visible */}
                  <button
                    onClick={() => updateProject(proj.id, { visible: !proj.visible })}
                    title={proj.visible ? 'Hide from live site' : 'Show on live site'}
                    className={`p-2 rounded-xl border transition-colors ${
                      proj.visible
                        ? 'border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700'
                        : 'border-amber-200 bg-amber-50 text-amber-800'
                    }`}
                  >
                    {proj.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Toggle Featured */}
                  <button
                    onClick={() => updateProject(proj.id, { featured: !proj.featured })}
                    title={proj.featured ? 'Remove from Featured' : 'Mark as Featured'}
                    className={`p-2 rounded-xl border transition-colors ${
                      proj.featured
                        ? 'border-amber-200 bg-amber-50 text-amber-600'
                        : 'border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-400'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${proj.featured ? 'fill-amber-500' : ''}`} />
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-bold text-zinc-800 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Edit</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteTargetProject(proj)}
                    className="p-2 rounded-xl border border-zinc-200 bg-white hover:bg-rose-50 text-rose-600 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Project Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="fixed inset-0" onClick={() => setIsEditorOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 bg-white rounded-[28px] max-w-3xl w-full shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-zinc-100 bg-zinc-50 shrink-0">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                    Project Configuration
                  </span>
                  <h3 className="text-xl font-extrabold text-zinc-950">
                    {editingId ? 'Edit Project Details' : 'Create New Project'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-200 text-zinc-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveProject} className="overflow-y-auto p-6 sm:p-8 space-y-6">
                
                {/* Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Aura Skincare Packaging System"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold bg-white outline-none focus:border-[#EA580C]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Client & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Client / Brand
                    </label>
                    <input
                      type="text"
                      value={formClient}
                      onChange={(e) => setFormClient(e.target.value)}
                      placeholder="e.g. Aura Botanicals London"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Year Completed
                    </label>
                    <input
                      type="text"
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      placeholder="2026"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                {/* Images: Primary Image + Gallery Images */}
                <div className="space-y-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider">
                        Project Media &amp; Gallery
                      </label>
                      <p className="text-[11px] text-zinc-500">
                        Upload or select primary showcase image and additional gallery slides for the lightbox.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                        className="hidden"
                      />
                      <input
                        ref={galleryInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMediaPickerTarget('gallery');
                          setIsMediaPickerOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-xs font-bold text-white shadow-xs"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Media Library</span>
                      </button>
                    </div>
                  </div>

                  {/* Gallery Thumbnails row */}
                  {formGallery.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-2">
                      {formGallery.map((imgUrl, gIdx) => {
                        const isPrimary = formImage === imgUrl;
                        return (
                          <div
                            key={gIdx}
                            className={`group relative rounded-xl overflow-hidden aspect-square border-2 bg-zinc-200 ${
                              isPrimary ? 'border-[#EA580C] shadow-sm' : 'border-zinc-300'
                            }`}
                          >
                            <img src={imgUrl} alt="Gallery" className="w-full h-full object-cover" />
                            {isPrimary && (
                              <span className="absolute top-1 left-1 bg-[#EA580C] text-white text-[9px] font-bold px-1 rounded">
                                Cover
                              </span>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              {!isPrimary && (
                                <button
                                  type="button"
                                  onClick={() => setFormImage(imgUrl)}
                                  title="Set as Cover"
                                  className="p-1 rounded bg-white text-zinc-800 text-[10px] font-bold"
                                >
                                  Cover
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = formGallery.filter((_, i) => i !== gIdx);
                                  setFormGallery(updated);
                                  if (isPrimary) setFormImage(updated[0] || '');
                                }}
                                className="p-1 rounded bg-rose-600 text-white"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Summary & Description */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Card Summary (Short tagline shown on homepage cards)
                  </label>
                  <input
                    type="text"
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder="e.g. Luxury matte navy & eco-craft unboxing experience with copper foil."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Full Description (Shown in high-resolution lightbox)
                  </label>
                  <textarea
                    rows={4}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Provide in-depth design rationale, technical print finishes, challenges solved..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
                  />
                </div>

                {/* Deliverables tags */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    Deliverables / Scope Items
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add deliverable (e.g. Debossed Foil Sleeves)"
                      value={newDeliverable}
                      onChange={(e) => setNewDeliverable(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newDeliverable.trim()) {
                            setFormDeliverables([...formDeliverables, newDeliverable.trim()]);
                            setNewDeliverable('');
                          }
                        }
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[#EA580C]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newDeliverable.trim()) {
                          setFormDeliverables([...formDeliverables, newDeliverable.trim()]);
                          setNewDeliverable('');
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-zinc-800 text-white text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formDeliverables.map((deliv, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 text-xs font-medium text-zinc-700"
                      >
                        <span>{deliv}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormDeliverables(formDeliverables.filter((_, i) => i !== idx))
                          }
                          className="hover:text-rose-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Color Palette */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    Project Color Palette
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-9 h-9 rounded-xl border border-zinc-200 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-28 px-3 py-2 rounded-xl border border-zinc-200 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newColor && !formColors.includes(newColor)) {
                          setFormColors([...formColors, newColor]);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-zinc-800 text-white text-xs font-bold"
                    >
                      Add Swatch
                    </button>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    {formColors.map((hex, i) => (
                      <div
                        key={i}
                        className="group relative w-7 h-7 rounded-full border border-zinc-300 shadow-xs cursor-pointer"
                        style={{ backgroundColor: hex }}
                      >
                        <button
                          type="button"
                          onClick={() => setFormColors(formColors.filter((_, idx) => idx !== i))}
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-[9px] hidden group-hover:flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Display Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#EA580C] rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-zinc-900 block">Mark as Featured</span>
                      <span className="text-[11px] text-zinc-500">
                        Highlights with amber badge and higher priority
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formVisible}
                      onChange={(e) => setFormVisible(e.target.checked)}
                      className="w-4 h-4 accent-[#EA580C] rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-zinc-900 block">Visible on Website</span>
                      <span className="text-[11px] text-zinc-500">
                        Uncheck to temporarily hide from visitors
                      </span>
                    </div>
                  </label>
                </div>

                {/* Save / Cancel buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 text-xs font-bold hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingId ? 'Save Changes' : 'Create &amp; Publish Project'}</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Manager Modal */}
      <AnimatePresence>
        {isCatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="fixed inset-0" onClick={() => setIsCatModalOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-zinc-200 overflow-hidden p-6 sm:p-7 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                    Category Manager
                  </span>
                  <h3 className="text-xl font-bold text-zinc-950">Project Categories</h3>
                </div>
                <button
                  onClick={() => setIsCatModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Add Category Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="New category name (e.g. 3D Spatial)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[#EA580C]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newCatName.trim()) {
                      addCategory(newCatName.trim());
                      setNewCatName('');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Add Category
                </button>
              </div>

              {/* Categories List */}
              <div className="divide-y divide-zinc-100 max-h-60 overflow-y-auto">
                {categories.map((c) => {
                  const isEditing = editingCatId === c.id;
                  const projectCount = projects.filter((p) => p.category === c.name).length;
                  return (
                    <div key={c.id} className="py-2.5 flex items-center justify-between gap-3">
                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingCatName}
                            onChange={(e) => setEditingCatName(e.target.value)}
                            className="flex-1 px-2.5 py-1 text-xs border border-zinc-300 rounded-lg outline-none"
                          />
                          <button
                            onClick={() => {
                              if (editingCatName.trim()) {
                                updateCategory(c.id, editingCatName.trim());
                                setEditingCatId(null);
                              }
                            }}
                            className="p-1 rounded bg-emerald-600 text-white"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingCatId(null)}
                            className="p-1 rounded bg-zinc-200 text-zinc-700"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900">{c.name}</span>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            ({projectCount} projects)
                          </span>
                        </div>
                      )}

                      {!isEditing && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingCatId(c.id);
                              setEditingCatName(c.name);
                            }}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900"
                            title="Rename Category"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetCat(c)}
                            disabled={categories.length <= 1}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 disabled:opacity-30"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Project Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTargetProject}
        title="Delete Project Permanently?"
        message="Are you sure you want to permanently delete project"
        itemName={deleteTargetProject?.title}
        onConfirm={async () => {
          if (deleteTargetProject) {
            await deleteProject(deleteTargetProject.id);
            setDeleteTargetProject(null);
          }
        }}
        onCancel={() => setDeleteTargetProject(null)}
      />

      {/* Confirm Delete Category Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTargetCat}
        title="Delete Category?"
        message="Are you sure you want to delete category"
        itemName={deleteTargetCat?.name}
        onConfirm={async () => {
          if (deleteTargetCat) {
            await deleteCategory(deleteTargetCat.id);
            setDeleteTargetCat(null);
          }
        }}
        onCancel={() => setDeleteTargetCat(null)}
      />

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        allowedType="image"
        onSelect={handleMediaPicked}
        onClose={() => setIsMediaPickerOpen(false)}
      />
    </div>
  );
};
