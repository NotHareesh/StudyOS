'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TopicStatus } from '@/types/syllabus';

export interface TopicItem {
  id: string;
  name: string;
  status: TopicStatus;
}

export interface ChapterItem {
  id: string;
  name: string;
  cbseWeightage: number;
  jeeMainWeightage: number;
  jeeAdvWeightage: number;
  topics: TopicItem[];
}

export interface SubjectItem {
  id: string;
  name: string;
  color: string;
  chapters: ChapterItem[];
}

interface SyllabusContextType {
  subjects: SubjectItem[];
  addSubject: (name: string, color?: string) => void;
  editSubject: (id: string, name: string, color: string) => void;
  deleteSubject: (id: string) => void;
  addChapter: (subjectId: string, name: string, cbse?: number, jeeMain?: number, jeeAdv?: number) => void;
  editChapter: (subjectId: string, chapterId: string, name: string, cbse: number, jeeMain: number, jeeAdv: number) => void;
  deleteChapter: (subjectId: string, chapterId: string) => void;
  addTopic: (subjectId: string, chapterId: string, name: string, status?: TopicStatus) => void;
  editTopic: (subjectId: string, chapterId: string, topicId: string, name: string, status: TopicStatus) => void;
  deleteTopic: (subjectId: string, chapterId: string, topicId: string) => void;
  cycleTopicStatus: (subjectId: string, chapterId: string, topicId: string) => void;
  getOverallMastery: () => number;
}

const SyllabusContext = createContext<SyllabusContextType>({
  subjects: [],
  addSubject: () => {},
  editSubject: () => {},
  deleteSubject: () => {},
  addChapter: () => {},
  editChapter: () => {},
  deleteChapter: () => {},
  addTopic: () => {},
  editTopic: () => {},
  deleteTopic: () => {},
  cycleTopicStatus: () => {},
  getOverallMastery: () => 0,
});

const STORAGE_KEY = 'studyos_syllabus_data';

export const SyllabusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSubjects(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load syllabus from storage:', e);
    } finally {
      setLoaded(true);
    }
  }, []);

  const saveSubjects = (updated: SubjectItem[]) => {
    setSubjects(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save syllabus to storage:', e);
    }
  };

  const addSubject = (name: string, color = '#6366f1') => {
    const newSubject: SubjectItem = {
      id: 'sub_' + Date.now(),
      name,
      color,
      chapters: [],
    };
    saveSubjects([...subjects, newSubject]);
  };

  const editSubject = (id: string, name: string, color: string) => {
    saveSubjects(subjects.map(s => s.id === id ? { ...s, name, color } : s));
  };

  const deleteSubject = (id: string) => {
    saveSubjects(subjects.filter(s => s.id !== id));
  };

  const addChapter = (subjectId: string, name: string, cbse = 0, jeeMain = 0, jeeAdv = 0) => {
    const newChap: ChapterItem = {
      id: 'chap_' + Date.now(),
      name,
      cbseWeightage: cbse,
      jeeMainWeightage: jeeMain,
      jeeAdvWeightage: jeeAdv,
      topics: [],
    };

    saveSubjects(
      subjects.map(sub => {
        if (sub.id === subjectId) {
          return { ...sub, chapters: [...sub.chapters, newChap] };
        }
        return sub;
      })
    );
  };

  const editChapter = (subjectId: string, chapterId: string, name: string, cbse: number, jeeMain: number, jeeAdv: number) => {
    saveSubjects(
      subjects.map(sub => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            chapters: sub.chapters.map(c =>
              c.id === chapterId
                ? { ...c, name, cbseWeightage: cbse, jeeMainWeightage: jeeMain, jeeAdvWeightage: jeeAdv }
                : c
            ),
          };
        }
        return sub;
      })
    );
  };

  const deleteChapter = (subjectId: string, chapterId: string) => {
    saveSubjects(
      subjects.map(sub => {
        if (sub.id === subjectId) {
          return { ...sub, chapters: sub.chapters.filter(c => c.id !== chapterId) };
        }
        return sub;
      })
    );
  };

  const addTopic = (subjectId: string, chapterId: string, name: string, status: TopicStatus = 'not_started') => {
    const newTopic: TopicItem = {
      id: 'top_' + Date.now(),
      name,
      status,
    };

    saveSubjects(
      subjects.map(sub => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            chapters: sub.chapters.map(chap => {
              if (chap.id === chapterId) {
                return { ...chap, topics: [...chap.topics, newTopic] };
              }
              return chap;
            }),
          };
        }
        return sub;
      })
    );
  };

  const editTopic = (subjectId: string, chapterId: string, topicId: string, name: string, status: TopicStatus) => {
    saveSubjects(
      subjects.map(sub => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            chapters: sub.chapters.map(chap => {
              if (chap.id === chapterId) {
                return {
                  ...chap,
                  topics: chap.topics.map(t => (t.id === topicId ? { ...t, name, status } : t)),
                };
              }
              return chap;
            }),
          };
        }
        return sub;
      })
    );
  };

  const deleteTopic = (subjectId: string, chapterId: string, topicId: string) => {
    saveSubjects(
      subjects.map(sub => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            chapters: sub.chapters.map(chap => {
              if (chap.id === chapterId) {
                return { ...chap, topics: chap.topics.filter(t => t.id !== topicId) };
              }
              return chap;
            }),
          };
        }
        return sub;
      })
    );
  };

  const cycleTopicStatus = (subjectId: string, chapterId: string, topicId: string) => {
    const statusOrder: TopicStatus[] = ['not_started', 'learning', 'practiced', 'revised', 'mastered'];

    saveSubjects(
      subjects.map(sub => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            chapters: sub.chapters.map(chap => {
              if (chap.id === chapterId) {
                return {
                  ...chap,
                  topics: chap.topics.map(t => {
                    if (t.id === topicId) {
                      const nextIdx = (statusOrder.indexOf(t.status) + 1) % statusOrder.length;
                      return { ...t, status: statusOrder[nextIdx] };
                    }
                    return t;
                  }),
                };
              }
              return chap;
            }),
          };
        }
        return sub;
      })
    );
  };

  const getOverallMastery = () => {
    let totalTopics = 0;
    let masteredTopics = 0;

    subjects.forEach(sub => {
      sub.chapters.forEach(chap => {
        chap.topics.forEach(top => {
          totalTopics++;
          if (top.status === 'mastered') masteredTopics += 1;
          else if (top.status === 'revised') masteredTopics += 0.8;
          else if (top.status === 'practiced') masteredTopics += 0.5;
          else if (top.status === 'learning') masteredTopics += 0.2;
        });
      });
    });

    if (totalTopics === 0) return 0;
    return Math.round((masteredTopics / totalTopics) * 100);
  };

  return (
    <SyllabusContext.Provider
      value={{
        subjects,
        addSubject,
        editSubject,
        deleteSubject,
        addChapter,
        editChapter,
        deleteChapter,
        addTopic,
        editTopic,
        deleteTopic,
        cycleTopicStatus,
        getOverallMastery,
      }}
    >
      {children}
    </SyllabusContext.Provider>
  );
};

export const useSyllabus = () => useContext(SyllabusContext);
