'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, TargetExam } from '@/types';

interface AuthContextType {
  user: UserProfile;
  loading: boolean;
  updateUsername: (name: string) => void;
  updateGoalHours: (hours: number) => void;
  updateTargetExams: (exams: TargetExam[]) => void;
  incrementStreak: () => void;
}

const DEFAULT_USER: UserProfile = {
  uid: 'single-user-studyos',
  displayName: 'Aspirant',
  email: 'aspirant@studyos.ai',
  targetExams: ['CBSE_12', 'JEE_MAIN', 'JEE_ADVANCED'],
  targetExamYear: 2026,
  dailyGoalHours: 6,
  streakCount: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalStudySeconds: 0,
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USER,
  loading: false,
  updateUsername: () => {},
  updateGoalHours: () => {},
  updateTargetExams: () => {},
  incrementStreak: () => {},
});

const STORAGE_KEY = 'studyos_user_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [loading, setLoading] = useState(true);

  // Load profile from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load profile from localStorage:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist profile to localStorage on change
  const saveUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.error('Failed to save profile to localStorage:', e);
    }
  };

  const updateUsername = (name: string) => {
    saveUser({ ...user, displayName: name });
  };

  const updateGoalHours = (hours: number) => {
    saveUser({ ...user, dailyGoalHours: hours });
  };

  const updateTargetExams = (exams: TargetExam[]) => {
    saveUser({ ...user, targetExams: exams });
  };

  const incrementStreak = () => {
    saveUser({ ...user, streakCount: user.streakCount + 1 });
  };

  return (
    <AuthContext.Provider value={{ user, loading, updateUsername, updateGoalHours, updateTargetExams, incrementStreak }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
