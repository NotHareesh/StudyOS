'use client';

import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit3, Check, X, Bot, Sparkles, FolderPlus, Layers, CheckCircle2 } from 'lucide-react';
import { useSyllabus } from '@/contexts/syllabus-context';
import { TopicStatus } from '@/types/syllabus';
import { useAIDrawer } from '@/contexts/ai-drawer-context';

export default function SyllabusTrackerPage() {
  const {
    subjects,
    addSubject,
    editSubject,
    deleteSubject,
    addChapter,
    editChapter,
    deleteChapter,
    addTopic,
    editTopic,
    deleteTopic,
    cycleTopicStatus,
    getOverallMastery,
  } = useSyllabus();

  const { openAIDrawer } = useAIDrawer();

  // Dialog States
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubColor, setNewSubColor] = useState('#6366f1');

  const [activeSubForChapter, setActiveSubForChapter] = useState<string | null>(null);
  const [newChapName, setNewChapName] = useState('');
  const [newChapCbse, setNewChapCbse] = useState(0);
  const [newChapJeeMain, setNewChapJeeMain] = useState(0);
  const [newChapJeeAdv, setNewChapJeeAdv] = useState(0);

  const [activeChapForTopic, setActiveChapForTopic] = useState<{ subId: string; chapId: string } | null>(null);
  const [newTopicName, setNewTopicName] = useState('');

  // Editing state
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editSubNameText, setEditSubNameText] = useState('');

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubName.trim()) {
      addSubject(newSubName.trim(), newSubColor);
      setNewSubName('');
      setIsAddSubjectOpen(false);
    }
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSubForChapter && newChapName.trim()) {
      addChapter(activeSubForChapter, newChapName.trim(), newChapCbse, newChapJeeMain, newChapJeeAdv);
      setNewChapName('');
      setNewChapCbse(0);
      setNewChapJeeMain(0);
      setNewChapJeeAdv(0);
      setActiveSubForChapter(null);
    }
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeChapForTopic && newTopicName.trim()) {
      addTopic(activeChapForTopic.subId, activeChapForTopic.chapId, newTopicName.trim());
      setNewTopicName('');
      setActiveChapForTopic(null);
    }
  };

  const getStatusBadge = (status: TopicStatus) => {
    switch (status) {
      case 'mastered':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Mastered 🏆</span>;
      case 'revised':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Revised ✨</span>;
      case 'practiced':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Practiced 📝</span>;
      case 'learning':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">Learning 📖</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-400">Not Started</span>;
    }
  };

  const overallMastery = getOverallMastery();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-indigo-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Dynamic Syllabus & Mastery Matrix
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Syllabus Tracker
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Add custom subjects, chapters, and topics. Click any topic to cycle mastery status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openAIDrawer('general', 'Syllabus Optimization')}
            className="px-4 py-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/60 flex items-center gap-2 shrink-0"
          >
            <Bot className="w-4 h-4" /> AI Syllabus Strategy
          </button>
          <button
            onClick={() => setIsAddSubjectOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>
      </div>

      {/* Add Subject Modal */}
      {isAddSubjectOpen && (
        <div className="p-6 rounded-3xl glass-card border border-indigo-500/40 bg-slate-900/90 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Create New Subject</h3>
            <button onClick={() => setIsAddSubjectOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleCreateSubject} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              placeholder="e.g. Physics, Organic Chemistry, Calculus..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              autoFocus
            />
            <div className="flex items-center gap-2">
              {['#a855f7', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#6366f1'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewSubColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full border-2 ${newSubColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={!newSubName.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs disabled:opacity-50"
            >
              Save Subject
            </button>
          </form>
        </div>
      )}

      {/* Overall Mastery Banner */}
      {subjects.length > 0 && (
        <div className="p-5 rounded-2xl glass-card border border-slate-800 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-300">Overall Syllabus Mastery:</span>
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-sm text-emerald-400">{overallMastery}%</span>
            <div className="w-48 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${overallMastery}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Empty State when no subjects exist */}
      {subjects.length === 0 && (
        <div className="p-12 rounded-3xl glass-card border border-slate-800/80 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
            <FolderPlus className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-white">No Subjects Added Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Get started by adding your Class 12 CBSE or JEE subjects (e.g., Physics, Chemistry, Mathematics). You can create chapters and topics under each subject.
          </p>
          <button
            onClick={() => setIsAddSubjectOpen(true)}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Your First Subject
          </button>
        </div>
      )}

      {/* Subject Cards List */}
      <div className="space-y-8">
        {subjects.map((sub) => (
          <div key={sub.id} className="p-6 rounded-3xl glass-card border border-slate-800 space-y-6">
            {/* Subject Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: sub.color }} />
                {editingSubId === sub.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editSubNameText}
                      onChange={(e) => setEditSubNameText(e.target.value)}
                      className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white"
                    />
                    <button
                      onClick={() => {
                        if (editSubNameText.trim()) {
                          editSubject(sub.id, editSubNameText.trim(), sub.color);
                          setEditingSubId(null);
                        }
                      }}
                      className="p-1 rounded bg-emerald-600 text-white"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <h2 className="text-xl font-bold text-slate-100">{sub.name}</h2>
                )}

                <button
                  onClick={() => {
                    setEditingSubId(sub.id);
                    setEditSubNameText(sub.name);
                  }}
                  className="p-1 rounded text-slate-500 hover:text-slate-300"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteSubject(sub.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400"
                  title="Delete Subject"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setActiveSubForChapter(sub.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-300 hover:bg-slate-800 flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Add Chapter
              </button>
            </div>

            {/* Add Chapter Input Box */}
            {activeSubForChapter === sub.id && (
              <form onSubmit={handleCreateChapter} className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Add Chapter to {sub.name}</span>
                  <button type="button" onClick={() => setActiveSubForChapter(null)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={newChapName}
                    onChange={(e) => setNewChapName(e.target.value)}
                    placeholder="Chapter Name (e.g. Electrostatics)"
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <input
                    type="number"
                    value={newChapCbse || ''}
                    onChange={(e) => setNewChapCbse(Number(e.target.value))}
                    placeholder="CBSE Weight %"
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <input
                    type="number"
                    value={newChapJeeMain || ''}
                    onChange={(e) => setNewChapJeeMain(Number(e.target.value))}
                    placeholder="JEE Main Weight %"
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newChapName.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs disabled:opacity-50"
                >
                  Save Chapter
                </button>
              </form>
            )}

            {/* Chapters List */}
            {sub.chapters.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500">
                No chapters added yet for {sub.name}. Click "+ Add Chapter" above.
              </div>
            )}

            <div className="space-y-4">
              {sub.chapters.map((chap) => (
                <div key={chap.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                      <span>{chap.name}</span>
                      <button
                        onClick={() => deleteChapter(sub.id, chap.id)}
                        className="text-slate-600 hover:text-rose-400"
                        title="Delete Chapter"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </h3>

                    <button
                      onClick={() => setActiveChapForTopic({ subId: sub.id, chapId: chap.id })}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 text-[11px] font-semibold text-cyan-300 border border-cyan-500/20 hover:bg-cyan-950/40 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Topic
                    </button>
                  </div>

                  {/* Add Topic Input */}
                  {activeChapForTopic?.subId === sub.id && activeChapForTopic?.chapId === chap.id && (
                    <form onSubmit={handleCreateTopic} className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={newTopicName}
                        onChange={(e) => setNewTopicName(e.target.value)}
                        placeholder="Topic name..."
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={!newTopicName.trim()}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveChapForTopic(null)}
                        className="p-1.5 text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </form>
                  )}

                  {/* Topics Grid */}
                  {chap.topics.length === 0 && (
                    <div className="text-[11px] text-slate-500 italic">No topics yet. Click "+ Add Topic".</div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                    {chap.topics.map((top) => (
                      <div
                        key={top.id}
                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/60 hover:border-slate-700 flex items-center justify-between gap-3 group"
                      >
                        <span
                          onClick={() => cycleTopicStatus(sub.id, chap.id, top.id)}
                          className="text-xs text-slate-200 font-medium cursor-pointer flex-1"
                          title="Click to cycle status"
                        >
                          {top.name}
                        </span>

                        <div className="flex items-center gap-2 shrink-0">
                          <div
                            onClick={() => cycleTopicStatus(sub.id, chap.id, top.id)}
                            className="cursor-pointer"
                          >
                            {getStatusBadge(top.status)}
                          </div>
                          <button
                            onClick={() => deleteTopic(sub.id, chap.id, top.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-rose-400 p-0.5"
                            title="Delete topic"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
