import type { AssessmentSession } from '../../types/assessment';

const STORAGE_KEY = 'lms_assessment_session';
const DEFAULT_ASSESSMENT_ID = 'assessment_001';

let saveTimeout: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 1000;

export function loadSession(): AssessmentSession {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load session:', error);
  }

  return {
    assessmentId: DEFAULT_ASSESSMENT_ID,
    documentContent: null,
    chatHistory: [],
    insertions: [],
  };
}

export function saveSession(session: AssessmentSession): void {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
    saveTimeout = null;
  }, DEBOUNCE_MS);
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}
