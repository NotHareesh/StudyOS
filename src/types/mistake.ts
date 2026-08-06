import { SubjectId } from './syllabus';

export type MistakeReason = 
  | 'conceptual_gap' 
  | 'calculation_error' 
  | 'time_pressure' 
  | 'misread_question' 
  | 'formula_forgotten';

export type MistakeReviewStatus = 'needs_review' | 'reviewing' | 'mastered';

export interface MistakeEntry {
  id: string;
  subjectId: SubjectId;
  chapterId: string;
  topicId?: string;
  title: string;
  questionText: string;
  questionImageUrl?: string;
  mistakeReason: MistakeReason;
  correctSolution: string;
  correctSolutionImageUrl?: string;
  revisionStatus: MistakeReviewStatus;
  reviewCount: number;
  nextReviewDate?: string;
  tags: string[];
  createdAt?: any;
}
