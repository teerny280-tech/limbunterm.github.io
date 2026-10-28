import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Upload,
  Globe,
  Image as ImageIcon,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { BrandClient } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { MediaPickerModal } from './MediaPickerModal';

export const BrandsManager: React.FC = () => {
  const { brands, addBrand, updateBrand, deleteBrand, reorderBrands, uploadMedia } = usePortfolio();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formLogo, setFormLogo] = useState('');
  const [formIndustry, setFormIndustry] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formVisible, setFormVisible] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState<BrandClient | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormName('');
    setFormLogo('https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80');
    setFormIndustry('Luxury Consumer');
    setFormWebsite('https://');
    setFormVisible(true);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (b: BrandClient) => {
    setEditingId(b.id);
    setFormName(b.name);
    setFormLogo(b.logo);
    setFormIndustry(b.industry || '');
    setFormWebsite(b.website || '');
    setFormVisible(b.visible !== undefined ? b.visible : true);
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter a client/brand name');
      return;
    }
    if (!formLogo.trim()) {
      alert('Please provide a client logo');
      return;
    }

    const payload = {
      name: formName.trim(),
      logo: formLogo.trim(),
      industry: formIndustry.trim() || undefined,
      website: formWebsite.trim() || undefined,
      visible: formVisible
    };

    if (editingId) {
      await updateBrand(editingId, payload);
    } else {
      await addBrand(payload);
    }
    setIsEditorOpen(false);
  };

  const handleDirectLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const asset = await uploadMedia(file);
        setFormLogo(asset.dataUrl);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === brands.length - 1)) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...brands];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    reorderBrands(reordered);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            Partners &amp; Collaborations
          </span>
          <h2 className="text-2xl font-extrabold text-zinc-950">Clients &amp; Brands Management</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Manage client logos, reorder the logo showcase ticker, toggle visibility, and link to client websites.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Brands List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand, index) => (
          <div
            key={brand.id}
            className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
              brand.visible
                ? 'border-zinc-200/80 hover:border-zinc-300 shadow-xs'
                : 'border-zinc-200 bg-zinc-50/50 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-950">{brand.name}</h4>
                  <p className="text-xs text-zinc-500">{brand.industry || 'Client Brand'}</p>
                  {brand.website && (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#EA580C] hover:underline"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600 disabled:opacity-30"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === brands.length - 1}
                  className="p-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600 disabled:opacity-30"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateBrand(brand.id, { visible: !brand.visible })}
                  className="p-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600"
                >
                  {brand.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-400" />}
                </button>
                <button
                  onClick={() => handleOpenEdit(brand)}
                  className="p-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#EA580C]" />
                </button>
                <button
                  onClick={() => setDeleteTarget(brand)}
                  className="p-1 rounded-lg border border-zinc-200 bg-white hover:bg-rose-50 text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Brand Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="fixed inset-0" onClick={() => setIsEditorOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 bg-white rounded-3xl max-w-md w-full shadow-2xl border border-zinc-200 overflow-hidden p-6 sm:p-7 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                    Client Editor
                  </span>
                  <h3 className="text-xl font-bold text-zinc-950">
                    {editingId ? 'Edit Client Details' : 'Add New Client'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Client / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Aura Botanicals"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[#EA580C]"
                  />
                </div>

                {/* Logo Uploader / Media Picker */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    Client Logo Graphic *
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-zinc-100 border border-zinc-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      {formLogo ? (
                        <img src={formLogo} alt="Preview" className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-zinc-400" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleDirectLogoUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-semibold hover:bg-zinc-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Media Library</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Industry / Sector
                  </label>
                  <input
                    type="text"
                    value={formIndustry}
                    onChange={(e) => setFormIndustry(e.target.value)}
                    placeholder="e.g. Sustainable Luxury &amp; Packaging"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={formWebsite}
                    onChange={(e) => setFormWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[#EA580C]"
                  />
                </div>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 bg-zinc-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formVisible}
                    onChange={(e) => setFormVisible(e.target.checked)}
                    className="w-4 h-4 accent-[#EA580C] rounded"
                  />
                  <span className="text-xs font-bold text-zinc-800">Show on Live Website</span>
                </label>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-300 text-zinc-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-md"
                  >
                    {editingId ? 'Save Changes' : 'Add Client'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Delete */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Client?"
        message="Are you sure you want to delete client"
        itemName={deleteTarget?.name}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteBrand(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        allowedType="image"
        onSelect={(url) => {
          setFormLogo(url);
          setIsMediaPickerOpen(false);
        }}
        onClose={() => setIsMediaPickerOpen(false)}
      />
    </div>
  );
};
