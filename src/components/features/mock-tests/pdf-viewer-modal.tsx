'use client';

import React from 'react';
import { X, FileText } from 'lucide-react';

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({ isOpen, onClose, title, url }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl h-[80vh] glass-card rounded-3xl border border-purple-500/40 bg-[#0d1424] p-6 flex flex-col space-y-4 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-sm text-white truncate max-w-md">{title}</h3>
          </div>
          <button onClick={onClose} aria-label="Close modal" className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
          {url ? (
            <iframe src={url} className="w-full h-full border-none" title={title} />
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <FileText className="w-10 h-10 text-purple-400 mx-auto" />
              <p className="font-bold text-white text-sm">No PDF File Attached</p>
              <p>Upload a question paper or solution PDF when logging your test score.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
