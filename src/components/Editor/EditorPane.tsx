import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Mark } from '@tiptap/core';
import { useEffect, useRef } from 'react';
import type { JSONContent } from '@tiptap/core';
import { cn } from '@/lib/utils';

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
  variant?: 'default' | 'book';
}

export function EditorPane({
  content,
  onChange,
  onInsertText,
  readOnly = false,
  variant = 'default',
}: EditorPaneProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isBook = variant === 'book';

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
        class: cn(
          'prose max-w-none focus:outline-none min-h-[400px]',
          isBook ? 'px-6 sm:px-10 pb-10 pt-2' : 'p-6',
        ),
      },
    },
  });

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
    const toast = document.createElement('div');
    toast.className =
      'fixed top-4 right-4 bg-error text-error-foreground px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

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
    return <div className="flex items-center justify-center h-full text-ink-muted">Loading editor...</div>;
  }

  const toolBtn = (active: boolean) =>
    cn(
      'px-2 py-0.5 text-xs rounded-lg font-semibold',
      active
        ? 'bg-ink text-primary-foreground'
        : 'text-ink-subtle hover:text-ink hover:bg-[#F3F2EE]',
    );

  return (
    <div className="flex flex-col h-full">
      {!readOnly && (
        <div
          className={cn(
            'flex gap-1 flex-wrap shrink-0',
            isBook ? 'px-6 sm:px-10 pb-1 justify-end' : 'border-b border-[#E8E6E1]/30 p-2 bg-page-muted',
          )}
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={toolBtn(editor.isActive('bold'))}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={toolBtn(editor.isActive('italic'))}
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={toolBtn(editor.isActive('underline'))}
          >
            U
          </button>
          <span className="text-ink-subtle px-1">·</span>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={toolBtn(editor.isActive('heading', { level: 1 }))}
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={toolBtn(editor.isActive('heading', { level: 2 }))}
          >
            H2
          </button>
          <span className="text-ink-subtle px-1">·</span>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={toolBtn(editor.isActive('bulletList'))}
          >
            List
          </button>
        </div>
      )}
      <div ref={editorRef} className="flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
