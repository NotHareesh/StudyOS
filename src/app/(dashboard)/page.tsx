'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  RotateCcw,
  Clock,
  Flame,
  TrendingUp,
  BookOpen,
  Plus,
  BarChart3,
  FileText,
  Bot,
  CheckCircle2,
  Circle,
  Play,
  ArrowRight,
  Sparkles,
  Target,
  X,
  RefreshCw
} from 'lucide-react';
import { StatsCard } from '@/components/common/stats-card';
import { useAuth } from '@/contexts/auth-context';
import { useSyllabus } from '@/contexts/syllabus-context';
import { usePomodoro } from '@/contexts/pomodoro-context';
import { useAIDrawer } from '@/contexts/ai-drawer-context';
import { LaTeXRenderer } from '@/components/common/latex-renderer';

export default function DashboardPage() {
  const { user } = useAuth();
  const { subjects, getOverallMastery } = useSyllabus();
  const { startTimer, setActiveTask } = usePomodoro();
  const { openAIDrawer } = useAIDrawer();

  // Active task queue state
  const [tasks, setTasks] = useState<Array<{ id: string; title: string; completed: boolean; priority: string }>>([]);

  // AI Daily Plan Modal state
  const [isAiPlanModalOpen, setIsAiPlanModalOpen] = useState(false);
  const [aiPlanText, setAiPlanText] = useState('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const startTaskPomodoro = (taskTitle: string) => {
    setActiveTask(taskTitle);
    startTimer();
  };

  const handleGenerateAiPlan = async () => {
    setIsAiPlanModalOpen(true);
    setIsGeneratingPlan(true);
    const promptStr = `Generate an optimized Class 12 CBSE & JEE daily study plan for today. Subject Focus: ${subjects.map(s => s.name).join(', ') || 'Physics, Chemistry, Maths'}. Format as a structured 4-block timetable with specific focus goals.`;

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptStr,
          contextType: 'general',
          contextTitle: 'Daily Plan Generation',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiPlanText(data.response);
      } else {
        setAiPlanText('1. **08:30 - 10:30**: Physics - Electrostatics & Gauss Law Problem Practice.\n2. **11:00 - 12:30**: Chemistry - Organic Mechanisms & Aldol Reactions.\n3. **14:30 - 16:30**: Mathematics - Definite Integral Properties 1-5.\n4. **19:00 - 20:30**: Spaced Repetition & Mock Test Error Analysis.');
      }
    } catch {
      setAiPlanText('1. **08:30 - 10:30**: Physics - High-Yield Problem Solving.\n2. **11:00 - 12:30**: Chemistry - NCERT Concept Review.\n3. **14:30 - 16:30**: Mathematics - PYQ Practice.\n4. **19:00 - 20:30**: Daily Revisions.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const overallMastery = getOverallMastery();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 glass-card border border-indigo-500/20 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-slate-900">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Target: {user.targetExams.join(' • ')} 2026
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user.displayName}! 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Overall Syllabus Mastery is at <span className="text-emerald-400 font-semibold font-mono">{overallMastery}%</span>. Focus on your high-priority goals today!
            </p>
          </div>

          {/* Working AI Daily Plan Launcher Button */}
          <button
            onClick={handleGenerateAiPlan}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 shrink-0"
          >
            <Bot className="w-5 h-5" />
            <span>Generate AI Daily Plan</span>
          </button>
        </div>
      </div>

      {/* AI Daily Plan Modal */}
      {isAiPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl glass-card rounded-3xl border border-cyan-500/40 bg-[#0d1424] p-6 space-y-5 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">Gemini AI Customized Daily Plan</h3>
              </div>
              <button onClick={() => setIsAiPlanModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isGeneratingPlan ? (
              <div className="p-12 text-center text-xs text-cyan-400 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
                <p className="font-semibold text-sm">Gemini is analyzing your subjects & creating your study timetable...</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs text-slate-200">
                <LaTeXRenderer content={aiPlanText} />
                
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <Link
                    href="/planner"
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                  >
                    Open Daily Planner
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Daily Study Target"
          value={`${user.dailyGoalHours} Hours`}
          subtitle="Configurable in Settings"
          icon={Clock}
          iconColor="text-cyan-400"
        />
        <StatsCard
          title="Current Streak"
          value={`${user.streakCount} Day${user.streakCount === 1 ? '' : 's'}`}
          subtitle="Streak Active"
          icon={Flame}
          iconColor="text-amber-400"
        />
        <StatsCard
          title="Subjects Tracked"
          value={`${subjects.length} Subjects`}
          subtitle="Configurable in Syllabus"
          icon={BookOpen}
          iconColor="text-purple-400"
        />
        <StatsCard
          title="Syllabus Mastery"
          value={`${overallMastery}%`}
          subtitle="Across all chapters"
          icon={TrendingUp}
          iconColor="text-emerald-400"
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Tasks & Revisions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Tasks */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-100">Today's Study Tasks</h2>
                  <p className="text-xs text-slate-400">{completedCount} of {tasks.length} completed</p>
                </div>
              </div>

              <Link
                href="/planner"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                Planner <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Task Items */}
            {tasks.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <p className="text-xs text-slate-400">No tasks created yet for today.</p>
                <Link
                  href="/planner"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Create Task in Daily Planner
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      task.completed
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                          {task.title}
                        </p>
                      </div>
                    </div>

                    {!task.completed && (
                      <button
                        onClick={() => startTaskPomodoro(task.title)}
                        className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0"
                      >
                        <Play className="w-3.5 h-3.5 fill-emerald-400" />
                        <span className="hidden sm:inline">Focus</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Dynamic Subject Progress & Quick Actions */}
        <div className="space-y-8">
          {/* Subject Mastery Progress Bars */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Subject Mastery
              </h2>
              <Link href="/syllabus" className="text-xs text-indigo-400 hover:underline font-semibold">
                Manage
              </Link>
            </div>

            {subjects.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
                <p>No subjects added yet.</p>
                <Link href="/syllabus" className="text-indigo-400 hover:underline font-bold block">
                  + Add Subjects in Syllabus Tracker
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {subjects.map((sub) => {
                  let totalT = 0;
                  let masteredT = 0;
                  sub.chapters.forEach(c => c.topics.forEach(t => {
                    totalT++;
                    if (t.status === 'mastered') masteredT += 1;
                    else if (t.status === 'revised') masteredT += 0.8;
                    else if (t.status === 'practiced') masteredT += 0.5;
                    else if (t.status === 'learning') masteredT += 0.2;
                  }));
                  const subPct = totalT > 0 ? Math.round((masteredT / totalT) * 100) : 0;

                  return (
                    <div key={sub.id}>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                        <span className="text-slate-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sub.color }} />
                          {sub.name}
                        </span>
                        <span className="text-slate-300 font-mono">{subPct}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div className="h-full rounded-full transition-all" style={{ width: `${subPct}%`, backgroundColor: sub.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
            <h2 className="font-bold text-sm text-slate-400 uppercase tracking-wider">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/planner"
                className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all flex flex-col items-center justify-center gap-2 text-center group"
              >
                <Plus className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">New Task</span>
              </Link>

              <Link
                href="/syllabus"
                className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white transition-all flex flex-col items-center justify-center gap-2 text-center group"
              >
                <BookOpen className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">Add Subject</span>
              </Link>

              <Link
                href="/reader"
                className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all flex flex-col items-center justify-center gap-2 text-center group"
              >
                <FileText className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">Open PDF</span>
              </Link>

              <Link
                href="/revision"
                className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-white transition-all flex flex-col items-center justify-center gap-2 text-center group"
              >
                <RotateCcw className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">Revisions</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
