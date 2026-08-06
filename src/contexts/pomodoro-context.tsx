'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

const MODE_DURATIONS: Record<PomodoroMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

interface PomodoroContextType {
  mode: PomodoroMode;
  secondsLeft: number;
  isRunning: boolean;
  completedSessions: number;
  activeTaskTitle?: string;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setMode: (mode: PomodoroMode) => void;
  setActiveTask: (title?: string) => void;
}

const PomodoroContext = createContext<PomodoroContextType>({
  mode: 'focus',
  secondsLeft: MODE_DURATIONS.focus,
  isRunning: false,
  completedSessions: 3,
  startTimer: () => {},
  pauseTimer: () => {},
  resetTimer: () => {},
  setMode: () => {},
  setActiveTask: () => {},
});

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<PomodoroMode>('focus');
  const [secondsLeft, setSecondsLeft] = useState<number>(MODE_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(3);
  const [activeTaskTitle, setActiveTaskTitle] = useState<string | undefined>('Electrostatics DPQ');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            if (mode === 'focus') {
              setCompletedSessions((s) => s + 1);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(MODE_DURATIONS[mode]);
  };

  const setMode = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setModeState(newMode);
    setSecondsLeft(MODE_DURATIONS[newMode]);
  };

  const setActiveTask = (title?: string) => {
    setActiveTaskTitle(title);
  };

  return (
    <PomodoroContext.Provider
      value={{
        mode,
        secondsLeft,
        isRunning,
        completedSessions,
        activeTaskTitle,
        startTimer,
        pauseTimer,
        resetTimer,
        setMode,
        setActiveTask,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => useContext(PomodoroContext);
