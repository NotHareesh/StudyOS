'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
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
  ChevronLeft,
  ChevronRight,
  Flame,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/contexts/auth-context';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Daily Planner', href: '/planner', icon: CalendarCheck },
  { name: 'Syllabus Tracker', href: '/syllabus', icon: BookOpen },
  { name: 'Revision Engine', href: '/revision', icon: RotateCcw, badge: '4' },
  { name: 'Mock Test Analytics', href: '/mock-tests', icon: BarChart3 },
  { name: 'PDF Reader', href: '/reader', icon: FileText },
  { name: 'AI Tutor', href: '/tutor', icon: Bot },
  { name: 'Analytics', href: '/analytics', icon: LineChart },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 256 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen glass-panel border-r border-[var(--border-subtle)] bg-[#0c121e]/90 text-slate-200 z-30 select-none shrink-0"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border-subtle)]">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 text-white font-bold shadow-lg shadow-indigo-500/25 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white font-mono">
                Study<span className="text-indigo-400">OS</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                CBSE 12 &bull; JEE
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle Sidebar"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Streak Badge */}
      {!collapsed && (
        <div className="mx-3 mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Flame className="w-5 h-5 fill-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300">
                {user?.streakCount || 14} Day Streak!
              </div>
              <div className="text-[10px] text-slate-400">Keep the momentum going</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-md shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              )}
            >
              <Icon className={cn('w-5 h-5 shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200')} />
              {!collapsed && (
                <span className="truncate flex-1">{item.name}</span>
              )}
              {!collapsed && item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Settings Link */}
      <div className="p-3 border-t border-[var(--border-subtle)]">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-slate-400 hover:text-white hover:bg-white/5',
            pathname === '/settings' && 'bg-white/10 text-white'
          )}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </motion.aside>
  );
};
