import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Plus, Trash2, Check, Image as ImageIcon, Sparkles, Tag } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, ProjectCategory } from '../types';

export const ProjectEditorModal: React.FC = () => {
  const { 
    isProjectEditorOpen, 
    setIsProjectEditorOpen, 
    editingProject, 
    setEditingProject, 
    addProject, 
    updateProject, 
    deleteProject 
  } = usePortfolio();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Graphic Design');
  const [client, setClient] = useState('');
  const [year, setYear] = useState('2026');
  const [image, setImage] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [newDeliverableInput, setNewDeliverableInput] = useState('');
  const [colorPalette, setColorPalette] = useState<string[]>(['#EA580C', '#18181B', '#F4F4F5']);
  const [newColorInput, setNewColorInput] = useState('#EA580C');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize or clear fields when modal opens
  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title);
      setCategory(editingProject.category);
      setClient(editingProject.client);
      setYear(editingProject.year);
      setImage(editingProject.image);
      setSummary(editingProject.summary);
      setDescription(editingProject.description);
      setDeliverables(editingProject.deliverables || []);
      setColorPalette(editingProject.colorPalette || ['#EA580C', '#18181B', '#F4F4F5']);
      setTags(editingProject.tags || []);
    } else {
      setTitle('');
      setCategory('Graphic Design');
      setClient('');
      setYear('2026');
      setImage('');
      setSummary('');
      setDescription('');
      setDeliverables(['Brand Guidelines', 'Packaging Die-Cuts', 'Print Specs']);
      setColorPalette(['#EA580C', '#18181B', '#F4F4F5']);
      setTags(['Graphic Design', 'Brand System']);
    }
  }, [editingProject, isProjectEditorOpen]);

  if (!isProjectEditorOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDeliverable = () => {
    if (newDeliverableInput.trim()) {
      setDeliverables([...deliverables, newDeliverableInput.trim()]);
      setNewDeliverableInput('');
    }
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleAddColor = () => {
    if (newColorInput.trim() && !colorPalette.includes(newColorInput.trim())) {
      setColorPalette([...colorPalette, newColorInput.trim()]);
    }
  };

  const handleRemoveColor = (index: number) => {
    setColorPalette(colorPalette.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (newTagInput.trim()) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) {
      alert('Please provide at least a project title and an image.');
      return;
    }

    const payload = {
      title,
      category: category === 'All' ? 'Graphic Design' : category,
      client: client.trim() || 'Independent / Speculative Work',
      year: year.trim() || '2026',
      image,
      summary: summary.trim() || 'Contemporary design direction and brand execution.',
      description: description.trim() || 'A bespoke graphic identity and visual architecture project developed for high-impact brand presence.',
      deliverables: deliverables.length > 0 ? deliverables : ['Design System', 'Asset Production'],
      colorPalette: colorPalette.length > 0 ? colorPalette : ['#EA580C', '#18181B', '#F4F4F5'],
      tags: tags.length > 0 ? tags : [category],
      featured: true,
      visible: true,
      order: editingProject ? editingProject.order : 1,
      galleryImages: [image]
    };

    if (editingProject) {
      updateProject(editingProject.id, payload);
    } else {
      addProject(payload);
    }

    setIsProjectEditorOpen(false);
    setEditingProject(null);
  };

  const handleDelete = () => {
    if (editingProject && confirm(`Are you sure you want to delete "${editingProject.title}"?`)) {
      deleteProject(editingProject.id);
      setIsProjectEditorOpen(false);
      setEditingProject(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <div className="fixed inset-0" onClick={() => setIsProjectEditorOpen(false)} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 bg-white text-zinc-900 rounded-[28px] max-w-4xl w-full shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-zinc-100 bg-zinc-50/80 shrink-0">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                {editingProject ? 'Project Manager' : 'Upload & Create'}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950">
                {editingProject ? `Edit "${editingProject.title}"` : 'Upload New Design Project'}
              </h3>
            </div>
            <button
              onClick={() => setIsProjectEditorOpen(false)}
              className="p-2 rounded-full bg-zinc-200/80 hover:bg-zinc-300 text-zinc-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* Image Upload Area */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Project Visual / High-Resolution Mockup *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                
                {/* Upload Dropzone */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="sm:col-span-7 border-2 border-dashed border-zinc-300 hover:border-[#EA580C] bg-zinc-50/70 hover:bg-orange-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[170px]"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-[#EA580C] flex items-center justify-center mb-3">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-zinc-800">
                    Click to upload high-res image
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Supports PNG, JPG, WebP, SVG from your computer
                  </p>
                </div>

                {/* Preview Frame */}
                <div className="sm:col-span-5 bg-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden aspect-4/3 flex items-center justify-center relative">
                  {image ? (
                    <img
                      src={image}
                      alt="Project preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-zinc-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 text-zinc-300" />
                      <span className="text-xs">No image loaded yet</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Or manual URL fallback */}
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Or paste an image URL directly: https://... or /src/assets/images/..."
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>

            {/* Basic Project Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Lumina Organic Wine Packaging System"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-[#EA580C] focus:ring-2 focus:ring-orange-200 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ProjectCategory)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-[#EA580C] focus:ring-2 focus:ring-orange-200 text-sm outline-none bg-white"
                >
                  <option value="Packaging">Packaging</option>
                  <option value="Brand Identity">Brand Identity</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Editorial">Editorial</option>
                  <option value="UI/UX">UI/UX</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Client / Brand Name
                </label>
                <input
                  type="text"
                  value={client}
                  onChange={e => setClient(e.target.value)}
                  placeholder="e.g. Domaine Lumina France"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-[#EA580C] focus:ring-2 focus:ring-orange-200 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Release Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  placeholder="2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-[#EA580C] focus:ring-2 focus:ring-orange-200 text-sm outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Short Summary (Card Preview)
              </label>
              <input
                type="text"
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Tactile bottle label system with copper blind debossing."
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-[#EA580C] focus:ring-2 focus:ring-orange-200 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Full Project Narrative &amp; Story (Shown in Lightbox Modal)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Detail the strategy, materials, print finishes, or digital tokenization..."
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-[#EA580C] focus:ring-2 focus:ring-orange-200 text-sm outline-none resize-none"
              />
            </div>

            {/* Scope Deliverables Tags */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Scope &amp; Deliverables
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {deliverables.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 border border-zinc-200 rounded-full text-xs font-medium text-zinc-800"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(idx)}
                      className="hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add deliverable (e.g. Custom Foil Stamping)..."
                  value={newDeliverableInput}
                  onChange={e => setNewDeliverableInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddDeliverable(); } }}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[#EA580C]"
                />
                <button
                  type="button"
                  onClick={handleAddDeliverable}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-700"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Color Palette Builder */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Color Palette Swatches
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {colorPalette.map((hex, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-xs"
                  >
                    <div className="w-3.5 h-3.5 rounded shadow-xs border border-black/10" style={{ backgroundColor: hex }} />
                    <span className="font-mono text-zinc-700">{hex}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(idx)}
                      className="text-zinc-400 hover:text-rose-600 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newColorInput}
                  onChange={e => setNewColorInput(e.target.value)}
                  className="w-9 h-8 p-0 border-0 rounded cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="#EA580C"
                  value={newColorInput}
                  onChange={e => setNewColorInput(e.target.value)}
                  className="w-28 px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-700"
                >
                  Add Swatch
                </button>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-4">
              {editingProject ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Project</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsProjectEditorOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-zinc-300 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-sm transition-all"
                >
                  {editingProject ? 'Save Changes' : 'Publish Project'}
                </button>
              </div>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
