'use client';

import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { TestRecord } from '@/services/storage';

interface AddTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTest: (record: TestRecord) => void;
}

export const AddTestModal: React.FC<AddTestModalProps> = ({ isOpen, onClose, onAddTest }) => {
  const [testName, setTestName] = useState('');
  const [testType, setTestType] = useState('JEE Main Full Mock');
  const [totalQuestions, setTotalQuestions] = useState(75);
  const [correctQuestions, setCorrectQuestions] = useState(45);
  const [wrongQuestions, setWrongQuestions] = useState(15);
  const [unattemptedQuestions, setUnattemptedQuestions] = useState(15);
  const [scoredMarks, setScoredMarks] = useState(165);
  const [totalPossibleMarks, setTotalPossibleMarks] = useState(300);

  const [qpFileName, setQpFileName] = useState('');
  const [qpDataUrl, setQpDataUrl] = useState('');
  const [solFileName, setSolFileName] = useState('');
  const [solDataUrl, setSolDataUrl] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isSolution = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (isSolution) {
        setSolFileName(file.name);
        setSolDataUrl(dataUrl);
      } else {
        setQpFileName(file.name);
        setQpDataUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) return;

    const totalAns = Number(correctQuestions) + Number(wrongQuestions);
    const accPct = totalAns > 0 ? Math.round((Number(correctQuestions) / totalAns) * 100) : 0;

    const newRecord: TestRecord = {
      id: 'test_' + Date.now(),
      testName: testName.trim(),
      testType,
      totalQuestions: Number(totalQuestions),
      correctQuestions: Number(correctQuestions),
      wrongQuestions: Number(wrongQuestions),
      unattemptedQuestions: Number(unattemptedQuestions),
      scoredMarks: Number(scoredMarks),
      totalPossibleMarks: Number(totalPossibleMarks),
      accuracyPercentage: accPct,
      questionPaperName: qpFileName || undefined,
      questionPaperUrl: qpDataUrl || undefined,
      solutionName: solFileName || undefined,
      solutionUrl: solDataUrl || undefined,
      dateLogged: new Date().toLocaleDateString(),
    };

    onAddTest(newRecord);
    setTestName('');
    onClose();
  };

  return (
    <div className="p-6 rounded-3xl glass-card border border-purple-500/40 bg-slate-900/95 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-white">Log Custom Test Score & Attachments</h3>
        <button onClick={onClose} aria-label="Close modal" className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Custom Test Name</label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="e.g. Allen Full Mock 04..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              required
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Test Category</label>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            >
              <option value="JEE Main Full Mock">JEE Main Full Mock</option>
              <option value="JEE Advanced Paper 1">JEE Advanced Paper 1</option>
              <option value="JEE Advanced Paper 2">JEE Advanced Paper 2</option>
              <option value="CBSE 12 Physics Pre-Board">CBSE 12 Physics Pre-Board</option>
              <option value="Chapterwise Unit Test">Chapterwise Unit Test</option>
            </select>
          </div>
        </div>

        {/* Question Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-[10px] text-slate-400 font-medium block mb-1">Total Qs</label>
            <input
              type="number"
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] text-emerald-400 font-medium block mb-1">Correct (✓)</label>
            <input
              type="number"
              value={correctQuestions}
              onChange={(e) => setCorrectQuestions(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] text-rose-400 font-medium block mb-1">Wrong (✗)</label>
            <input
              type="number"
              value={wrongQuestions}
              onChange={(e) => setWrongQuestions(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-rose-300 font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-medium block mb-1">Unattempted</label>
            <input
              type="number"
              value={unattemptedQuestions}
              onChange={(e) => setUnattemptedQuestions(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono"
            />
          </div>
        </div>

        {/* Marks */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Scored Marks</label>
            <input
              type="number"
              value={scoredMarks}
              onChange={(e) => setScoredMarks(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-purple-300 font-bold font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Total Possible Marks</label>
            <input
              type="number"
              value={totalPossibleMarks}
              onChange={(e) => setTotalPossibleMarks(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-bold font-mono"
            />
          </div>
        </div>

        {/* Attachments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 border-dashed hover:border-purple-500/50 cursor-pointer flex items-center justify-between text-xs">
            <span className="text-slate-400 truncate">{qpFileName || 'Attach Question Paper PDF'}</span>
            <Upload className="w-4 h-4 text-purple-400 shrink-0" />
            <input type="file" accept="application/pdf,image/*" onChange={(e) => handleFileUpload(e, false)} className="hidden" />
          </label>

          <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 border-dashed hover:border-cyan-500/50 cursor-pointer flex items-center justify-between text-xs">
            <span className="text-slate-400 truncate">{solFileName || 'Attach Solution PDF'}</span>
            <Upload className="w-4 h-4 text-cyan-400 shrink-0" />
            <input type="file" accept="application/pdf,image/*" onChange={(e) => handleFileUpload(e, true)} className="hidden" />
          </label>
        </div>

        <button type="submit" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs">
          Save Custom Test Score
        </button>
      </form>
    </div>
  );
};
