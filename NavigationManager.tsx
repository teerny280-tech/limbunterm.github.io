import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit3,
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { NavigationMenuItem } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

export const NavigationManager: React.FC = () => {
  const { navigationMenu, updateNavigationMenu } = usePortfolio();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLabel, setFormLabel] = useState('');
  const [formHref, setFormHref] = useState('');
  const [formExternal, setFormExternal] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState<NavigationMenuItem | null>(null);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormLabel('');
    setFormHref('#');
    setFormExternal(false);
    setFormVisible(true);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (item: NavigationMenuItem) => {
    setEditingId(item.id);
    setFormLabel(item.label);
    setFormHref(item.href);
    setFormExternal(item.isExternal || false);
    setFormVisible(item.visible !== undefined ? item.visible : true);
    setIsEditorOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim() || !formHref.trim()) {
      alert('Please fill out label and link');
      return;
    }

    if (editingId) {
      const updated = navigationMenu.map((m) =>
        m.id === editingId
          ? {
              ...m,
              label: formLabel.trim(),
              href: formHref.trim(),
              isExternal: formExternal,
              visible: formVisible
            }
          : m
      );
      updateNavigationMenu(updated);
    } else {
      const newItem: NavigationMenuItem = {
        id: `nav-${Date.now()}`,
        label: formLabel.trim(),
        href: formHref.trim(),
        isExternal: formExternal,
        visible: formVisible,
        order: navigationMenu.length + 1
      };
      updateNavigationMenu([...navigationMenu, newItem]);
    }
    setIsEditorOpen(false);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === navigationMenu.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...navigationMenu];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    updateNavigationMenu(reordered);
  };

  const handleToggleVisible = (id: string) => {
    const updated = navigationMenu.map((m) =>
      m.id === id ? { ...m, visible: !m.visible } : m
    );
    updateNavigationMenu(updated);
  };

  const handleDelete = (id: string) => {
    const updated = navigationMenu.filter((m) => m.id !== id);
    updateNavigationMenu(updated);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            Navbar Structure
          </span>
          <h2 className="text-2xl font-extrabold text-zinc-950">Navigation / Menu Manager</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Configure header links, reorder navigation sequence, enable/disable links, or link to external URLs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Link</span>
        </button>
      </div>

      {/* Menu List */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-3">
        {navigationMenu.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
              item.visible
                ? 'border-zinc-200/80 bg-zinc-50/50 hover:border-zinc-300'
                : 'border-zinc-200 bg-zinc-100/50 opacity-60'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="w-7 h-7 rounded-lg bg-zinc-200 text-zinc-700 font-mono text-xs flex items-center justify-center font-bold">
                {index + 1}
              </span>
              <div>
                <h4 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                  <span>{item.label}</span>
                  {item.isExternal && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-600">
                      External
                    </span>
                  )}
                  {!item.visible && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      Hidden
                    </span>
                  )}
                </h4>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">{item.href}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleMove(index, 'up')}
                disabled={index === 0}
                className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600 disabled:opacity-30"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleMove(index, 'down')}
                disabled={index === navigationMenu.length - 1}
                className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600 disabled:opacity-30"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleToggleVisible(item.id)}
                className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600"
              >
                {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-400" />}
              </button>
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#EA580C]" />
              </button>
              <button
                onClick={() => setDeleteTarget(item)}
                disabled={navigationMenu.length <= 1}
                className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-rose-50 text-rose-600 disabled:opacity-30"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="fixed inset-0" onClick={() => setIsEditorOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-zinc-200 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-zinc-950">
                  {editingId ? 'Edit Menu Item' : 'Add Menu Item'}
                </h4>
                <button onClick={() => setIsEditorOpen(false)}>
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Menu Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder="e.g. Portfolio"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Link Target (Anchor ID or URL) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formHref}
                    onChange={(e) => setFormHref(e.target.value)}
                    placeholder="#projects or https://..."
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs outline-none focus:border-[#EA580C]"
                  />
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {['#hero', '#services', '#projects', '#brands', '#about', '#contact'].map((target) => (
                      <button
                        key={target}
                        type="button"
                        onClick={() => setFormHref(target)}
                        className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-[10px] font-mono text-zinc-600"
                      >
                        {target}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formVisible}
                      onChange={(e) => setFormVisible(e.target.checked)}
                      className="w-4 h-4 accent-[#EA580C] rounded"
                    />
                    <span className="text-xs font-bold text-zinc-800">Show in Navbar</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formExternal}
                      onChange={(e) => setFormExternal(e.target.checked)}
                      className="w-4 h-4 accent-[#EA580C] rounded"
                    />
                    <span className="text-xs font-bold text-zinc-800">
                      Open in New Tab (External Link)
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-300 text-xs font-bold text-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-bold"
                  >
                    Save Menu Item
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
        title="Delete Menu Link?"
        message="Are you sure you want to remove link"
        itemName={deleteTarget?.label}
        onConfirm={() => {
          if (deleteTarget) handleDelete(deleteTarget.id);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
