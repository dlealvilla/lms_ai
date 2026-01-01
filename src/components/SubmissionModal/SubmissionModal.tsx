import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Mark } from '@tiptap/core';
import { useEffect } from 'react';
import type { SubmissionSnapshot, ChatMessage } from '../../types/assessment';

// Custom mark for AI-inserted text (same as EditorPane)
const AIInserted = Mark.create({
  name: 'aiInserted',
  addAttributes() {
    return {
      insertionId: {
        default: null,
        parseHTML: element => element.getAttribute('data-insertion-id'),
        renderHTML: attributes => {
          if (!attributes.insertionId) {
            return {};
          }
          return {
            'data-insertion-id': attributes.insertionId,
            class: 'ai-inserted-text',
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span[data-insertion-id]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },
});

interface SubmissionModalProps {
  submission: SubmissionSnapshot;
  onClose: () => void;
  onDownload: () => void;
}

export function SubmissionModal({ submission, onClose, onDownload }: SubmissionModalProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Underline,
      AIInserted,
    ],
    content: submission.documentContent || '',
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
  });

  useEffect(() => {
    if (editor && submission.documentContent) {
      editor.commands.setContent(submission.documentContent);
    }
  }, [editor, submission.documentContent]);

  const getMessageById = (id: string): ChatMessage | undefined => {
    return submission.chatHistory.find(msg => msg.id === id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[90vw] h-[90vh] flex flex-col">
        <div className="border-b border-gray-300 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Submission Review</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left: Document Preview */}
          <div className="flex-1 border-r border-gray-300 overflow-y-auto">
            <div className="p-4 border-b border-gray-300 bg-gray-50">
              <h3 className="font-semibold">Document Content</h3>
            </div>
            <div className="h-full overflow-y-auto">
              {editor && <EditorContent editor={editor} />}
            </div>
          </div>

          {/* Right: Chat History & Insertions */}
          <div className="w-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-300 bg-gray-50">
              <h3 className="font-semibold">Chat History</h3>
            </div>
            <div className="p-4 space-y-4">
              {submission.chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.role === 'student'
                      ? 'bg-blue-100'
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="text-xs text-gray-500 mb-1">
                    {message.role === 'student' ? 'Student' : 'AI'} •{' '}
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </div>
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-300 bg-gray-50">
              <h3 className="font-semibold">Insertions ({submission.insertions.length})</h3>
            </div>
            <div className="p-4 space-y-3">
              {submission.insertions.length === 0 ? (
                <div className="text-gray-500 text-sm">No text was inserted from AI responses.</div>
              ) : (
                submission.insertions.map((insertion) => {
                  const aiMessage = getMessageById(insertion.aiMessageId);
                  return (
                    <div key={insertion.id} className="border border-gray-200 rounded p-3">
                      <div className="text-xs text-gray-500 mb-1">
                        {new Date(insertion.createdAt).toLocaleTimeString()}
                      </div>
                      <div className="text-sm font-medium mb-1">AI Message:</div>
                      <div className="text-sm text-gray-700 mb-2 bg-gray-50 p-2 rounded">
                        {aiMessage?.content.substring(0, 100)}
                        {aiMessage && aiMessage.content.length > 100 && '...'}
                      </div>
                      <div className="text-sm font-medium mb-1">Inserted Text:</div>
                      <div className="text-sm bg-yellow-50 p-2 rounded border border-yellow-200">
                        {insertion.insertedText.substring(0, 150)}
                        {insertion.insertedText.length > 150 && '...'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 p-4 flex justify-end gap-2">
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Download Submission JSON
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
      <style>{`
        .ai-inserted-text {
          background-color: #fef3c7;
          border-bottom: 2px solid #f59e0b;
          padding: 2px 0;
        }
        .ProseMirror {
          outline: none;
        }
        .ProseMirror p {
          margin: 1em 0;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5em;
        }
      `}</style>
    </div>
  );
}

