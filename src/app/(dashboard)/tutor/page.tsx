'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Send, Sparkles, Plus, Trash2, MessageSquare, RefreshCw, Layers } from 'lucide-react';
import { LaTeXRenderer } from '@/components/common/latex-renderer';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

const STORAGE_KEY = 'studyos_ai_tutor_sessions';

export default function AITutorPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load chat sessions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: ChatSession[] = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) setActiveSessionId(parsed[0].id);
        else createNewSession();
      } else {
        createNewSession();
      }
    } catch (e) {
      console.error('Failed to load tutor sessions:', e);
      createNewSession();
    }
  }, []);

  const saveSessions = (updated: ChatSession[]) => {
    setSessions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save tutor sessions:', e);
    }
  };

  const createNewSession = () => {
    const newSess: ChatSession = {
      id: 'session_' + Date.now(),
      title: 'New Study Conversation',
      createdAt: new Date().toLocaleDateString(),
      messages: [
        {
          id: '1',
          role: 'model',
          text: 'Welcome to your full-screen Gemini AI Tutor workspace! I remember our chat context and render all mathematical formulas using KaTeX typesetting (e.g. $E = mc^2$ or $$\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q}{\\epsilon_0}$$). How can I assist your study today?',
        },
      ],
    };

    const updated = [newSess, ...sessions];
    saveSessions(updated);
    setActiveSessionId(newSess.id);
  };

  const deleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    saveSessions(updated);
    if (activeSessionId === id && updated.length > 0) {
      setActiveSessionId(updated[0].id);
    } else if (updated.length === 0) {
      createNewSession();
    }
  };

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  const handleSend = async (overrideText?: string) => {
    const prompt = overrideText || input;
    if (!prompt.trim() || isGenerating || !activeSession) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: prompt,
    };

    const updatedMessages = [...activeSession.messages, userMsg];

    // Generate auto-title from first user question if title is default
    const updatedTitle =
      activeSession.title === 'New Study Conversation'
        ? prompt.slice(0, 30) + '...'
        : activeSession.title;

    const updatedSessions = sessions.map(s =>
      s.id === activeSession.id ? { ...s, title: updatedTitle, messages: updatedMessages } : s
    );

    saveSessions(updatedSessions);
    if (!overrideText) setInput('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history: updatedMessages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const modelMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: data.response,
        };

        const finalSessions = sessions.map(s =>
          s.id === activeSession.id ? { ...s, title: updatedTitle, messages: [...updatedMessages, modelMsg] } : s
        );
        saveSessions(finalSessions);
      } else {
        const fallbackMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: `Here is a step-by-step breakdown for "${prompt}": Verify your sign conventions and basic laws first!`,
        };
        const finalSessions = sessions.map(s =>
          s.id === activeSession.id ? { ...s, title: updatedTitle, messages: [...updatedMessages, fallbackMsg] } : s
        );
        saveSessions(finalSessions);
      }
    } catch {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Network response delayed. Please check your connection.',
      };
      const finalSessions = sessions.map(s =>
        s.id === activeSession.id ? { ...s, title: updatedTitle, messages: [...updatedMessages, errMsg] } : s
      );
      saveSessions(finalSessions);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex gap-6 pb-6">
      {/* Left Conversations Sidebar */}
      <div className="w-72 glass-card rounded-3xl border border-slate-800 p-4 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chat History</span>
            <button
              onClick={createNewSession}
              className="p-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </div>

          <div className="space-y-1.5">
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`p-3 rounded-2xl text-xs font-medium border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  activeSessionId === s.id
                    ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{s.title}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(s.id);
                  }}
                  className="p-1 text-slate-600 hover:text-rose-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 glass-card rounded-3xl border border-cyan-500/20 p-6 flex flex-col space-y-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                {activeSession?.title || 'Gemini AI Tutor Workspace'}
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-cyan-500/20 text-cyan-300">
                  Memory & KaTeX
                </span>
              </h1>
              <p className="text-slate-400 text-xs">
                Context-remembering tutor with LaTeX formula rendering.
              </p>
            </div>
          </div>

          <button
            onClick={createNewSession}
            className="md:hidden px-3 py-1.5 rounded-xl bg-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> New Chat
          </button>
        </div>

        {/* Messages Stream with KaTeX math rendering */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {activeSession?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-inner'
                }`}
              >
                <LaTeXRenderer content={msg.text} />
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 p-3 bg-slate-900/60 rounded-xl border border-slate-800 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Gemini is remembering past context & typesetting KaTeX formulas...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3 shrink-0 pt-2 border-t border-slate-800"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question, request a derivation, or solve a JEE Advanced problem..."
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20 text-xs flex items-center gap-2"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
