'use client';

import { useEffect, useState, useRef } from 'react';

interface ImageFolder {
  folder: string;
  files: string[];
}

export default function AdminImagesPage() {
  const [folders, setFolders] = useState<ImageFolder[]>([]);
  const [activeFolder, setActiveFolder] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [previewImg, setPreviewImg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async (q = '') => {
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
  };

  useEffect(() => { fetchImages(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        if (data.errors?.length) alert('Some files failed:\n' + data.errors.join('\n'));
        await fetchImages();
        setActiveFolder('/uploads');
      }
    } catch { /* ignore */ }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async () => {
    const files = Array.from(selected);
    const nonUploads = files.filter(f => !f.startsWith('/images/uploads/'));
    if (nonUploads.length > 0) {
      alert('Only files in the uploads folder can be deleted.');
      return;
    }
    if (!confirm(`Delete ${files.length} file(s)? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const r = await fetch('/api/images', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files }),
      });
      if (r.ok) {
        setSelected(new Set());
        await fetchImages();
      }
    } catch { /* ignore */ }
    setDeleting(false);
  };

  const toggleSelect = (src: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(src)) next.delete(src); else next.add(src);
      return next;
    });
  };

  const copyUrl = (src: string) => {
    navigator.clipboard.writeText(src);
  };

  const currentFiles = folders.find(f => f.folder === activeFolder)?.files || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Image Manager</h1>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 disabled:opacity-50"
            >
              Delete ({selected.size})
            </button>
          )}
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
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : '+ Upload Images'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchImages(search)}
          placeholder="Search images..."
          className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <button onClick={() => fetchImages(search)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">
          Search
        </button>
      </div>

      <div className="flex gap-4">
        {/* Folder sidebar */}
        <div className="w-48 shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-3 space-y-1">
            {folders.map(f => (
              <button
                key={f.folder}
                onClick={() => { setActiveFolder(f.folder); setSelected(new Set()); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFolder === f.folder ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f.folder || 'root'}
                <span className="ml-1 text-xs text-gray-400">({f.files.length})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Image grid */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-4">
            {loading ? (
              <div className="text-center text-gray-400 py-12">Loading images...</div>
            ) : currentFiles.length === 0 ? (
              <div className="text-center text-gray-400 py-12">No images in this folder</div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {currentFiles.map(src => (
                  <div
                    key={src}
                    className={`relative group rounded-lg overflow-hidden border-2 aspect-square cursor-pointer transition-all ${
                      selected.has(src) ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                      onClick={() => setPreviewImg(src)}
                    />
                    <div className="absolute top-1 left-1">
                      <input
                        type="checkbox"
                        checked={selected.has(src)}
                        onChange={() => toggleSelect(src)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between">
                      <button onClick={() => copyUrl(src)} className="hover:text-blue-300">Copy URL</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewImg && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setPreviewImg('')}>
          <div className="max-w-4xl max-h-[90vh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewImg} alt="" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            <p className="text-white/60 text-center text-sm mt-2 select-all">{previewImg}</p>
          </div>
        </div>
      )}
    </div>
  );
}
