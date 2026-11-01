import { useState, useEffect, useCallback } from 'react';
import { BarChart3 } from 'lucide-react';
import { EditorPane } from '../Editor/EditorPane';
import { ChatPane } from '../Chat/ChatPane';
import { SubmissionModal } from '../SubmissionModal/SubmissionModal';
import type { AssessmentSession, ChatMessage, InsertionEvent, SubmissionSnapshot } from '../../types/assessment';
import type { JSONContent } from '@tiptap/core';

export interface AssessmentWorkspaceProps {
  assessmentId: string;
  assessmentTitle?: string;
  courseCode?: string;
  studentName?: string;
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
  onOpenAnalytics?: () => void;
}

export function AssessmentWorkspace({
  assessmentId,
  assessmentTitle,
  courseCode,
  studentName,
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
  onOpenAnalytics,
}: AssessmentWorkspaceProps) {
  const [session, setSession] = useState<AssessmentSession>(initialSession);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [markInput, setMarkInput] = useState<string>(mark?.toString() ?? '');
  const [markError, setMarkError] = useState<string | null>(null);

  useEffect(() => {
    setSession(initialSession);
  }, [initialSession]);

  useEffect(() => {
    setMarkInput(mark?.toString() ?? '');
  }, [mark]);

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

  const statusBadge = () => {
    if (effectiveClosed) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full pill-closed">
          Closed
        </span>
      );
    }
    if (isSubmitted) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full pill-open">
          Submitted
        </span>
      );
    }
    if (isTeacherMode) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#F3F2EE] text-ink">
          Teacher View
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full pill-open">
        Open
      </span>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-[#FAFAF8] text-ink">
      {/* Header */}
      <header className="h-14 px-4 sm:px-6 flex items-center justify-between gap-3 flex-wrap shrink-0 bg-white border-b border-[#E8E6E1]">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[#F3F2EE] text-ink hover:bg-[#E8E6E1]"
            >
              ←
            </button>
          )}
          {courseCode && (
            <span
              className="w-2 h-5 rounded-lg shrink-0"
              style={{
                background:
                  courseCode.toUpperCase().startsWith('WRIT') || courseCode.toUpperCase().startsWith('ENG')
                    ? '#3D6B9A'
                    : courseCode.toUpperCase().startsWith('HIST')
                      ? '#4A7A52'
                      : '#C45C4A',
              }}
              aria-hidden
            />
          )}
          <h1 className="font-semibold text-sm truncate">
            {assessmentTitle || 'Assessment'}
          </h1>
          {statusBadge()}
          {courseCode && <span className="text-xs text-ink-subtle">{courseCode}</span>}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isSaving && <span className="text-xs text-ink-subtle">Saving...</span>}
          {lastSaved && !isSaving && (
            <span className="text-xs text-ink-subtle">
              saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
          )}

          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F3F2EE] text-ink hover:bg-[#E8E6E1]"
            >
              {pdfFileName || 'View PDF'}
            </a>
          )}

          {mark !== undefined && mark !== null && isStudentMode && (
            <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#E8F6EE] text-[#0F6B3E]">
              Mark {mark}/100
            </span>
          )}

          {isTeacherMode && onSetMark && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={markInput}
                onChange={(e) => setMarkInput(e.target.value)}
                placeholder="0-100"
                aria-label="Mark out of 100"
                className="w-16 px-2 py-1 border border-[#E8E6E1] rounded-lg text-center bg-[#FAFAF8] text-ink text-sm"
              />
              <button
                onClick={handleMarkSubmit}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-ink text-white hover:bg-[#222]"
              >
                Set Mark
              </button>
              {markError && <span className="text-error text-xs">{markError}</span>}
            </div>
          )}

          {isTeacherMode && onOpenAnalytics && (
            <button
              type="button"
              onClick={onOpenAnalytics}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-ink text-white hover:bg-[#222]"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </button>
          )}

          {isStudentMode && !readOnly && !isSubmitted && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-[13px] font-semibold rounded-lg bg-ink text-white hover:bg-[#222]"
            >
              Submit Assessment
            </button>
          )}

          {isSubmitted && (
            <button
              onClick={handleDownloadJSON}
              className="px-4 py-2 text-[13px] font-semibold rounded-lg bg-[#F3F2EE] text-ink hover:bg-[#E8E6E1]"
            >
              Download JSON
            </button>
          )}
        </div>
      </header>

      {effectiveClosed && (
        <div className="mx-4 sm:mx-6 mt-3 px-4 py-2 text-sm rounded-lg bg-error/10 border border-error/30 text-error">
          This assessment is closed.{' '}
          {isStudentMode
            ? 'You can view your work but cannot make changes.'
            : 'The student can no longer make changes.'}
        </div>
      )}

      {/* Editor canvas + sticky margin notes */}
      <div className="flex-1 flex min-h-0 px-3 sm:px-6 py-4 gap-3">
        <div className="flex-1 min-w-0 bg-white text-ink rounded-xl border border-[#E8E6E1] shadow-folio relative overflow-hidden flex flex-col">
          <div className="px-6 sm:px-10 pt-5 pb-2 flex justify-between items-center text-[12px] text-ink-subtle shrink-0">
            <span className="sr-only">Document</span>
            <span className="ml-auto">{studentName || ''}</span>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <EditorPane
              content={session.documentContent}
              onChange={handleDocumentChange}
              onInsertText={handleInsertText}
              readOnly={readOnly || effectiveClosed}
              variant="book"
            />
          </div>
        </div>

        <aside className="w-full max-w-[320px] shrink-0 flex flex-col min-h-0">
          <ChatPane
            messages={session.chatHistory}
            onNewMessage={handleNewMessage}
            onInsertText={handleInsertText}
            readOnly={readOnly || effectiveClosed}
            courseCode={courseCode}
            variant="folio"
          />
        </aside>
      </div>

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
