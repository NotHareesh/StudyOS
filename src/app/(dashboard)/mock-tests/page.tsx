'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Plus, TrendingUp, Target, Award, AlertTriangle, Bot, FileText, CheckCircle2, XCircle, MinusCircle, Eye, X, Upload } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useAIDrawer } from '@/contexts/ai-drawer-context';

export interface CustomTestRecord {
  id: string;
  testName: string;
  testType: string;
  date: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  scoredMarks: number;
  totalPossibleMarks: number;
  accuracyPercentage: number;
  questionPaperUrl?: string; // Data URL or Blob URL for Question Paper PDF
  questionPaperName?: string;
  solutionUrl?: string;      // Data URL or Blob URL for Solution PDF
  solutionName?: string;
}

const STORAGE_KEY = 'studyos_test_records';

export default function CustomTestAnalyticsPage() {
  const { openAIDrawer } = useAIDrawer();

  const [tests, setTests] = useState<CustomTestRecord[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form Fields
  const [testName, setTestName] = useState('');
  const [testType, setTestType] = useState('JEE Main');
  const [totalQuestions, setTotalQuestions] = useState(75);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [unattemptedCount, setUnattemptedCount] = useState(0);
  const [scoredMarks, setScoredMarks] = useState(0);
  const [totalPossibleMarks, setTotalPossibleMarks] = useState(300);

  // File Upload states
  const [questionPaperFile, setQuestionPaperFile] = useState<{ url: string; name: string } | null>(null);
  const [solutionFile, setSolutionFile] = useState<{ url: string; name: string } | null>(null);

  // Viewer Modal State
  const [viewingDocument, setViewingDocument] = useState<{ title: string; url: string } | null>(null);

  // Load tests from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTests(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load test records:', e);
    }
  }, []);

  const saveTests = (updated: CustomTestRecord[]) => {
    setTests(updated);
    try {
      // Store test records (excluding large Blob URLs for localStorage safety)
      const lightRecords = updated.map(t => ({
        ...t,
        questionPaperUrl: t.questionPaperUrl?.startsWith('blob:') ? '' : t.questionPaperUrl,
        solutionUrl: t.solutionUrl?.startsWith('blob:') ? '' : t.solutionUrl,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightRecords));
    } catch (e) {
      console.error('Failed to save test records:', e);
    }
  };

  const handleQPFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setQuestionPaperFile({ url, name: file.name });
  };

  const handleSolutionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSolutionFile({ url, name: file.name });
  };

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) return;

    const attempted = Number(correctCount) + Number(wrongCount);
    const accuracy = attempted > 0 ? Math.round((Number(correctCount) / attempted) * 100) : 0;

    const newTest: CustomTestRecord = {
      id: 'test_' + Date.now(),
      testName: testName.trim(),
      testType,
      date: new Date().toLocaleDateString(),
      totalQuestions: Number(totalQuestions),
      correctCount: Number(correctCount),
      wrongCount: Number(wrongCount),
      unattemptedCount: Number(unattemptedCount),
      scoredMarks: Number(scoredMarks),
      totalPossibleMarks: Number(totalPossibleMarks),
      accuracyPercentage: accuracy,
      questionPaperUrl: questionPaperFile?.url,
      questionPaperName: questionPaperFile?.name,
      solutionUrl: solutionFile?.url,
      solutionName: solutionFile?.name,
    };

    const updated = [newTest, ...tests];
    saveTests(updated);

    // Reset Form
    setTestName('');
    setCorrectCount(0);
    setWrongCount(0);
    setUnattemptedCount(0);
    setScoredMarks(0);
    setQuestionPaperFile(null);
    setSolutionFile(null);
    setIsAddOpen(false);
  };

  const handleDeleteTest = (id: string) => {
    saveTests(tests.filter(t => t.id !== id));
  };

  // Prepare chart data
  const chartData = tests
    .slice()
    .reverse()
    .map(t => ({ name: t.testName, score: t.scoredMarks }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-emerald-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Module 7 &bull; Custom Test Analytics & Paper Store
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Test Performance Analytics
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Log custom test scores, question counts, right/wrong breakdowns, and attach question papers & solutions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openAIDrawer('mock_test', 'Custom Test Performance')}
            className="px-4 py-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/60 flex items-center gap-2"
          >
            <Bot className="w-4 h-4" /> AI Test Audit
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Log Custom Test
          </button>
        </div>
      </div>

      {/* Add Custom Test Dialog */}
      {isAddOpen && (
        <div className="p-6 rounded-3xl glass-card border border-emerald-500/40 bg-slate-900/90 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Log Custom Test Result</h3>
            <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateTest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] text-slate-400 font-medium">Test Name / Code</label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g. Allen Full Test 04, Mathongo Mock 12"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Test Type</label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="JEE Main">JEE Main</option>
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="Class 12 CBSE">Class 12 CBSE Board</option>
                  <option value="Part Test">Part Test / Chapter Test</option>
                </select>
              </div>
            </div>

            {/* Question Breakdown Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Total Questions</label>
                <input
                  type="number"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-emerald-400 font-medium">Correct Questions</label>
                <input
                  type="number"
                  value={correctCount}
                  onChange={(e) => setCorrectCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono font-bold"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-rose-400 font-medium">Wrong Questions</label>
                <input
                  type="number"
                  value={wrongCount}
                  onChange={(e) => setWrongCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-rose-400 font-mono font-bold"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Unattempted</label>
                <input
                  type="number"
                  value={unattemptedCount}
                  onChange={(e) => setUnattemptedCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono"
                />
              </div>
            </div>

            {/* Marks Input */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Scored Marks</label>
                <input
                  type="number"
                  value={scoredMarks}
                  onChange={(e) => setScoredMarks(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono font-bold"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Total Maximum Marks</label>
                <input
                  type="number"
                  value={totalPossibleMarks}
                  onChange={(e) => setTotalPossibleMarks(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  required
                />
              </div>
            </div>

            {/* Document Attachments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              {/* Question Paper PDF */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-medium block">Attach Question Paper (PDF / Image)</label>
                <label className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-300 hover:bg-slate-900 cursor-pointer flex items-center justify-between">
                  <span className="truncate">{questionPaperFile?.name || 'Choose Question Paper File...'}</span>
                  <Upload className="w-3.5 h-3.5 shrink-0" />
                  <input type="file" accept="application/pdf,image/*" onChange={handleQPFileChange} className="hidden" />
                </label>
              </div>

              {/* Solution PDF */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-medium block">Attach Answer Key / Solution (PDF / Image)</label>
                <label className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-300 hover:bg-slate-900 cursor-pointer flex items-center justify-between">
                  <span className="truncate">{solutionFile?.name || 'Choose Solution File...'}</span>
                  <Upload className="w-3.5 h-3.5 shrink-0" />
                  <input type="file" accept="application/pdf,image/*" onChange={handleSolutionFileChange} className="hidden" />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Save Custom Test Entry
            </button>
          </form>
        </div>
      )}

      {/* Embedded Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl h-[85vh] glass-card rounded-3xl border border-slate-700 bg-[#0d1424] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                {viewingDocument.title}
              </h3>
              <button onClick={() => setViewingDocument(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 w-full bg-slate-950">
              <iframe src={viewingDocument.url} className="w-full h-full border-none" title={viewingDocument.title} />
            </div>
          </div>
        </div>
      )}

      {/* Score Trend Chart */}
      {chartData.length > 0 && (
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Score Progression Graph
          </h2>

          <div className="h-60 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tests Log List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Logged Custom Tests ({tests.length})
        </h2>

        {tests.length === 0 ? (
          <div className="p-12 rounded-3xl glass-card border border-slate-800/80 text-center space-y-3">
            <BarChart3 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-white text-base">No Test Records Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click "Log Custom Test" above to record custom test marks, question breakdowns, and attach question paper & solution PDFs.
            </p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-600/30 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Log Your First Test
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tests.map((test) => (
              <div key={test.id} className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                      {test.testType}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{test.date}</span>
                  </div>

                  <h3 className="font-bold text-lg text-white">{test.testName}</h3>

                  {/* Marks & Accuracy Pill */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Score</span>
                      <span className="font-mono font-extrabold text-lg text-emerald-400">
                        {test.scoredMarks} / {test.totalPossibleMarks}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Accuracy</span>
                      <span className="font-mono font-extrabold text-lg text-indigo-400">
                        {test.accuracyPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Question Breakdown Counts */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-emerald-400 font-mono font-bold block">✓ {test.correctCount}</span>
                      <span className="text-[10px] text-slate-400">Correct</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-rose-400 font-mono font-bold block">✗ {test.wrongCount}</span>
                      <span className="text-[10px] text-slate-400">Wrong</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-400 font-mono font-bold block">- {test.unattemptedCount}</span>
                      <span className="text-[10px] text-slate-400">Unattempted</span>
                    </div>
                  </div>
                </div>

                {/* Question Paper & Solution Buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {test.questionPaperUrl && (
                      <button
                        onClick={() => setViewingDocument({ title: `${test.testName} - Question Paper`, url: test.questionPaperUrl! })}
                        className="px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-900/60 flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> View QP
                      </button>
                    )}

                    {test.solutionUrl && (
                      <button
                        onClick={() => setViewingDocument({ title: `${test.testName} - Solution`, url: test.solutionUrl! })}
                        className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/60 flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Solution
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteTest(test.id)}
                    className="text-xs text-slate-500 hover:text-rose-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
