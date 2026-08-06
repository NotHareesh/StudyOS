import { SubjectId } from './syllabus';

export interface FormulaEntry {
  id: string;
  subjectId: SubjectId;
  chapterId?: string;
  title: string;
  latexCode: string;
  explanation: string;
  tags: string[];
  isFavorite: boolean;
  imageUrl?: string;
  createdAt?: any;
}
