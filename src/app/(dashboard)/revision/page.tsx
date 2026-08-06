'use client';

import React, { useState, useEffect } from 'react';
import { RotateCcw, AlertTriangle, CheckCircle, Bot } from 'lucide-react';
import { SubjectBadge } from '@/components/common/subject-badge';
import { useAIDrawer } from '@/contexts/ai-drawer-context';
import { StorageService } from '@/services/storage';
import { FlashcardQuizModal } from '@/components/features/revision/flashcard-quiz-modal';

export interface RevisionTopic {
  id: string;
  topic: string;
  chapter: string;
  subjectId: 'physics' | 'chemistry' | 'maths';
  scheduledDate: string;
  status: 'missed' | 'due' | 'upcoming';
  level: number;
}

const INITIAL_QUEUE: RevisionTopic[] = [
  { id: 'r1', topic: 'Rotational Dynamics & Torque', chapter: 'Rigid Body Motion', subjectId: 'physics', scheduledDate: '2 Days Ago', status: 'missed', level: 2 },
  { id: 'r2', topic: 'Coordination Compounds Isomerism', chapter: 'Inorganic Chemistry', subjectId: 'chemistry', scheduledDate: 'Today', status: 'due', level: 4 },
  { id: 'r3', topic: 'Definite Integral Property 4', chapter: 'Calculus', subjectId: 'maths', scheduledDate: 'Today', status: 'due', level: 3 },
  { id: 'r4', topic: 'Gauss Law & Electric Dipole', chapter: 'Electrostatics', subjectId: 'physics', scheduledDate: 'Tomorrow', status: 'upcoming', level: 5 },
];

export default function RevisionEnginePage() {
  const { openAIDrawer } = useAIDrawer();

  const [queue, setQueue] = useState<RevisionTopic[]>([]);
  const [quizModalOpen, setQuizModalOpen] = useState(false);

  useEffect(() => {
    const loaded = StorageService.getRevisionQueue();
    if (loaded.length > 0) setQueue(loaded);
    else {
      setQueue(INITIAL_QUEUE);
      StorageService.saveRevisionQueue(INITIAL_QUEUE);
    }
  }, []);

  const saveQueue = (updated: RevisionTopic[]) => {
    setQueue(updated);
    StorageService.saveRevisionQueue(updated);
  };

  const handleGradeRevision = (id: string, rating: number) => {
    const updated = queue.filter(r => r.id !== id);
    saveQueue(updated);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-rose-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
            <RotateCcw className="w-3.5 h-3.5" /> Module 4 &bull; SM-2 Spaced Repetition Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Automated Revision Radar
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Algorithmically scheduled topic revisions designed for long-term memory retention before JEE & CBSE.
          </p>
        </div>

        <button
          onClick={() => setQuizModalOpen(true)}
          aria-label="Generate AI Flashcard Quiz"
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/20 flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
        >
          <Bot className="w-4 h-4" /> AI Generate Flashcard Quiz
        </button>
      </div>

      {/* Extracted Flashcard Quiz Modal */}
      <FlashcardQuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
      />

      {/* Missed Revision Alert Banner */}
      {queue.some(r => r.status === 'missed') && (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-200">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <span className="font-bold text-rose-300">Attention: Missed Revision Detected!</span> Re-certify your recall today to prevent knowledge decay in Physics.
          </div>
        </div>
      )}

      {/* Revision Queue List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Active Revision Queue ({queue.length})
        </h2>

        {queue.length === 0 ? (
          <div className="p-12 rounded-3xl glass-card border border-slate-800 text-center text-xs text-slate-400 space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="font-bold text-white text-base">All Scheduled Revisions Completed!</p>
            <p>Great job maintaining your recall memory. Check back tomorrow for the next SM-2 interval.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {queue.map((item) => (
              <div
                key={item.id}
                role="article"
                className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <SubjectBadge subjectId={item.subjectId} />
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                      item.status === 'missed'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : item.status === 'due'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    }`}>
                      {item.status.toUpperCase()} ({item.scheduledDate})
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-100">{item.topic}</h3>
                  <p className="text-xs text-slate-400">Chapter: {item.chapter} &bull; Revision Step: Level {item.level}</p>

                  <button
                    onClick={() => openAIDrawer('topic', item.topic)}
                    aria-label={`Ask AI Tutor about ${item.topic}`}
                    className="mt-2 text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Bot className="w-3.5 h-3.5" /> Ask AI Tutor about {item.topic}
                  </button>
                </div>

                {/* SM-2 Quality Rating Buttons */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[11px] text-slate-400 font-medium block">Grade Recall Quality (SM-2):</span>
                  <div className="grid grid-cols-5 gap-1.5 text-xs font-semibold">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleGradeRevision(item.id, rating)}
                        aria-label={`Grade recall quality ${rating} out of 5 stars`}
                        className="py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 transition-colors text-center"
                      >
                        {rating}★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
