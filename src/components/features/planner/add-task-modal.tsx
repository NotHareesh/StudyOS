'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PlannerTask } from '@/app/(dashboard)/planner/page';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: PlannerTask) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [subjectId, setSubjectId] = useState<'physics' | 'chemistry' | 'maths'>('physics');
  const [timeBlock, setTimeBlock] = useState('09:00 - 10:30');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [pomodoros, setPomodoros] = useState(2);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask: PlannerTask = {
      id: 'task_' + Date.now(),
      title: taskTitle.trim(),
      subjectId,
      time: timeBlock,
      status: 'pending',
      priority,
      pomodoros: Number(pomodoros),
    };

    onAddTask(newTask);
    setTaskTitle('');
    onClose();
  };

  return (
    <div className="p-6 rounded-3xl glass-card border border-indigo-500/40 bg-slate-900/95 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-white">Create New Study Task Block</h3>
        <button
          onClick={onClose}
          aria-label="Close add task modal"
          className="text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Task title (e.g. Electrostatics 15 PYQs)..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value as 'physics' | 'chemistry' | 'maths')}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            >
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="maths">Mathematics</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Time Block</label>
            <input
              type="text"
              value={timeBlock}
              onChange={(e) => setTimeBlock(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
        >
          Save Study Task
        </button>
      </form>
    </div>
  );
};
