'use client';

import React, { useState } from 'react';
import { Sparkles, X, ChevronRight } from 'lucide-react';
import { LaTeXRenderer } from '@/components/common/latex-renderer';

interface FlashcardQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_FLASHCARDS = [
  {
    front: 'What is Gauss\'s Law formula for Electric Flux?',
    back: '$$\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{enclosed}}{\\epsilon_0}$$ The net electric flux through any closed surface equals net charge enclosed divided by $\\epsilon_0$.',
  },
  {
    front: 'Define Isomerism in Coordination Compounds [Ma2b2c2].',
    back: 'Occurs in octahedral complexes with 3 pairs of identical ligands. Shows geometric (cis/trans) and optical isomerism.',
  },
  {
    front: 'Property 4 of Definite Integrals:',
    back: '$$\\int_{a}^{b} f(x) dx = \\int_{a}^{b} f(a+b-x) dx$$ Crucial for JEE Main problems involving symmetric bounds.',
  },
];

export const FlashcardQuizModal: React.FC<FlashcardQuizModalProps> = ({ isOpen, onClose }) => {
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-card rounded-3xl border border-cyan-500/40 bg-[#0d1424] p-6 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white">AI Revision Flashcards ({flashcardIndex + 1} / {INITIAL_FLASHCARDS.length})</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close quiz modal"
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Flashcard Surface */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setIsFlipped(!isFlipped);
          }}
          className="w-full h-64 p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex flex-col items-center justify-center text-center transition-all select-none shadow-inner relative group"
        >
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider mb-2">
            {isFlipped ? 'Answer (Click to Flip)' : 'Question (Click to Reveal Answer)'}
          </span>
          
          <LaTeXRenderer
            content={isFlipped ? INITIAL_FLASHCARDS[flashcardIndex].back : INITIAL_FLASHCARDS[flashcardIndex].front}
            className="text-sm font-semibold text-slate-100 max-w-md"
          />

          <div className="absolute bottom-3 right-4 text-[10px] text-slate-500 group-hover:text-cyan-400">
            Click to flip 🔄
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            disabled={flashcardIndex === 0}
            onClick={() => {
              setIsFlipped(false);
              setFlashcardIndex(prev => prev - 1);
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 disabled:opacity-40"
          >
            Previous Card
          </button>

          <button
            onClick={() => {
              setIsFlipped(false);
              setFlashcardIndex(prev => (prev + 1) % INITIAL_FLASHCARDS.length);
            }}
            className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
          >
            Next Flashcard <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
