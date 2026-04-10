'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface ImageFolder {
  folder: string;
  files: string[];
}

interface ImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function ImagePicker({ value, onChange, label }: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [folders, setFolders] = useState<ImageFolder[]>([]);
  const [activeFolder, setActiveFolder] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async (q = '') => {
    setLoading(true);
    try {
      const url = q ? `/api/images?search=${encodeURIComponent(q)}` : '/api/images';
      const r = await fetch(url, { credentials: 'include' });
      if (r.ok) {
        const data = await r.json();
        setFolders(data.folders || []);
        if (data.folders?.length && !activeFolder) {
          setActiveFolder(data.folders[0].folder);
        }
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [activeFolder]);

  useEffect(() => {
    if (open) fetchImages();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append('files', f));
      const r = await fetch('/api/images/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (r.ok) {
        const data = await r.json();
        if (data.uploaded?.[0]) {
          onChange(data.uploaded[0]);
        }
        await fetchImages();
        setActiveFolder('/uploads');
      }
    } catch { /* ignore */ }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const currentFiles = folders.find(f => f.folder === activeFolder)?.files || [];

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}

      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL or select from library"
          className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          Browse
        </button>
      </div>

      {value && (
        <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs rounded-bl-lg"
          >
            ×
          </button>
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Image Library</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-4 border-b flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchImages(search)}
                placeholder="Search images..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none"
              />
              <button onClick={() => fetchImages(search)} className="px-3 py-2 bg-primary text-white rounded-lg text-sm">
                Search
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Folder sidebar */}
              <div className="w-40 border-r overflow-y-auto p-2">
                {folders.map(f => (
                  <button
                    key={f.folder}
                    onClick={() => setActiveFolder(f.folder)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      activeFolder === f.folder ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {f.folder || 'root'} ({f.files.length})
                  </button>
                ))}
              </div>

              {/* Image grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="text-center text-gray-400 py-8">Loading...</div>
                ) : currentFiles.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">No images in this folder</div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {currentFiles.map(src => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => { onChange(src); setOpen(false); }}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:border-primary ${
                          value === src ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
