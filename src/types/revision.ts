import { SubjectId } from './syllabus';

export type RevisionStatus = 'scheduled' | 'completed' | 'missed' | 'skipped';

export interface RevisionRecord {
  id: string;
  topicId: string;
  chapterId: string;
  subjectId: SubjectId;
  scheduledDate: string; // YYYY-MM-DD
  completedDate?: string;
  status: RevisionStatus;
  qualityRating?: number; // 1 (blackout) to 5 (perfect recall)
  intervalDays: number;
  createdAt?: any;
}
