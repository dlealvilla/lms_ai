import { X, Save } from 'lucide-react';

interface NotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotesDrawer({ isOpen, onClose }: NotesDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-page shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E6E1]">
          <h2 className="text-lg font-semibold text-ink">Educator Notes</h2>
          <button
            onClick={onClose}
            className="p-2 text-ink-subtle hover:text-ink-muted hover:bg-page-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Student info */}
          <div className="mb-6 p-4 bg-page-muted rounded-lg">
            <div className="text-sm text-ink-muted">Student</div>
            <div className="text-lg font-medium text-ink">—</div>
            <div className="text-sm text-ink-muted mt-2">Assessment</div>
            <div className="text-sm font-medium text-ink">—</div>
          </div>

          {/* Notes textarea */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink block mb-2">
                Private Notes
              </label>
              <textarea
                disabled
                placeholder="Add private notes about this student's attempt..."
                className="w-full h-40 px-4 py-3 text-sm border border-[#E8E6E1] rounded-lg bg-page resize-none cursor-not-allowed"
              />
              <p className="text-xs text-ink-subtle mt-1">
                These notes are only visible to educators.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-ink block mb-2">
                Feedback for Student
              </label>
              <textarea
                disabled
                placeholder="Add feedback that will be shared with the student..."
                className="w-full h-32 px-4 py-3 text-sm border border-[#E8E6E1] rounded-lg bg-page resize-none cursor-not-allowed"
              />
              <p className="text-xs text-ink-subtle mt-1">
                This feedback can be released to the student.
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-ink block mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs bg-page-muted text-ink-muted rounded-full">
                  + Add tag
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8E6E1] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-ink bg-page border border-[#111111]/40 rounded-lg hover:bg-page-muted transition-colors"
          >
            Cancel
          </button>
          <button
            disabled
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-ink rounded-lg opacity-50 cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save Notes
          </button>
        </div>
      </div>
    </>
  );
}
