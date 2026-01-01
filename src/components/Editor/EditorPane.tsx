import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Mark } from '@tiptap/core';
import { useEffect, useRef } from 'react';
import type { JSONContent } from '@tiptap/core';

// Custom mark for AI-inserted text
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

interface EditorPaneProps {
  content: JSONContent | null;
  onChange: (content: JSONContent) => void;
  onInsertText: (text: string, insertionId: string) => void;
  readOnly?: boolean;
}

export function EditorPane({ content, onChange, onInsertText, readOnly = false }: EditorPaneProps) {
  const editorRef = useRef<HTMLDivElement>(null);

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
    content: content || '',
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6',
      },
    },
  });

  // Block paste events
  useEffect(() => {
    if (!editor || readOnly) return;

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      showToast('Paste is disabled for this assessment.');
      return false;
    };

    const handleBeforeInput = (e: InputEvent) => {
      if (e.inputType === 'insertFromPaste' || e.inputType === 'insertFromDrop') {
        e.preventDefault();
        showToast('Paste is disabled for this assessment.');
        return false;
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      showToast('Paste is disabled for this assessment.');
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault();
        e.stopPropagation();
        showToast('Paste is disabled for this assessment.');
        return false;
      }
    };

    const editorElement = editor.view.dom;

    editorElement.addEventListener('paste', handlePaste);
    editorElement.addEventListener('beforeinput', handleBeforeInput);
    editorElement.addEventListener('drop', handleDrop);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      editorElement.removeEventListener('paste', handlePaste);
      editorElement.removeEventListener('beforeinput', handleBeforeInput);
      editorElement.removeEventListener('drop', handleDrop);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor, readOnly]);

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== null) {
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent = JSON.stringify(content);
      if (currentContent !== newContent) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  const showToast = (message: string) => {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  // Expose insertText method
  useEffect(() => {
    if (editor) {
      (window as any).__editorInsertText = (text: string, insertionId: string) => {
        if (readOnly) return;
        
        const { from } = editor.state.selection;
        editor
          .chain()
          .insertContentAt(from, [
            {
              type: 'text',
              text: text,
              marks: [
                {
                  type: 'aiInserted',
                  attrs: { insertionId },
                },
              ],
            },
          ])
          .run();
        
        onInsertText(text, insertionId);
      };
    }
    return () => {
      delete (window as any).__editorInsertText;
    };
  }, [editor, onInsertText, readOnly]);

  if (!editor) {
    return <div className="flex items-center justify-center h-full">Loading editor...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {!readOnly && (
        <div className="border-b border-gray-300 p-2 flex gap-2 flex-wrap bg-gray-50">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded ${
              editor.isActive('bold')
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded ${
              editor.isActive('italic')
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-3 py-1 rounded ${
              editor.isActive('underline')
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
          >
            <u>U</u>
          </button>
          <div className="w-px bg-gray-300 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1 rounded ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1 rounded ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
          >
            H2
          </button>
          <div className="w-px bg-gray-300 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 rounded ${
              editor.isActive('bulletList')
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 rounded ${
              editor.isActive('orderedList')
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
          >
            1.
          </button>
          <div className="w-px bg-gray-300 mx-1" />
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="px-3 py-1 rounded bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            ↶
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="px-3 py-1 rounded bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            ↷
          </button>
        </div>
      )}
      <div ref={editorRef} className="flex-1 overflow-auto border border-gray-300 bg-white">
        <EditorContent editor={editor} />
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
