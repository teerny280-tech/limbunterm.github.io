import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Search,
  Filter,
  Trash2,
  Download,
  Image as ImageIcon,
  Video,
  Film,
  Calendar,
  HardDrive,
  Copy,
  Check,
  AlertTriangle,
  RotateCw,
  Plus,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { MediaAsset } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

export const MediaLibraryManager: React.FC = () => {
  const { mediaLibrary, uploadMedia, deleteMedia, checkMediaUsage, showToast } = usePortfolio();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  // Uploading state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Delete checking state
  const [deleteCandidate, setDeleteCandidate] = useState<MediaAsset | null>(null);
  const [inUseWarnings, setInUseWarnings] = useState<string[]>([]);
  const [isCheckingUsage, setIsCheckingUsage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered list
  const filtered = mediaLibrary.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' ? true : m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Handle multi-file upload
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(5);

    try {
      const total = files.length;
      for (let i = 0; i < total; i++) {
        const file = files[i];
        await uploadMedia(file, (p) => {
          const overall = Math.round(((i + p / 100) / total) * 100);
          setUploadProgress(overall);
        });
      }
      setUploadProgress(100);
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading file(s)');
      showToast('Error uploading media asset', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Pre-delete check: Query usages in Hero, Projects, Services, Brands, Logo
  const handleInitiateDelete = async (asset: MediaAsset) => {
    setIsCheckingUsage(true);
    try {
      const usages = await checkMediaUsage(asset.dataUrl, asset.name);
      setInUseWarnings(usages);
      setDeleteCandidate(asset);
    } catch (err) {
      console.error(err);
      setDeleteCandidate(asset);
    } finally {
      setIsCheckingUsage(false);
    }
  };

  // Confirm delete execution
  const handleExecuteDelete = async () => {
    if (!deleteCandidate) return;
    const res = await deleteMedia(deleteCandidate.id);
    if (!res.success && res.warnings && res.warnings.length > 0) {
      alert(`Cannot delete: this file is still referenced by:\n${res.warnings.join('\n')}`);
    } else {
      if (selectedAsset?.id === deleteCandidate.id) setSelectedAsset(null);
    }
    setDeleteCandidate(null);
    setInUseWarnings([]);
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Asset link copied to clipboard');
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            Persistent Storage
          </span>
          <h2 className="text-2xl font-extrabold text-zinc-950">Media Assets Library</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Store, preview, compress and manage images (JPG, PNG, WebP) and videos (MP4, WebM) with automatic in-use dependency checks.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
            onChange={handleFilesSelected}
            className="hidden"
          />
          <button
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading ({uploadProgress}%)</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Media Files</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Upload Progress Alert */}
      {isUploading && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#EA580C]">
            <span>Optimizing and saving media assets to persistent IndexedDB...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-orange-200/60 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#EA580C] h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {uploadError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-xs font-medium">
          {uploadError}
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              typeFilter === 'all'
                ? 'bg-[#EA580C] text-white shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            All Media ({mediaLibrary.length})
          </button>
          <button
            onClick={() => setTypeFilter('image')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              typeFilter === 'image'
                ? 'bg-[#EA580C] text-white shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            Images ({mediaLibrary.filter((m) => m.type === 'image').length})
          </button>
          <button
            onClick={() => setTypeFilter('video')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              typeFilter === 'video'
                ? 'bg-[#EA580C] text-white shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            Videos ({mediaLibrary.filter((m) => m.type === 'video').length})
          </button>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-100 border border-zinc-200 rounded-xl text-xs outline-none focus:border-[#EA580C]"
          />
        </div>
      </div>

      {/* Main Grid + Inspector Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Media Grid (cols 1-8) */}
        <div className="lg:col-span-8">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-zinc-200/80 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 text-zinc-400 mx-auto flex items-center justify-center">
                <ImageIcon className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-zinc-900">No media assets found</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Drag and drop or click &ldquo;Upload Media Files&rdquo; above to populate your studio library.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all aspect-square bg-zinc-100 flex flex-col justify-end p-2.5 ${
                      isSelected
                        ? 'border-[#EA580C] ring-4 ring-[#EA580C]/20 shadow-md'
                        : 'border-zinc-200 hover:border-zinc-400 hover:shadow-md'
                    }`}
                  >
                    {/* Media render */}
                    {asset.type === 'video' ? (
                      <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                        <Film className="w-10 h-10 text-zinc-400" />
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white font-mono uppercase">
                          Video
                        </span>
                      </div>
                    ) : (
                      <img
                        src={asset.dataUrl}
                        alt={asset.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    {/* Gradient Info Box */}
                    <div className="relative z-10 bg-black/75 backdrop-blur-xs p-2 rounded-xl text-white">
                      <p className="text-[11px] font-bold truncate leading-tight">{asset.name}</p>
                      <div className="flex items-center justify-between text-[10px] text-zinc-300 mt-0.5 font-mono">
                        <span>{asset.mimeType.split('/')[1]?.toUpperCase()}</span>
                        <span>{(asset.size / 1024).toFixed(0)} KB</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Asset Inspector (cols 9-12) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedAsset ? (
            <div className="sticky top-24 bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                  Asset Inspector
                </span>
                <span className="text-[11px] font-mono text-zinc-400">{selectedAsset.uploadDate}</span>
              </div>

              {/* Preview Box */}
              <div className="rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center min-h-[200px] max-h-[300px]">
                {selectedAsset.type === 'video' ? (
                  <video
                    src={selectedAsset.dataUrl}
                    controls
                    className="w-full max-h-[280px] object-contain"
                  />
                ) : (
                  <img
                    src={selectedAsset.dataUrl}
                    alt={selectedAsset.name}
                    className="w-full max-h-[280px] object-contain"
                  />
                )}
              </div>

              {/* File details */}
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-sans">Filename:</span>
                  <span className="font-bold text-zinc-900 truncate max-w-[160px]">
                    {selectedAsset.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-sans">File Size:</span>
                  <span className="font-bold text-zinc-900">
                    {(selectedAsset.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-sans">MIME Type:</span>
                  <span className="font-bold text-zinc-900">{selectedAsset.mimeType}</span>
                </div>
                {selectedAsset.width && selectedAsset.height && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-sans">Dimensions:</span>
                    <span className="font-bold text-zinc-900">
                      {selectedAsset.width} × {selectedAsset.height} px
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => copyUrl(selectedAsset.dataUrl, selectedAsset.id)}
                  className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-800 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {copiedId === selectedAsset.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied Data Link!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Media Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleInitiateDelete(selectedAsset)}
                  disabled={isCheckingUsage}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {isCheckingUsage ? (
                    <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-rose-600" />
                  )}
                  <span>Delete from Library</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-zinc-200/80 text-center space-y-2">
              <HardDrive className="w-8 h-8 text-zinc-300 mx-auto" />
              <p className="text-xs font-semibold text-zinc-500">
                Click any asset thumbnail in the grid to inspect details, dimensions, and manage dependencies.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Confirmation Dialog with In-Use Checks */}
      <ConfirmDeleteModal
        isOpen={!!deleteCandidate}
        title="Delete Media Asset?"
        message="Are you sure you want to permanently delete media asset"
        itemName={deleteCandidate?.name}
        warningList={inUseWarnings}
        onConfirm={handleExecuteDelete}
        onCancel={() => {
          setDeleteCandidate(null);
          setInUseWarnings([]);
        }}
      />
    </div>
  );
};
