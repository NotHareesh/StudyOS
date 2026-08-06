'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Plus, Bot, Eye, Trash2 } from 'lucide-react';
import { useAIDrawer } from '@/contexts/ai-drawer-context';
import { StorageService, TestRecord } from '@/services/storage';
import { AddTestModal } from '@/components/features/mock-tests/add-test-modal';
import { PDFViewerModal } from '@/components/features/mock-tests/pdf-viewer-modal';

const INITIAL_TESTS: TestRecord[] = [
  {
    id: 't1',
    testName: 'Allen Full Mock Test 04',
    testType: 'JEE Main Full Mock',
    totalQuestions: 75,
    correctQuestions: 48,
    wrongQuestions: 12,
    unattemptedQuestions: 15,
    scoredMarks: 180,
    totalPossibleMarks: 300,
    accuracyPercentage: 80,
    questionPaperName: 'Allen_Mock_04_QP.pdf',
    solutionName: 'Allen_Mock_04_Solutions.pdf',
    dateLogged: 'Aug 4, 2026',
  },
];

export default function MockTestsPage() {
  const { openAIDrawer } = useAIDrawer();

  const [tests, setTests] = useState<TestRecord[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activePdfModal, setActivePdfModal] = useState<{ isOpen: boolean; title: string; url?: string }>({
    isOpen: false,
    title: '',
  });

  useEffect(() => {
    const loaded = StorageService.getTestRecords();
    if (loaded.length > 0) setTests(loaded);
    else {
      setTests(INITIAL_TESTS);
      StorageService.saveTestRecords(INITIAL_TESTS);
    }
  }, []);

  const saveTests = (updated: TestRecord[]) => {
    setTests(updated);
    StorageService.saveTestRecords(updated);
  };

  const handleAddTest = (newTest: TestRecord) => {
    saveTests([newTest, ...tests]);
  };

  const handleDeleteTest = (id: string) => {
    saveTests(tests.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-purple-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Module 5 &bull; Custom Test Analytics
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Mock & Custom Test Analytics
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Log custom test names, question accuracy, scored marks, and view attached Question Papers & Solutions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openAIDrawer('general', 'Mock Test Performance Audit', 'Audit my recent test scores, accuracy trends, and identify areas for score improvement.')}
            aria-label="AI Test Audit"
            className="px-4 py-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/60 flex items-center gap-2"
          >
            <Bot className="w-4 h-4" /> AI Test Audit
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            aria-label="Log Custom Test"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Log Custom Test
          </button>
        </div>
      </div>

      {/* Extracted Add Test Modal */}
      <AddTestModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddTest={handleAddTest}
      />

      {/* Extracted PDF Viewer Modal */}
      <PDFViewerModal
        isOpen={activePdfModal.isOpen}
        onClose={() => setActivePdfModal({ isOpen: false, title: '' })}
        title={activePdfModal.title}
        url={activePdfModal.url}
      />

      {/* Test Log Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Logged Test Records ({tests.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test) => (
            <div key={test.id} role="article" className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-100">{test.testName}</h3>
                    <p className="text-xs text-slate-400">{test.testType} &bull; Logged on {test.dateLogged}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteTest(test.id)}
                    aria-label={`Delete test ${test.testName}`}
                    className="p-1 text-slate-600 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Question Breakdown Pills */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Total Qs</span>
                    <span className="font-bold text-slate-200 font-mono">{test.totalQuestions}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-400 block font-medium">Correct ✓</span>
                    <span className="font-bold text-emerald-300 font-mono">{test.correctQuestions}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30">
                    <span className="text-[10px] text-rose-400 block font-medium">Wrong ✗</span>
                    <span className="font-bold text-rose-300 font-mono">{test.wrongQuestions}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium font-mono">Unattempted</span>
                    <span className="font-bold text-slate-400 font-mono">{test.unattemptedQuestions}</span>
                  </div>
                </div>

                {/* Score & Accuracy Meter */}
                <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Score</span>
                    <span className="font-bold text-purple-300 font-mono text-sm">
                      {test.scoredMarks} / {test.totalPossibleMarks}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">Accuracy</span>
                    <span className="font-bold text-cyan-300 font-mono text-sm">
                      {test.accuracyPercentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* View Question Paper / Solution Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs">
                <button
                  onClick={() => setActivePdfModal({ isOpen: true, title: test.questionPaperName || `${test.testName} Question Paper`, url: test.questionPaperUrl })}
                  aria-label={`View Question Paper for ${test.testName}`}
                  className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-purple-300 font-semibold flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-400" /> View QP
                </button>
                <button
                  onClick={() => setActivePdfModal({ isOpen: true, title: test.solutionName || `${test.testName} Solution Key`, url: test.solutionUrl })}
                  aria-label={`View Solution Key for ${test.testName}`}
                  className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 font-semibold flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> View Solution
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
