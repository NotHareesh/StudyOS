export interface PDFHighlight {
  id: string;
  pageNumber: number;
  text: string;
  color: string;
  note?: string;
  createdAt: string;
}

export interface PDFBookmark {
  id: string;
  pageNumber: number;
  title: string;
  createdAt: string;
}

export interface PDFDocumentEntry {
  id: string;
  title: string;
  subjectId?: string;
  chapterId?: string;
  storagePath: string;
  downloadUrl: string;
  fileSizeBytes: number;
  pageCount: number;
  aiSummary?: string;
  extractedTextByPage?: Record<number, string>;
  highlights: PDFHighlight[];
  bookmarks: PDFBookmark[];
  uploadedAt?: any;
}
