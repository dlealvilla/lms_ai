import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Mark } from '@tiptap/core';
import { useEffect, useRef } from 'react';
import type { JSONContent } from '@tiptap/core';
import { Bold, Heading1, Heading2, Italic, List, Underline as UnderlineIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showToast } from '@/lib/toast';
import { Skeleton } from '@/components/ui/Skeleton';

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
          isBook ? 'px-5 sm:px-10 lg:px-14 pb-16 pt-3' : 'p-6',
        ),
      },
    },
  });

  useEffect(() => {
    if (!editor || readOnly) return;

    const blockPaste = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      showToast('Paste is disabled for this assessment.', 'error');
      return false;
    };

    const handleBeforeInput = (e: InputEvent) => {
      if (e.inputType === 'insertFromPaste' || e.inputType === 'insertFromDrop') {
        e.preventDefault();
        showToast('Paste is disabled for this assessment.', 'error');
        return false;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault();
        e.stopPropagation();
        showToast('Paste is disabled for this assessment.', 'error');
        return false;
      }
    };

    const editorElement = editor.view.dom;

    editorElement.addEventListener('paste', blockPaste);
    editorElement.addEventListener('beforeinput', handleBeforeInput as EventListener);
    editorElement.addEventListener('drop', blockPaste);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      editorElement.removeEventListener('paste', blockPaste);
      editorElement.removeEventListener('beforeinput', handleBeforeInput as EventListener);
      editorElement.removeEventListener('drop', blockPaste);
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
        showToast('Inserted into document', 'success');
      };
    }
    return () => {
      delete (window as any).__editorInsertText;
    };
  }, [editor, onInsertText, readOnly]);

  if (!editor) {
    return (
      <div className="p-8 space-y-3" role="status" aria-label="Loading editor">
        <Skeleton className="h-8 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-full max-w-lg" />
        <Skeleton className="h-4 w-5/6 max-w-xl" />
      </div>
    );
  }

  const toolBtn = (active: boolean) =>
    cn(
      'inline-flex items-center justify-center h-8 min-w-8 px-2 rounded-lg text-xs font-semibold',
      active
        ? 'bg-ink text-white'
        : 'text-ink-muted hover:text-ink hover:bg-[#F3F2EE]',
    );

  return (
    <div className="flex flex-col h-full">
      {!readOnly && (
        <div
          className={cn(
            'sticky top-0 z-10 flex gap-1 flex-wrap shrink-0 bg-white/95 backdrop-blur-sm border-b border-[#E8E6E1]',
            isBook ? 'px-5 sm:px-10 lg:px-14 py-2' : 'p-2 bg-page-muted',
          )}
          role="toolbar"
          aria-label="Formatting"
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={toolBtn(editor.isActive('bold'))}
            aria-pressed={editor.isActive('bold')}
            aria-label="Bold"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={toolBtn(editor.isActive('italic'))}
            aria-pressed={editor.isActive('italic')}
            aria-label="Italic"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={toolBtn(editor.isActive('underline'))}
            aria-pressed={editor.isActive('underline')}
            aria-label="Underline"
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </button>
          <span className="text-ink-subtle px-1 self-center" aria-hidden>
            ·
          </span>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={toolBtn(editor.isActive('heading', { level: 1 }))}
            aria-pressed={editor.isActive('heading', { level: 1 })}
            aria-label="Heading 1"
          >
            <Heading1 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={toolBtn(editor.isActive('heading', { level: 2 }))}
            aria-pressed={editor.isActive('heading', { level: 2 })}
            aria-label="Heading 2"
          >
            <Heading2 className="h-3.5 w-3.5" />
          </button>
          <span className="text-ink-subtle px-1 self-center" aria-hidden>
            ·
          </span>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={toolBtn(editor.isActive('bulletList'))}
            aria-pressed={editor.isActive('bulletList')}
            aria-label="Bullet list"
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <div ref={editorRef} className="flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
