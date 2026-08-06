import { SubjectId } from './syllabus';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'deferred';

export interface DailyTask {
  id: string;
  title: string;
  description?: string;
  subjectId?: SubjectId;
  chapterId?: string;
  topicId?: string;
  date: string; // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
  timeBlockStart?: string; // "09:00"
  timeBlockEnd?: string;   // "10:30"
  estimatedMinutes: number;
  actualMinutesSpent: number;
  pomodoroSessionsCompleted: number;
  orderIndex: number;
  createdAt?: any;
}
