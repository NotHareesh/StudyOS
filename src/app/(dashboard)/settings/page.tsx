'use client';

import React, { useState } from 'react';
import { Settings, Target, User, Save, Check, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { TargetExam } from '@/types';
import { requestGoogleAccessToken } from '@/lib/google/auth';

export default function SettingsPage() {
  const { user, updateUsername, updateGoalHours, updateTargetExams } = useAuth();
  
  const [username, setUsername] = useState(user.displayName || 'Aspirant');
  const [goalHours, setGoalHours] = useState(user.dailyGoalHours || 6);
  const [selectedExams, setSelectedExams] = useState<TargetExam[]>(user.targetExams || ['CBSE_12', 'JEE_MAIN', 'JEE_ADVANCED']);
  const [saved, setSaved] = useState(false);

  const toggleExam = (exam: TargetExam) => {
    if (selectedExams.includes(exam)) {
      if (selectedExams.length === 1) return; // Keep at least 1
      setSelectedExams(selectedExams.filter(e => e !== exam));
    } else {
      setSelectedExams([...selectedExams, exam]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      updateUsername(username.trim());
    }
    updateGoalHours(goalHours);
    updateTargetExams(selectedExams);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between glass-card p-6 rounded-3xl border border-indigo-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5" /> Single-User Profile & App Settings
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Account & Target Settings
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Personalize your username, study targets, daily goal hours, and target exams.
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Username */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" /> User Profile Name
          </h2>
          <div className="space-y-2">
            <label className="text-xs text-slate-400 block font-medium">Display Name / Aspirant Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full max-w-md px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white font-semibold text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Target Exams */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" /> Target Examination Focus
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
            {[
              { id: 'CBSE_12' as TargetExam, label: 'Class 12 CBSE Board' },
              { id: 'JEE_MAIN' as TargetExam, label: 'JEE Main 2026' },
              { id: 'JEE_ADVANCED' as TargetExam, label: 'JEE Advanced 2026' },
            ].map((item) => {
              const isSelected = selectedExams.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleExam(item.id)}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-600/10 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Google Workspace Integrations */}
        <div className="p-6 rounded-3xl glass-card border border-blue-500/30 space-y-4 bg-blue-950/20">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" /> Google Workspace Integrations
            </h2>
            <button
              type="button"
              onClick={() => {
                requestGoogleAccessToken(
                  (token) => alert('Google OAuth Token Authorized! Tasks, Calendar, and Drive are now connected.'),
                  (err) => alert('OAuth Popup Triggered: Make sure popups are allowed for localhost.')
                );
              }}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
            >
              Authorize Google Account 🔑
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Automatically link your StudyOS tasks, revision schedules, and uploaded PDFs with your Google account.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-blue-400">
                <span>Google Tasks</span>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400">Syncs Daily Planner to Google Tasks app</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                <span>Google Calendar</span>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400">Syncs time blocks & test dates to GCal</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
                <span>Google Drive</span>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400">Syncs uploaded PDFs & test papers</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-colors"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Saved Successfully!' : 'Save Profile Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
