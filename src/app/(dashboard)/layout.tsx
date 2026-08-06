'use client';

import React, { useState } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { PomodoroProvider } from '@/contexts/pomodoro-context';
import { AIDrawerProvider } from '@/contexts/ai-drawer-context';
import { SyllabusProvider } from '@/contexts/syllabus-context';
import { Sidebar } from '@/components/common/sidebar';
import { TopNav } from '@/components/common/top-nav';
import { CommandPalette } from '@/components/common/command-palette';
import { AIDrawer } from '@/components/features/ai-tutor/ai-drawer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <AuthProvider>
      <SyllabusProvider>
        <PomodoroProvider>
          <AIDrawerProvider>
          <div className="flex h-screen w-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] antialiased">
            {/* Sidebar Rail */}
            <Sidebar />

            {/* Main Stage Content Area */}
            <div className="flex flex-col flex-1 h-screen overflow-hidden">
              <TopNav onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
              
              <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-b from-[#090d16] via-[#0d1320] to-[#090d16]">
                {children}
              </main>
            </div>

            {/* Global Overlay Drawers & Modals */}
            <CommandPalette
              isOpen={isCommandPaletteOpen}
              onClose={() => setIsCommandPaletteOpen(false)}
            />
            <AIDrawer />
          </div>
        </AIDrawerProvider>
      </PomodoroProvider>
    </SyllabusProvider>
  </AuthProvider>
);
}
