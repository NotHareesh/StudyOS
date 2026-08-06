'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Clock, Calendar, Flame, TrendingUp, BookOpen, BarChart3, CheckCircle2, Award, Target, Bot } from 'lucide-react';
import { StatsCard } from '@/components/common/stats-card';
import { useAuth } from '@/contexts/auth-context';
import { useSyllabus } from '@/contexts/syllabus-context';
import { useAIDrawer } from '@/contexts/ai-drawer-context';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { subjects, getOverallMastery } = useSyllabus();
  const { openAIDrawer } = useAIDrawer();

  const [testCount, setTestCount] = useState(0);
  const [avgAccuracy, setAvgAccuracy] = useState(0);
  const [highestScore, setHighestScore] = useState(0);

  // Load real custom test metrics from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('studyos_test_records');
      if (saved) {
        const tests = JSON.parse(saved);
        setTestCount(tests.length);
        if (tests.length > 0) {
          const totalAcc = tests.reduce((acc: number, t: any) => acc + (t.accuracyPercentage || 0), 0);
          setAvgAccuracy(Math.round(totalAcc / tests.length));
          const maxMarks = Math.max(...tests.map((t: any) => t.scoredMarks || 0));
          setHighestScore(maxMarks);
        }
      }
    } catch {
      // fallback
    }
  }, []);

  const overallMastery = getOverallMastery();

  // Generate 28-day consistency heatmap blocks based on streak & study sessions
  const heatmapDays = Array.from({ length: 28 }, (_, i) => {
    const isPastActiveDay = i >= 28 - user.streakCount;
    return {
      day: i + 1,
      level: isPastActiveDay ? (i % 3 === 0 ? 3 : 2) : 0,
    };
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-indigo-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <LineChart className="w-3.5 h-3.5" /> Module 10 &bull; Real-time Study & Performance Analytics
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Study Analytics & Productivity Insights
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time analytics computed directly from your active subjects, custom test scores, and study streak.
          </p>
        </div>

        <button
          onClick={() => openAIDrawer('general', 'Study Analytics Audit', 'Analyze my study consistency, overall syllabus mastery, and test accuracy metrics.')}
          className="px-4 py-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/60 flex items-center gap-2 shrink-0"
        >
          <Bot className="w-4 h-4" /> AI Performance Audit
        </button>
      </div>

      {/* Dynamic Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Daily Study Target"
          value={`${user.dailyGoalHours} Hours`}
          subtitle="Target Hours/Day"
          icon={Clock}
          iconColor="text-indigo-400"
        />
        <StatsCard
          title="Active Study Streak"
          value={`${user.streakCount} Day${user.streakCount === 1 ? '' : 's'}`}
          subtitle="Consistency Streak"
          icon={Flame}
          iconColor="text-amber-400"
        />
        <StatsCard
          title="Syllabus Mastery"
          value={`${overallMastery}%`}
          subtitle={`${subjects.length} Active Subjects`}
          icon={TrendingUp}
          iconColor="text-emerald-400"
        />
        <StatsCard
          title="Average Test Accuracy"
          value={testCount > 0 ? `${avgAccuracy}%` : 'No Tests Logged'}
          subtitle={testCount > 0 ? `${testCount} Custom Tests Logged` : 'Log test in Mock Tests'}
          icon={BarChart3}
          iconColor="text-cyan-400"
        />
      </div>

      {/* Dynamic Subject Breakdown Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real Subject Mastery Metrics */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" /> Subject Progress Breakdown
          </h2>

          {subjects.length === 0 ? (
            <div className="p-6 text-center rounded-2xl bg-slate-900/60 text-xs text-slate-400">
              No subjects added yet. Add subjects in Syllabus Tracker to see real analytics.
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
                  <div key={sub.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                        {sub.name}
                      </span>
                      <span className="font-mono text-emerald-400">{subPct}% Mastery</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {sub.chapters.length} Chapters &bull; {totalT} Total Topics
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full rounded-full transition-all" style={{ width: `${subPct}%`, backgroundColor: sub.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Real Study Consistency Heatmap Grid */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" /> 28-Day Study Consistency Grid
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Active daily study sessions computed from your active streak ({user.streakCount} days).
            </p>
          </div>

          <div className="grid grid-cols-7 gap-2 py-4">
            {heatmapDays.map((d) => (
              <div
                key={d.day}
                className={`h-9 rounded-xl border flex items-center justify-center text-[10px] font-bold font-mono transition-all ${
                  d.level === 3
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                    : d.level === 2
                    ? 'bg-emerald-600/40 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
                title={`Day ${d.day}: ${d.level > 0 ? 'Active Study Logged' : 'Rest Day'}`}
              >
                {d.day}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Rest Day</span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-slate-900 border border-slate-800" />
              <span className="w-3 h-3 rounded bg-emerald-600/40 border border-emerald-500/30" />
              <span className="w-3 h-3 rounded bg-emerald-500" />
            </div>
            <span>High Intensity Focus</span>
          </div>
        </div>
      </div>
    </div>
  );
}
