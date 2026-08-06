export type AIContextType = 'general' | 'pdf_document' | 'topic' | 'mistake' | 'mock_test';

export interface AIConversation {
  id: string;
  title: string;
  contextType: AIContextType;
  contextReferenceId?: string;
  createdAt?: any;
  updatedAt?: any;
}

export type MessageRole = 'user' | 'model' | 'system';

export interface AIMessageAttachment {
  type: 'formula' | 'pdf_snippet' | 'quiz' | 'flashcard';
  data: any;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  attachments?: AIMessageAttachment[];
  createdAt?: any;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subjectId?: string;
  chapterId?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'CBSE' | 'JEE_MAIN' | 'JEE_ADVANCED';
}
