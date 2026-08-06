export type SubjectId = 'physics' | 'chemistry' | 'maths';

export type TopicStatus = 'not_started' | 'learning' | 'practiced' | 'revised' | 'mastered';

export type TopicImportance = 'low' | 'medium' | 'high' | 'must_master';

export interface SyllabusSubject {
  id: SubjectId;
  name: string;
  color: string;
  iconName: string;
  orderIndex: number;
  totalChapters: number;
}

export interface SyllabusChapter {
  id: string;
  subjectId: SubjectId;
  name: string;
  cbseWeightage: number;
  jeeMainWeightage: number;
  jeeAdvancedWeightage: number;
  orderIndex: number;
  targetCompletionDate?: string;
}

export interface SyllabusTopic {
  id: string;
  subjectId: SubjectId;
  chapterId: string;
  name: string;
  status: TopicStatus;
  notes?: string;
  importance: TopicImportance;
  lastRevisedAt?: any;
  nextRevisionAt?: any;
  revisionLevel: number;
  easeFactor: number;
  intervalDays: number;
}
