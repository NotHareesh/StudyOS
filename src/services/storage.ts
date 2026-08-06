import { PlannerTask } from '@/app/(dashboard)/planner/page';
import { RevisionTopic } from '@/app/(dashboard)/revision/page';

export interface TestRecord {
  id: string;
  testName: string;
  testType: string;
  totalQuestions: number;
  correctQuestions: number;
  wrongQuestions: number;
  unattemptedQuestions: number;
  scoredMarks: number;
  totalPossibleMarks: number;
  accuracyPercentage: number;
  questionPaperName?: string;
  questionPaperUrl?: string;
  solutionName?: string;
  solutionUrl?: string;
  dateLogged: string;
}

export interface PDFDoc {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  notes: string;
  fileDataUrl: string;
}

const KEYS = {
  PLANNER: 'studyos_planner_tasks',
  REVISION: 'studyos_revision_queue',
  TESTS: 'studyos_test_records',
  PDFS: 'studyos_pdf_documents',
  AI_DRAWER: 'studyos_ai_drawer_history',
  AI_SESSIONS: 'studyos_ai_tutor_sessions',
};

export const StorageService = {
  // Planner Tasks
  getTasks(): PlannerTask[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(KEYS.PLANNER);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },
  saveTasks(tasks: PlannerTask[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.PLANNER, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save planner tasks:', e);
    }
  },

  // Revision Queue
  getRevisionQueue(): RevisionTopic[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(KEYS.REVISION);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },
  saveRevisionQueue(queue: RevisionTopic[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.REVISION, JSON.stringify(queue));
    } catch (e) {
      console.error('Failed to save revision queue:', e);
    }
  },

  // Custom Tests
  getTestRecords(): TestRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(KEYS.TESTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },
  saveTestRecords(records: TestRecord[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.TESTS, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save test records:', e);
    }
  },

  // PDF Documents
  getPDFDocs(): PDFDoc[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(KEYS.PDFS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },
  savePDFDocs(docs: PDFDoc[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.PDFS, JSON.stringify(docs));
    } catch (e) {
      console.error('Failed to save PDF docs:', e);
    }
  },
};
