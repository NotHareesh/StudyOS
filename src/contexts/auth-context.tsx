'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, TargetExam } from '@/types';
import { auth, googleProvider } from '@/lib/firebase/client';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUsername: (name: string) => void;
  updateGoalHours: (hours: number) => void;
  updateTargetExams: (exams: TargetExam[]) => void;
}

const DEFAULT_USER: UserProfile = {
  uid: 'user_default',
  displayName: 'Aspirant',
  email: 'aspirant@studyos.ai',
  dailyGoalHours: 6,
  streakCount: 7,
  targetExams: ['CBSE_12', 'JEE_MAIN', 'JEE_ADVANCED'],
  targetExamYear: 2026,
  lastActiveDate: '2026-08-06',
  totalStudySeconds: 0,
};

const STORAGE_KEY = 'studyos_user_profile';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Load local stored profile
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }

    // Subscribe to Firebase Auth state
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setIsAuthenticated(true);
          setUser((prev) => ({
            ...prev,
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Aspirant',
            email: firebaseUser.email || prev.email,
          }));
        } else {
          setIsAuthenticated(false);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const saveUser = (updated: UserProfile) => {
    setUser(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const signInWithGoogle = async () => {
    if (auth && googleProvider) {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (err) {
        console.error('Firebase Auth Sign In error:', err);
      }
    } else {
      alert('Firebase Auth config not initialized. Operating in local guest mode.');
    }
  };

  const signOut = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error(e);
      }
    }
    setIsAuthenticated(false);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signInWithGoogle,
        signOut,
        updateUsername,
        updateGoalHours,
        updateTargetExams,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
