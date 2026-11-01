import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, BarChart3, MessageSquareText, X } from 'lucide-react';
import { EditorPane } from '../Editor/EditorPane';
import { ChatPane } from '../Chat/ChatPane';
import { SubmissionModal } from '../SubmissionModal/SubmissionModal';
import { showToast } from '@/lib/toast';
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
  const [notesOpen, setNotesOpen] = useState(false);

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

  useEffect(() => {
    if (!notesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotesOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [notesOpen]);

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
    showToast('Assessment submitted', 'success');
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
      showToast(`Mark set to ${markValue}/100`, 'success');
    } catch (error) {
      setMarkError('Failed to save mark');
      showToast('Failed to save mark', 'error');
    }
  };

  const isSubmitted = !!session.submittedAt;
  const isStudentMode = mode === 'student';
  const isTeacherMode = mode === 'teacher';
  const noteCount = session.chatHistory.length;

  const spine =
    courseCode?.toUpperCase().startsWith('WRIT') || courseCode?.toUpperCase().startsWith('ENG')
      ? '#3D6B9A'
      : courseCode?.toUpperCase().startsWith('HIST')
        ? '#4A7A52'
        : '#C45C4A';

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

  const chatProps = {
    messages: session.chatHistory,
    onNewMessage: handleNewMessage,
    onInsertText: handleInsertText,
    readOnly: readOnly || effectiveClosed,
    courseCode,
    variant: 'folio' as const,
  };

  return (
    <div className="h-screen flex flex-col bg-[#FAFAF8] text-ink">
      <header className="sticky top-0 z-20 h-14 px-3 sm:px-6 flex items-center justify-between gap-3 flex-wrap shrink-0 bg-white/95 backdrop-blur-sm border-b border-[#E8E6E1]">
        <div className="flex items-center gap-2.5 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="folio-btn-secondary !px-2.5 !py-2"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          {courseCode && (
            <span className="w-2 h-5 rounded-lg shrink-0" style={{ background: spine }} aria-hidden />
          )}
          <h1 className="font-semibold text-sm truncate max-w-[40vw] sm:max-w-none">
            {assessmentTitle || 'Assessment'}
          </h1>
          {statusBadge()}
          {courseCode && <span className="hidden sm:inline text-xs text-ink-subtle">{courseCode}</span>}
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {isSaving && <span className="text-xs text-ink-subtle">Saving…</span>}
          {lastSaved && !isSaving && (
            <span className="hidden sm:inline text-xs text-ink-subtle">
              saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
          )}

          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="folio-btn-secondary !py-1.5 !text-xs"
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
                className="folio-input !w-16 !py-1.5 text-center"
              />
              <button type="button" onClick={handleMarkSubmit} className="folio-btn-primary !py-1.5 !text-xs">
                Set Mark
              </button>
              {markError && <span className="text-error text-xs">{markError}</span>}
            </div>
          )}

          {isTeacherMode && onOpenAnalytics && (
            <button type="button" onClick={onOpenAnalytics} className="folio-btn-primary !py-1.5 !text-xs">
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </button>
          )}

          {isStudentMode && !readOnly && !isSubmitted && (
            <button type="button" onClick={handleSubmit} className="folio-btn-primary">
              Submit Assessment
            </button>
          )}

          {isSubmitted && (
            <button type="button" onClick={handleDownloadJSON} className="folio-btn-secondary">
              Download JSON
            </button>
          )}
        </div>
      </header>

      {effectiveClosed && (
        <div className="mx-3 sm:mx-6 mt-3 px-4 py-2.5 text-sm rounded-lg bg-[#B93232]/08 border border-[#B93232]/25 text-[#B93232]">
          This assessment is closed.{' '}
          {isStudentMode
            ? 'You can view your work but cannot make changes.'
            : 'The student can no longer make changes.'}
        </div>
      )}

      <div className="flex-1 flex min-h-0 px-2 sm:px-4 lg:px-6 py-3 sm:py-4 gap-3">
        {/* Writing canvas */}
        <div className="flex-1 min-w-0 bg-white text-ink rounded-xl border border-[#E8E6E1] shadow-folio relative overflow-hidden flex flex-col">
          <div className="px-5 sm:px-10 pt-4 pb-0 flex justify-between items-center text-[12px] text-ink-subtle shrink-0">
            <span className="folio-section-label">DOCUMENT</span>
            <span>{studentName || ''}</span>
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

        {/* Desktop margin notes */}
        <aside className="folio-desktop-only w-full max-w-[320px] shrink-0 flex flex-col min-h-0">
          <div className="h-full folio-card p-3 flex flex-col min-h-0 overflow-hidden">
            <ChatPane {...chatProps} />
          </div>
        </aside>
      </div>

      {/* Mobile notes FAB */}
      <button
        type="button"
        className="folio-mobile-only fixed bottom-5 right-5 z-30 folio-btn-primary !rounded-full !px-4 !py-3 shadow-lg inline-flex"
        onClick={() => setNotesOpen(true)}
        aria-label="Open margin notes"
      >
        <MessageSquareText className="h-4 w-4" />
        Notes{noteCount > 0 ? ` · ${noteCount}` : ''}
      </button>

      {/* Mobile notes bottom sheet */}
      <div
        className={`folio-mobile-only fixed inset-0 z-40 transition-opacity duration-200 ${
          notesOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!notesOpen}
      >
        <div className="absolute inset-0 bg-ink/35" onClick={() => setNotesOpen(false)} />
        <div
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-2xl border-t border-[#E8E6E1] shadow-lg flex flex-col transition-transform duration-200 ease-out ${
            notesOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Margin notes"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E6E1] shrink-0">
            <div className="folio-section-label">MARGIN NOTES</div>
            <button
              type="button"
              className="folio-btn-secondary !px-2 !py-2"
              aria-label="Close notes"
              onClick={() => setNotesOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 min-h-0 p-3 overflow-hidden">
            {notesOpen ? <ChatPane {...chatProps} /> : null}
          </div>
        </div>
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
