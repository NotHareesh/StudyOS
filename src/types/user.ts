export type TargetExam = 'CBSE_12' | 'JEE_MAIN' | 'JEE_ADVANCED';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  targetExams: TargetExam[];
  targetExamYear: number;
  dailyGoalHours: number;
  streakCount: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalStudySeconds: number;
  createdAt?: any;
  updatedAt?: any;
}
