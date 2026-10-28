import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Search, Image as ImageIcon, Video, Check, Film, Loader2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { MediaAsset } from '../../types';

interface MediaPickerModalProps {
  isOpen: boolean;
  title?: string;
  allowedType?: 'all' | 'image' | 'video';
  currentSelectedUrl?: string;
  onSelect: (mediaUrl: string, asset?: MediaAsset) => void;
  onClose: () => void;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  title = 'Select Media Asset',
  allowedType = 'all',
  currentSelectedUrl,
  onSelect,
  onClose
}) => {
  const { mediaLibrary, uploadMedia } = usePortfolio();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>(allowedType);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredMedia = mediaLibrary.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' ? true : item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(10);

    try {
      // Upload first file and select it
      const file = files[0];
      const asset = await uploadMedia(file, (p) => setUploadProgress(p));
      onSelect(asset.dataUrl, asset);
      onClose();
    } catch (err) {
      console.error('Failed to upload file:', err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 bg-white rounded-[28px] max-w-4xl w-full shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50 shrink-0">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                Media Assets
              </span>
              <h3 className="text-lg font-bold text-zinc-950">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Controls Bar */}
          <div className="p-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-white">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search assets by filename..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#EA580C]/20 border border-transparent focus:border-[#EA580C]"
                />
              </div>

              {allowedType === 'all' && (
                <div className="flex items-center p-1 bg-zinc-100 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setTypeFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      typeFilter === 'all' ? 'bg-white shadow-xs text-zinc-950' : 'text-zinc-500'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setTypeFilter('image')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      typeFilter === 'image' ? 'bg-white shadow-xs text-zinc-950' : 'text-zinc-500'
                    }`}
                  >
                    Images
                  </button>
                  <button
                    onClick={() => setTypeFilter('video')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      typeFilter === 'video' ? 'bg-white shadow-xs text-zinc-950' : 'text-zinc-500'
                    }`}
                  >
                    Videos
                  </button>
                </div>
              )}
            </div>

            {/* Direct Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept={allowedType === 'video' ? 'video/mp4,video/webm' : allowedType === 'image' ? 'image/jpeg,image/png,image/webp' : 'image/*,video/*'}
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Optimizing {uploadProgress}%</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New File</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Upload Progress Bar if active */}
          {uploading && (
            <div className="w-full bg-zinc-100 h-1.5 shrink-0 overflow-hidden">
              <div
                className="bg-[#EA580C] h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Media Grid */}
          <div className="overflow-y-auto p-4 sm:p-6 flex-1">
            {filteredMedia.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 mx-auto flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-zinc-800">No media assets found</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Upload an image or video file above to add it to your persistent media assets library.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredMedia.map((asset) => {
                  const isSelected = currentSelectedUrl === asset.dataUrl;
                  return (
                    <div
                      key={asset.id}
                      onClick={() => {
                        onSelect(asset.dataUrl, asset);
                        onClose();
                      }}
                      className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all aspect-square bg-zinc-100 flex flex-col justify-end p-2.5 ${
                        isSelected
                          ? 'border-[#EA580C] ring-4 ring-[#EA580C]/20 shadow-md'
                          : 'border-zinc-200 hover:border-zinc-400 hover:shadow-md'
                      }`}
                    >
                      {/* Thumbnail */}
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

                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#EA580C] text-white flex items-center justify-center shadow-md z-10">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Bottom Info Gradient */}
                      <div className="relative z-10 bg-black/70 backdrop-blur-xs p-2 rounded-xl text-white">
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

          {/* Footer */}
          <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500 shrink-0">
            <span>{filteredMedia.length} assets available</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-300 text-zinc-700 font-semibold hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
