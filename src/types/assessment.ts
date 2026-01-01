export type ChatRole = "student" | "ai";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

export interface InsertionEvent {
  id: string;
  aiMessageId: string;
  insertedText: string;
  createdAt: number;
  selectionInfo?: any;
}

export interface SubmissionSnapshot {
  documentContent: any;
  chatHistory: ChatMessage[];
  insertions: InsertionEvent[];
}

export interface AssessmentSession {
  assessmentId: string;
  documentContent: any;
  chatHistory: ChatMessage[];
  insertions: InsertionEvent[];
  submittedAt?: number;
  submission?: SubmissionSnapshot;
}

