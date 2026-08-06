'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Plus,
  Play,
  CheckCircle2,
  Circle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Bot,
  Trash2
} from 'lucide-react';
import { SubjectBadge } from '@/components/common/subject-badge';
import { usePomodoro } from '@/contexts/pomodoro-context';
import { useAIDrawer } from '@/contexts/ai-drawer-context';
import { syncTaskToGoogleTasks } from '@/lib/google/tasks';
import { StorageService } from '@/services/storage';
import { AddTaskModal } from '@/components/features/planner/add-task-modal';

export interface PlannerTask {
  id: string;
  title: string;
  subjectId: 'physics' | 'chemistry' | 'maths';
  time: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  pomodoros: number;
}

const INITIAL_TASKS: PlannerTask[] = [
  { id: '1', title: 'Electrostatics: Solve 15 PYQs from 2024 JEE Main', subjectId: 'physics', time: '08:30 - 10:00', status: 'pending', priority: 'high', pomodoros: 2 },
  { id: '2', title: 'Organic Mechanisms: Review Aldehydes & Ketones', subjectId: 'chemistry', time: '10:30 - 12:00', status: 'completed', priority: 'high', pomodoros: 3 },
  { id: '3', title: 'Definite Integrals: Property 4 & 5 Practice', subjectId: 'maths', time: '14:00 - 16:00', status: 'pending', priority: 'medium', pomodoros: 1 },
];

export default function DailyPlannerPage() {
  const { startTimer, setActiveTask } = usePomodoro();
  const { openAIDrawer } = useAIDrawer();

  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const loaded = StorageService.getTasks();
    if (loaded.length > 0) setTasks(loaded);
    else {
      setTasks(INITIAL_TASKS);
      StorageService.saveTasks(INITIAL_TASKS);
    }
  }, []);

  const saveTasks = (updated: PlannerTask[]) => {
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const toggleTask = (id: string) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));
  };

  const handleDeleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  const handleAddTask = (newTask: PlannerTask) => {
    saveTasks([...tasks, newTask]);
  };

  const handleStartFocus = (taskTitleStr: string) => {
    setActiveTask(taskTitleStr);
    startTimer();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-indigo-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <CalendarCheck className="w-3.5 h-3.5" /> Module 2 &bull; Time-Blocking Planner
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Daily Study Planner
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Organize time blocks, track Pomodoros, and execute high-priority CBSE & JEE prep tasks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              const res = await syncTaskToGoogleTasks('StudyOS Tasks Sync');
              alert(res.message);
            }}
            aria-label="Sync with Google Tasks"
            className="px-3.5 py-2.5 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-semibold hover:bg-blue-900/60 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-blue-400" /> Sync Google Tasks
          </button>
          <button
            onClick={() => openAIDrawer('general', 'AI Schedule Optimization', 'Optimize my daily study plan for JEE Main & CBSE 12.')}
            aria-label="AI Optimize Schedule"
            className="px-4 py-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/60 flex items-center gap-2"
          >
            <Bot className="w-4 h-4" /> AI Optimize Schedule
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            aria-label="Add Task Block"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Task Block
          </button>
        </div>
      </div>

      {/* Extracted Add Task Modal Component */}
      <AddTaskModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* Date Selector Strip */}
      <div className="flex items-center justify-between p-4 glass-card rounded-2xl border border-slate-800 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <button aria-label="Previous Day" className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-slate-200 font-mono">Today, Aug 6, 2026</span>
          <button aria-label="Next Day" className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>Completed: <strong className="text-emerald-400">{tasks.filter(t => t.status === 'completed').length} / {tasks.length}</strong></span>
        </div>
      </div>

      {/* Time Blocks & Task Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Today's Time-Blocked Tasks ({tasks.length})
          </h2>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                role="article"
                className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  task.status === 'completed'
                    ? 'bg-slate-900/30 border-slate-800/60 opacity-60'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <button
                    onClick={() => toggleTask(task.id)}
                    aria-label={`Mark ${task.title} as ${task.status === 'completed' ? 'incomplete' : 'complete'}`}
                    className="mt-0.5 text-slate-400 hover:text-indigo-400"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <p className={`text-sm font-semibold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                      {task.title}
                    </p>

                    <div className="flex items-center gap-2.5 text-xs text-slate-400">
                      <SubjectBadge subjectId={task.subjectId} />
                      <span className="font-mono text-indigo-300">{task.time}</span>
                      <span>&bull; {task.pomodoros} Pomodoro sessions</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => handleStartFocus(task.title)}
                      aria-label={`Start Pomodoro timer for ${task.title}`}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-semibold text-xs flex items-center gap-1.5 shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-emerald-400" /> Focus
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    aria-label={`Delete task ${task.title}`}
                    className="p-2 text-slate-600 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Pomodoro Summary */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" /> Pomodoro Statistics
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Completed Sessions</span>
                <span className="font-mono font-bold text-emerald-400">3 Sessions (75m)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Daily Focus Goal</span>
                <span className="font-mono font-bold text-indigo-400">6 Sessions (150m)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
