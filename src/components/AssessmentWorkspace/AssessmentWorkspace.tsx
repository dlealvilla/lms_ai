import { useState, useEffect, useCallback } from 'react';
import { EditorPane } from '../Editor/EditorPane';
import { ChatPane } from '../Chat/ChatPane';
import { SubmissionModal } from '../SubmissionModal/SubmissionModal';
import type { AssessmentSession, ChatMessage, InsertionEvent, SubmissionSnapshot } from '../../types/assessment';
import type { JSONContent } from '@tiptap/core';

export interface AssessmentWorkspaceProps {
  assessmentId: string;
  assessmentTitle?: string;
  mode: 'student' | 'teacher';
  readOnly: boolean;
  effectiveClosed: boolean;
  initialSession: AssessmentSession;
  onAutosave?: (session: AssessmentSession) => Promise<void>;
  mark?: number | null;
  onSetMark?: (mark: number) => Promise<void>;
  pdfUrl?: string | null;
  pdfFileName?: string | null;
  onBack?: () => void;
}

export function AssessmentWorkspace({
  assessmentId,
  assessmentTitle,
  mode,
  readOnly,
  effectiveClosed,
  initialSession,
  onAutosave,
  mark,
  onSetMark,
  pdfUrl,
  pdfFileName,
  onBack,
}: AssessmentWorkspaceProps) {
  const [session, setSession] = useState<AssessmentSession>(initialSession);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [markInput, setMarkInput] = useState<string>(mark?.toString() ?? '');
  const [markError, setMarkError] = useState<string | null>(null);

  // Sync initialSession when it changes
  useEffect(() => {
    setSession(initialSession);
  }, [initialSession]);

  // Sync mark input when mark prop changes
  useEffect(() => {
    setMarkInput(mark?.toString() ?? '');
  }, [mark]);

  // Autosave effect
  useEffect(() => {
    if (readOnly || !onAutosave) return;

    const saveTimeout = setTimeout(async () => {
      setIsSaving(true);
      try {
        await onAutosave(session);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Autosave failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [session, readOnly, onAutosave]);

  const handleDocumentChange = useCallback((content: JSONContent) => {
    if (readOnly) return;
    setSession(prev => ({
      ...prev,
      documentContent: content,
    }));
  }, [readOnly]);

  const handleNewMessage = useCallback((message: ChatMessage) => {
    if (readOnly) return;
    setSession(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, message],
    }));
  }, [readOnly]);

  const handleInsertText = useCallback((text: string, aiMessageId: string) => {
    if (readOnly) return;
    const insertion: InsertionEvent = {
      id: `ins_${Date.now()}_${Math.random()}`,
      aiMessageId,
      insertedText: text,
      createdAt: Date.now(),
    };

    setSession(prev => ({
      ...prev,
      insertions: [...prev.insertions, insertion],
    }));
  }, [readOnly]);

  const handleSubmit = () => {
    if (session.submittedAt || readOnly) return;

    const snapshot: SubmissionSnapshot = {
      documentContent: session.documentContent,
      chatHistory: session.chatHistory,
      insertions: session.insertions,
    };

    const updatedSession: AssessmentSession = {
      ...session,
      submittedAt: Date.now(),
      submission: snapshot,
    };

    setSession(updatedSession);
    if (onAutosave) {
      onAutosave(updatedSession);
    }
    setShowSubmissionModal(true);
  };

  const handleDownloadJSON = () => {
    if (!session.submission) return;

    const dataStr = JSON.stringify(session.submission, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `submission_${assessmentId}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleMarkSubmit = async () => {
    if (!onSetMark) return;
    
    const markValue = parseInt(markInput, 10);
    if (isNaN(markValue) || markValue < 0 || markValue > 100) {
      setMarkError('Mark must be an integer between 0 and 100');
      return;
    }
    
    setMarkError(null);
    try {
      await onSetMark(markValue);
    } catch (error) {
      setMarkError('Failed to save mark');
    }
  };

  const isSubmitted = !!session.submittedAt;
  const isStudentMode = mode === 'student';
  const isTeacherMode = mode === 'teacher';

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              ← Back
            </button>
          )}
          <h1 className="text-xl font-bold">
            {assessmentTitle || 'Assessment'}
          </h1>
          
          {/* Status badges */}
          {effectiveClosed && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              Closed
            </span>
          )}
          {!effectiveClosed && !isSubmitted && isStudentMode && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Draft
            </span>
          )}
          {isSubmitted && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Submitted
            </span>
          )}
          {isTeacherMode && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              Teacher View
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Saving indicator */}
          {isSaving && (
            <span className="text-sm text-gray-500">Saving...</span>
          )}
          {lastSaved && !isSaving && (
            <span className="text-sm text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}

          {/* PDF Link */}
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center gap-2"
            >
              📄 {pdfFileName || 'View PDF'}
            </a>
          )}

          {/* Mark display/input */}
          {mark !== undefined && mark !== null && isStudentMode && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Mark: {mark}/100
            </span>
          )}

          {/* Teacher mark input */}
          {isTeacherMode && onSetMark && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={markInput}
                onChange={(e) => setMarkInput(e.target.value)}
                placeholder="0-100"
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <button
                onClick={handleMarkSubmit}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Set Mark
              </button>
              {markError && (
                <span className="text-red-500 text-sm">{markError}</span>
              )}
            </div>
          )}

          {/* Student actions */}
          {isStudentMode && !readOnly && !isSubmitted && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit Assessment
            </button>
          )}

          {isSubmitted && (
            <button
              onClick={handleDownloadJSON}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Download JSON
            </button>
          )}
        </div>
      </header>

      {/* Closed banner */}
      {effectiveClosed && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 text-red-800">
          ⚠️ This assessment is closed. {isStudentMode ? 'You can view your work but cannot make changes.' : 'The student can no longer make changes.'}
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <EditorPane
            content={session.documentContent}
            onChange={handleDocumentChange}
            onInsertText={handleInsertText}
            readOnly={readOnly || effectiveClosed}
          />
        </div>
        <ChatPane
          messages={session.chatHistory}
          onNewMessage={handleNewMessage}
          onInsertText={handleInsertText}
          readOnly={readOnly || effectiveClosed}
        />
      </div>

      {/* Submission modal */}
      {showSubmissionModal && session.submission && (
        <SubmissionModal
          submission={session.submission}
          onClose={() => setShowSubmissionModal(false)}
          onDownload={handleDownloadJSON}
        />
      )}
    </div>
  );
}

