import { useState, useEffect, useCallback } from 'react';
import { EditorPane } from './components/Editor/EditorPane';
import { ChatPane } from './components/Chat/ChatPane';
import { SubmissionModal } from './components/SubmissionModal/SubmissionModal';
import { loadSession, saveSession, clearSession } from './lib/storage/sessionStorage';
import { isMockMode } from './lib/ai';
import type { AssessmentSession, ChatMessage, InsertionEvent, SubmissionSnapshot } from './types/assessment';
import type { JSONContent } from '@tiptap/core';

function App() {
  const [session, setSession] = useState<AssessmentSession>(() => loadSession());
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const loaded = loadSession();
    setSession(loaded);
  }, []);

  useEffect(() => {
    saveSession(session);
  }, [session]);

  const handleDocumentChange = useCallback((content: JSONContent) => {
    setSession(prev => ({
      ...prev,
      documentContent: content,
    }));
  }, []);

  const handleNewMessage = useCallback((message: ChatMessage) => {
    setSession(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, message],
    }));
  }, []);

  const handleInsertText = useCallback((text: string, aiMessageId: string) => {
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
  }, []);

  const handleSubmit = () => {
    if (session.submittedAt) return;

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
    setShowSubmissionModal(true);
  };

  const handleDownloadJSON = () => {
    if (!session.submission) return;

    const dataStr = JSON.stringify(session.submission, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `submission_${session.assessmentId}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }

    clearSession();
    const newSession: AssessmentSession = {
      assessmentId: `assessment_${Date.now()}`,
      documentContent: null,
      chatHistory: [],
      insertions: [],
    };
    setSession(newSession);
    setShowResetConfirm(false);
    setShowSubmissionModal(false);
  };

  const isSubmitted = !!session.submittedAt;
  const mockMode = isMockMode();

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">LMS Writing Prototype</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isSubmitted
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {isSubmitted ? 'Submitted' : 'Draft'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {mockMode && (
            <div className="px-3 py-1 bg-orange-100 text-orange-800 rounded text-sm">
              Mock AI mode (no API key configured)
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitted}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Assessment
          </button>
          <button
            onClick={handleDownloadJSON}
            disabled={!isSubmitted}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download Submission JSON
          </button>
          {import.meta.env.DEV && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {showResetConfirm ? 'Confirm Reset' : 'Reset'}
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <EditorPane
            content={session.documentContent}
            onChange={handleDocumentChange}
            onInsertText={handleInsertText}
            readOnly={isSubmitted}
          />
        </div>
        <ChatPane
          messages={session.chatHistory}
          onNewMessage={handleNewMessage}
          onInsertText={handleInsertText}
          readOnly={isSubmitted}
        />
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

export default App;

