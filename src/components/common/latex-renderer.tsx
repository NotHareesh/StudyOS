'use client';

import React from 'react';
import katex from 'katex';

interface LaTeXRendererProps {
  content: string;
  className?: string;
}

export const LaTeXRenderer: React.FC<LaTeXRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Function to render text with KaTeX formulas
  const renderFormattedContent = (text: string) => {
    // Split by block math $$ ... $$
    const blockParts = text.split(/\$\$([\s\S]*?)\$\$/g);

    return blockParts.map((blockChunk, blockIdx) => {
      // Odd indices in blockParts were enclosed in $$ ... $$
      if (blockIdx % 2 === 1) {
        try {
          const html = katex.renderToString(blockChunk.trim(), {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <div
              key={`block-${blockIdx}`}
              className="my-2.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <pre key={`block-err-${blockIdx}`} className="font-mono text-amber-400">{blockChunk}</pre>;
        }
      }

      // Even indices are text containing possible inline math $ ... $
      const inlineParts = blockChunk.split(/\$(.*?)\$/g);

      return (
        <span key={`inline-group-${blockIdx}`}>
          {inlineParts.map((inlineChunk, inlineIdx) => {
            if (inlineIdx % 2 === 1) {
              try {
                const html = katex.renderToString(inlineChunk.trim(), {
                  displayMode: false,
                  throwOnError: false,
                });
                return (
                  <span
                    key={`inline-${inlineIdx}`}
                    className="inline-block px-1"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              } catch (e) {
                return <code key={`inline-err-${inlineIdx}`} className="font-mono text-amber-400">{inlineChunk}</code>;
              }
            }
            return <span key={`text-${inlineIdx}`}>{inlineChunk}</span>;
          })}
        </span>
      );
    });
  };

  return <div className={`whitespace-pre-wrap ${className}`}>{renderFormattedContent(content)}</div>;
};
