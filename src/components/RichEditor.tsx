'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  height?: number;
}

export default function RichEditor({ value, onChange, label, placeholder, height = 400 }: RichEditorProps) {
  const [mode, setMode] = useState<'rich' | 'html'>('rich');

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setMode('rich')}
              className={`px-2 py-0.5 text-xs rounded-md transition-all ${
                mode === 'rich' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Markdown
            </button>
            <button
              type="button"
              onClick={() => setMode('html')}
              className={`px-2 py-0.5 text-xs rounded-md transition-all ${
                mode === 'html' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              HTML
            </button>
          </div>
        </div>
      )}

      {mode === 'rich' ? (
        <div data-color-mode="light">
          <MDEditor
            value={value}
            onChange={(v) => onChange(v || '')}
            height={height}
            preview="live"
            textareaProps={{ placeholder }}
          />
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
          style={{ height }}
          placeholder="Enter HTML directly..."
        />
      )}

      <p className="text-xs text-gray-400 mt-1">
        Supports Markdown syntax. Switch to HTML mode for raw HTML editing.
      </p>
    </div>
  );
}
