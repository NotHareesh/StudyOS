'use client';

import React from 'react';
import { Search, Timer, Play, Pause, RotateCcw, Bot, Flame, Target } from 'lucide-react';
import { usePomodoro } from '@/contexts/pomodoro-context';
import { useAIDrawer } from '@/contexts/ai-drawer-context';
import { useAuth } from '@/contexts/auth-context';

interface TopNavProps {
  onOpenCommandPalette: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenCommandPalette }) => {
  const { secondsLeft, isRunning, startTimer, pauseTimer, resetTimer, activeTaskTitle } = usePomodoro();
  const { toggleAIDrawer, isOpen: isAIDrawerOpen } = useAIDrawer();
  const { user } = useAuth();

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <header className="h-16 px-6 glass-panel border-b border-[var(--border-subtle)] flex items-center justify-between gap-4 sticky top-0 z-20 bg-[#090d16]/80">
      {/* Cmd+K Quick Search Trigger */}
      <button
        onClick={onOpenCommandPalette}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all text-sm w-72 shadow-inner"
      >
        <Search className="w-4 h-4 text-indigo-400 shrink-0" />
        <span className="truncate">Search modules, formulas, topics...</span>
        <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-slate-300 rounded border border-slate-700">
          ⌘K
        </kbd>
      </button>

      {/* Target & Exam Pill */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
        <Target className="w-3.5 h-3.5 text-indigo-400" />
        <span>Target: Class 12 CBSE + JEE 2026</span>
      </div>

      {/* Right Controls: Pomodoro + AI Tutor + Profile */}
      <div className="flex items-center gap-3">
        {/* Pomodoro Live Timer Widget */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-sm">
            <Timer className="w-4 h-4 animate-pulse text-emerald-400" />
            <span>{timeFormatted}</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-800" />

          <button
            onClick={isRunning ? pauseTimer : startTimer}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title={isRunning ? 'Pause Pomodoro' : 'Start Pomodoro'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={resetTimer}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* AI Tutor Toggle Drawer Button */}
        <button
          onClick={toggleAIDrawer}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium text-xs transition-all shadow-md ${
            isAIDrawerOpen
              ? 'bg-cyan-500 text-slate-950 shadow-cyan-500/25 font-semibold'
              : 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/40'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span className="hidden sm:inline">AI Tutor</span>
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-indigo-500/30 shadow-md">
            {user?.displayName?.slice(0, 2).toUpperCase() || 'JA'}
          </div>
        </div>
      </div>
    </header>
  );
};
