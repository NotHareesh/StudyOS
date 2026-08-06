'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Upload, Trash2, Bot, Plus, X, BookOpen, Sparkles, Eye, Bookmark } from 'lucide-react';
import { useAIDrawer } from '@/contexts/ai-drawer-context';
import { uploadPDFToGoogleDrive } from '@/lib/google/drive';

interface UserPDF {
  id: string;
  name: string;
  sizeMB: string;
  uploadedAt: string;
  fileDataUrl: string; // Data URL or Object URL for viewing
  notes?: string;
}

const STORAGE_KEY = 'studyos_uploaded_pdfs';

export default function PDFReaderPage() {
  const { openAIDrawer } = useAIDrawer();
  const [pdfs, setPdfs] = useState<UserPDF[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<UserPDF | null>(null);
  const [noteInput, setNoteInput] = useState('');

  // Load saved PDFs metadata from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPdfs(parsed);
        if (parsed.length > 0) setSelectedPdf(parsed[0]);
      }
    } catch (e) {
      console.error('Failed to load saved PDFs:', e);
    }
  }, []);

  const savePDFs = (updated: UserPDF[]) => {
    setPdfs(updated);
    try {
      // Store metadata (excluding huge fileDataUrl strings to save localStorage quota)
      const lightList = updated.map(p => ({
        id: p.id,
        name: p.name,
        sizeMB: p.sizeMB,
        uploadedAt: p.uploadedAt,
        notes: p.notes,
        fileDataUrl: p.fileDataUrl.startsWith('blob:') ? '' : p.fileDataUrl,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightList));
    } catch (e) {
      console.error('Failed to save PDFs:', e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const newPdf: UserPDF = {
      id: 'pdf_' + Date.now(),
      name: file.name,
      sizeMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      uploadedAt: new Date().toLocaleDateString(),
      fileDataUrl: objectUrl,
      notes: '',
    };

    const updated = [newPdf, ...pdfs];
    savePDFs(updated);
    setSelectedPdf(newPdf);
  };

  const handleDeletePDF = (id: string) => {
    const updated = pdfs.filter(p => p.id !== id);
    savePDFs(updated);
    if (selectedPdf?.id === id) {
      setSelectedPdf(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleSaveNote = () => {
    if (!selectedPdf) return;
    const updated = pdfs.map(p => p.id === selectedPdf.id ? { ...p, notes: noteInput } : p);
    savePDFs(updated);
    setSelectedPdf({ ...selectedPdf, notes: noteInput });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-indigo-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" /> Module 8 &bull; Custom PDF Reader & Viewer
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            PDF Reader & Annotator
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Upload local NCERT, HC Verma, PYQs, or coaching PDFs to read directly inside StudyOS with AI assistance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              if (selectedPdf) {
                const res = await uploadPDFToGoogleDrive(selectedPdf.name, selectedPdf.fileDataUrl);
                alert(res.message);
              } else {
                const res = await uploadPDFToGoogleDrive('StudyOS_Document.pdf', '');
                alert(res.message);
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-semibold hover:bg-blue-900/60 flex items-center gap-2 shrink-0"
          >
            <Upload className="w-4 h-4 text-blue-400" /> Sync Google Drive
          </button>
          <label className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer shrink-0 transition-all">
            <Upload className="w-4 h-4" />
            <span>Upload PDF Document</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Main Reader View */}
      {pdfs.length === 0 ? (
        /* Empty State */
        <div className="p-12 rounded-3xl glass-card border border-slate-800/80 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-white">No PDFs Uploaded Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Upload PDF Document" above to load any textbook, PYQ paper, or study notes PDF from your Mac/PC to view inside StudyOS.
          </p>
          <label className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 inline-flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Select PDF File</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        /* Dynamic Reader Grid */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Uploaded Documents List */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Your Uploaded PDFs ({pdfs.length})
            </h2>

            <div className="space-y-2.5">
              {pdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  onClick={() => {
                    setSelectedPdf(pdf);
                    setNoteInput(pdf.notes || '');
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedPdf?.id === pdf.id
                      ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className={`w-5 h-5 shrink-0 ${selectedPdf?.id === pdf.id ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{pdf.name}</p>
                      <p className="text-[10px] text-slate-400">{pdf.sizeMB} &bull; {pdf.uploadedAt}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePDF(pdf.id);
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400"
                    title="Remove PDF"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right 3 Columns: Active PDF Embedded Viewer & AI Tools */}
          <div className="lg:col-span-3 space-y-6">
            {selectedPdf ? (
              <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
                {/* Active Document Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-indigo-400" />
                    <div>
                      <h2 className="font-bold text-base text-white">{selectedPdf.name}</h2>
                      <p className="text-xs text-slate-400">{selectedPdf.sizeMB} &bull; Uploaded {selectedPdf.uploadedAt}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => openAIDrawer('pdf_document', selectedPdf.name)}
                    className="px-4 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/60 flex items-center gap-2 shrink-0"
                  >
                    <Bot className="w-4 h-4" /> Ask Gemini AI About This PDF
                  </button>
                </div>

                {/* Embedded HTML5 PDF Viewer Canvas */}
                {selectedPdf.fileDataUrl ? (
                  <div className="w-full h-[600px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                    <iframe
                      src={selectedPdf.fileDataUrl}
                      className="w-full h-full border-none"
                      title={selectedPdf.name}
                    />
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                    Document metadata loaded. Select or re-upload file to render inline PDF canvas.
                  </div>
                )}

                {/* Inline Document Notes */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-indigo-400" /> Document Notes & Highlights
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Add key notes, important page numbers, or formulas from this PDF..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
