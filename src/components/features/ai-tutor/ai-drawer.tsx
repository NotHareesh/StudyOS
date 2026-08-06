'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, BookOpen, HelpCircle, RefreshCw, Trash2, Plus } from 'lucide-react';
import { useAIDrawer } from '@/contexts/ai-drawer-context';
import { LaTeXRenderer } from '@/components/common/latex-renderer';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const STORAGE_KEY = 'studyos_ai_drawer_history';

export const AIDrawer: React.FC = () => {
  const { isOpen, closeAIDrawer, contextType, contextTitle } = useAIDrawer();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages([
          {
            id: '1',
            role: 'model',
            text: 'Hello Aspirant! I am your StudyOS AI Tutor. Ask me any Class 12 CBSE derivation or JEE Main/Advanced problem! I support full LaTeX math rendering e.g. $\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q}{\\epsilon_0}$.',
          },
        ]);
      }
    } catch (e) {
      console.error('Failed to load AI drawer chat history:', e);
    }
  }, []);

  // Save messages to localStorage
  const saveMessages = (updated: ChatMessage[]) => {
    setMessages(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save AI drawer chat history:', e);
    }
  };

  const handleClearHistory = () => {
    const initial: ChatMessage[] = [
      {
        id: '1',
        role: 'model',
        text: 'Chat history cleared. How can I help you master your concepts today?',
      },
    ];
    saveMessages(initial);
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
    };

    const newHistory = [...messages, userMsg];
    saveMessages(newHistory);
    if (!overrideText) setInput('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          history: newHistory,
          contextType,
          contextTitle,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const modelMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: data.response,
        };
        saveMessages([...newHistory, modelMsg]);
      } else {
        const fallbackMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: `Here is a step-by-step breakdown for "${textToSend}": Always check unit consistency and vector sign conventions!`,
        };
        saveMessages([...newHistory, fallbackMsg]);
      }
    } catch (err) {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Unable to reach AI service. Please check your internet connection.',
      };
      saveMessages([...newHistory, errMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={closeAIDrawer}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] glass-panel border-l border-slate-700/80 bg-[#0b1320] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    Gemini AI Tutor
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-cyan-500/20 text-cyan-300">
                      Memory & LaTeX Enabled
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate max-w-[240px]">
                    {contextTitle ? `Active: ${contextTitle}` : 'CBSE 12 & JEE Master Assistant'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearHistory}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                  title="Clear Chat Memory"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={closeAIDrawer}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Action Chips */}
            <div className="p-3 border-b border-slate-800/60 bg-slate-900/30 flex items-center gap-2 overflow-x-auto text-xs">
              <button
                onClick={() => handleSend('Explain electric field due to dipole on axial line with derivation')}
                className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/60 shrink-0 flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" /> Dipole Derivation
              </button>
              <button
                onClick={() => handleSend('Generate 3 JEE Advanced Physics MCQs with LaTeX solutions')}
                className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:bg-purple-900/60 shrink-0 flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" /> 3 JEE MCQs
              </button>
            </div>

            {/* Message History Stream with KaTeX */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
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
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Gemini is remembering conversation history & formatting KaTeX response...</span>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-900/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question or request LaTeX derivation..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isGenerating}
                  className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-md shadow-cyan-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
