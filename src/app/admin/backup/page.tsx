'use client';

import { useState, useRef } from 'react';

export default function AdminBackupPage() {
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = async () => {
    setBackupLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/backup', { credentials: 'include' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Backup failed');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const disposition = res.headers.get('Content-Disposition');
      const match = disposition?.match(/filename="(.+)"/);
      a.download = match?.[1] || `logistics-backup-${new Date().toISOString().slice(0, 10)}.db`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'Backup downloaded successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Backup failed' });
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreFile) return;
    setShowConfirm(false);
    setRestoreLoading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', restoreFile);
      const res = await fetch('/api/admin/restore', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Restore failed');
      setMessage({ type: 'success', text: data.message || 'Restored successfully!' });
      setRestoreFile(null);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Restore failed' });
    } finally {
      setRestoreLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Backup & Restore</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Backup */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Download Backup</h2>
              <p className="text-sm text-gray-500">Download a copy of the database</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Creates a full backup of the SQLite database including all content, settings, and user data.
          </p>
          <button
            onClick={handleBackup}
            disabled={backupLoading}
            className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {backupLoading ? 'Creating backup...' : 'Download Backup'}
          </button>
        </div>

        {/* Restore */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Restore Database</h2>
              <p className="text-sm text-gray-500">Restore from a backup file</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Upload a .db backup file to replace the current database. A backup of the current DB will be created first.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".db"
            className="hidden"
            onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
          />
          {restoreFile ? (
            <div className="mb-3 p-3 bg-orange-50 rounded-lg text-sm">
              <span className="font-medium">{restoreFile.name}</span>
              <span className="text-gray-500 ml-2">({(restoreFile.size / 1024).toFixed(1)} KB)</span>
            </div>
          ) : null}
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Select File
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={!restoreFile || restoreLoading}
              className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              {restoreLoading ? 'Restoring...' : 'Restore'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">⚠️ Confirm Restore</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will replace the current database with <strong>{restoreFile?.name}</strong>. A backup will be created automatically, but this action may require a server restart.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                Cancel
              </button>
              <button onClick={handleRestore} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium">
                Yes, Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
