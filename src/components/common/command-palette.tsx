'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  RotateCcw,
  Sigma,
  AlertCircle,
  BarChart3,
  FileText,
  Bot,
  LineChart,
  Settings,
  Search,
  Zap,
  Plus
} from 'lucide-react';
import { useAIDrawer } from '@/contexts/ai-drawer-context';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { openAIDrawer } = useAIDrawer();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl glass-card rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden bg-[#0e1626]">
        <Command className="w-full bg-transparent text-slate-200">
          <div className="flex items-center px-4 border-b border-slate-800">
            <Search className="w-4 h-4 text-indigo-400 mr-3 shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Type a command or search modules..."
              className="w-full py-3.5 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1">
            <Command.Empty className="py-6 text-center text-xs text-slate-400">
              No matching modules or commands found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="text-[10px] font-bold text-slate-500 uppercase px-3 py-1">
              <Command.Item
                onSelect={() => navigateTo('/')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-600/20 hover:text-indigo-200 cursor-pointer transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span>Dashboard</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo('/planner')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-600/20 hover:text-indigo-200 cursor-pointer transition-colors"
              >
                <CalendarCheck className="w-4 h-4 text-indigo-400" />
                <span>Daily Planner</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo('/syllabus')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-600/20 hover:text-indigo-200 cursor-pointer transition-colors"
              >
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Syllabus Tracker</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo('/revision')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-600/20 hover:text-indigo-200 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-indigo-400" />
                <span>Revision Engine</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo('/mock-tests')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-600/20 hover:text-indigo-200 cursor-pointer transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Mock Test Analytics</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo('/reader')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-600/20 hover:text-indigo-200 cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>PDF Reader</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Quick Actions" className="text-[10px] font-bold text-slate-500 uppercase px-3 py-1 mt-2">
              <Command.Item
                onSelect={() => {
                  onClose();
                  openAIDrawer('general', 'Quick Assistant');
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-cyan-600/20 hover:text-cyan-200 cursor-pointer transition-colors"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Ask Gemini AI Tutor</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/50 flex items-center justify-between text-[11px] text-slate-400">
            <span>Press <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-slate-300">ESC</kbd> to close</span>
            <span>Use ↑ ↓ keys to navigate</span>
          </div>
        </Command>
      </div>
    </div>
  );
};
