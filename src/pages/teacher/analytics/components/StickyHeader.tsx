import { ChevronRight, ArrowLeft, Download, StickyNote } from 'lucide-react';
import { Skeleton } from './Skeleton';

interface StickyHeaderProps {
  onBack: () => void;
  onOpenNotes: () => void;
}

export function StickyHeader({ onBack, onOpenNotes }: StickyHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      {/* Main header row */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-start justify-between">
          {/* Left: Breadcrumb + Title */}
          <div className="space-y-1">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm text-gray-500">
              <span className="hover:text-gray-700 cursor-pointer">Assessments</span>
              <ChevronRight className="w-3 h-3" />
              <Skeleton className="h-4 w-32" />
              <ChevronRight className="w-3 h-3" />
              <Skeleton className="h-4 w-24" />
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900 font-medium">Attempt Analytics</span>
            </nav>

            {/* Page title */}
            <h1 className="text-2xl font-semibold text-gray-900">
              Attempt Analytics
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 flex items-center gap-2">
              <Skeleton className="h-4 w-48" />
              <span className="text-gray-400">—</span>
              <Skeleton className="h-4 w-64" />
            </p>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Assessment
            </button>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={onOpenNotes}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <StickyNote className="w-4 h-4" />
              Educator Notes
            </button>
          </div>
        </div>
      </div>

      {/* Metadata bar */}
      <MetaBar />
    </header>
  );
}

function MetaBar() {
  const metaItems = [
    { label: 'Prompts', value: null },
    { label: 'Tokens in', value: null },
    { label: 'Tokens out', value: null },
    { label: 'Active time', value: null },
    { label: 'Revision cycles', value: null },
    { label: 'Confidence', value: null },
    { label: 'Submitted', value: null },
    { label: 'Model', value: null },
  ];

  return (
    <div className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-6 overflow-x-auto">
          {metaItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {item.label}:
              </span>
              {item.value ? (
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              ) : (
                <Skeleton className="h-4 w-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
