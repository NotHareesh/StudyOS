export type TestType = 'JEE_MAIN' | 'JEE_ADVANCED' | 'CBSE_BOARD' | 'PART_TEST';

export interface SubjectScore {
  marks: number;
  totalPossibleMarks: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  timeSpentMinutes: number;
}

export interface MockTestEntry {
  id: string;
  testName: string;
  testType: TestType;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  totalMarks: number;
  scoredMarks: number;
  accuracyPercentage: number;
  physics: SubjectScore;
  chemistry: SubjectScore;
  maths: SubjectScore;
  weakChapterIds: string[];
  analysisNotes: string;
  aiRecommendations?: string[];
  createdAt?: any;
}
