import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Layout,
  Globe,
  Sparkles,
  PenTool,
  Layers,
  Palette,
  Package,
  Check,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ServiceItem } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { MediaPickerModal } from './MediaPickerModal';

const AVAILABLE_ICONS = [
  { id: 'Layout', label: 'Layout / UI', icon: Layout },
  { id: 'Globe', label: 'Globe / Web', icon: Globe },
  { id: 'Sparkles', label: 'Sparkles / Brand', icon: Sparkles },
  { id: 'PenTool', label: 'Pen Tool / Vector', icon: PenTool },
  { id: 'Layers', label: 'Layers / System', icon: Layers },
  { id: 'Palette', label: 'Palette / Visual', icon: Palette },
  { id: 'Package', label: 'Package / 3D', icon: Package }
];

export const ServicesManager: React.FC = () => {
  const { services, addService, updateService, deleteService, reorderServices } = usePortfolio();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIcon, setFormIcon] = useState<ServiceItem['iconName']>('Layout');
  const [formImage, setFormImage] = useState('');
  const [formDeliverables, setFormDeliverables] = useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [formVisible, setFormVisible] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormTitle('');
    setFormDescription('');
    setFormIcon('Layout');
    setFormImage('');
    setFormDeliverables(['Wireframes & Prototypes', 'Design Tokens', 'Production Specs']);
    setFormVisible(true);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (s: ServiceItem) => {
    setEditingId(s.id);
    setFormTitle(s.title);
    setFormDescription(s.description);
    setFormIcon(s.iconName || 'Layout');
    setFormImage(s.image || '');
    setFormDeliverables(s.deliverables || []);
    setFormVisible(s.visible !== undefined ? s.visible : true);
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Please enter a service title');
      return;
    }

    const payload = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      iconName: formIcon,
      image: formImage.trim() || undefined,
      deliverables: formDeliverables,
      visible: formVisible
    };

    if (editingId) {
      await updateService(editingId, payload);
    } else {
      await addService(payload);
    }
    setIsEditorOpen(false);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === services.length - 1)) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...services];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    reorderServices(reordered);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            Capabilities
          </span>
          <h2 className="text-2xl font-extrabold text-zinc-950">Services Management</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Add offerings, customize icons or graphics, adjust scope deliverables, and reorder.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => {
          const matchedIcon = AVAILABLE_ICONS.find((i) => i.id === service.iconName) || AVAILABLE_ICONS[0];
          const IconComp = matchedIcon.icon;

          return (
            <div
              key={service.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                service.visible
                  ? 'border-zinc-200/80 hover:border-zinc-300 shadow-xs'
                  : 'border-zinc-200 bg-zinc-50/50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-md">
                    {service.image ? (
                      <img src={service.image} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <IconComp className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-zinc-950">{service.title}</h4>
                    <span className="text-xs text-zinc-400 font-mono">
                      Order: #{index + 1} {!service.visible && '· (Hidden)'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === services.length - 1}
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => updateService(service.id, { visible: !service.visible })}
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600"
                  >
                    {service.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-400" />}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#EA580C]" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(service)}
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-rose-50 text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">{service.description}</p>

              {/* Deliverables tags */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-100">
                {service.deliverables?.map((d, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-zinc-100 text-[11px] font-medium text-zinc-600"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Service Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="fixed inset-0" onClick={() => setIsEditorOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-zinc-200 overflow-hidden p-6 sm:p-7 space-y-5 my-auto max-h-[92vh] flex flex-col"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                    Service Editor
                  </span>
                  <h3 className="text-xl font-bold text-zinc-950">
                    {editingId ? 'Edit Service' : 'Add New Service'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 overflow-y-auto pr-1">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Brand Identity & Strategy"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe your approach, aesthetic principles, and business benefits..."
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[#EA580C]"
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Service Icon
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {AVAILABLE_ICONS.map((item) => {
                      const Icon = item.icon;
                      const isSelected = formIcon === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormIcon(item.id as ServiceItem['iconName'])}
                          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
                            isSelected
                              ? 'border-[#EA580C] bg-orange-50 text-[#EA580C]'
                              : 'border-zinc-200 hover:border-zinc-300 text-zinc-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="truncate w-full text-center">{item.label.split('/')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Deliverables builder */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    Scope Deliverables
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Responsive Web Layouts"
                      value={newDeliverable}
                      onChange={(e) => setNewDeliverable(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-zinc-200 text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newDeliverable.trim()) {
                          setFormDeliverables([...formDeliverables, newDeliverable.trim()]);
                          setNewDeliverable('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 text-white text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formDeliverables.map((deliv, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 text-xs text-zinc-700"
                      >
                        <span>{deliv}</span>
                        <button
                          type="button"
                          onClick={() => setFormDeliverables(formDeliverables.filter((_, i) => i !== idx))}
                          className="hover:text-rose-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 bg-zinc-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formVisible}
                    onChange={(e) => setFormVisible(e.target.checked)}
                    className="w-4 h-4 accent-[#EA580C] rounded"
                  />
                  <span className="text-xs font-bold text-zinc-800">Visible on Public Website</span>
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
                    {editingId ? 'Save Changes' : 'Create Service'}
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
        title="Delete Service?"
        message="Are you sure you want to delete service"
        itemName={deleteTarget?.title}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteService(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
