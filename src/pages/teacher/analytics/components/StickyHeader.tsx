import { ChevronRight, ArrowLeft, Download, StickyNote } from 'lucide-react';
import type { AnalyticsData } from '../mockAnalyticsData';

interface StickyHeaderProps {
  data: AnalyticsData | null;
  onBack: () => void;
  onOpenNotes: () => void;
}

export function StickyHeader({ data, onBack, onOpenNotes }: StickyHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#F3F2EE]/95 backdrop-blur-sm border-b border-[#E8E6E1]/40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <nav className="flex items-center gap-1 text-sm text-ink-muted flex-wrap">
              <span className="hover:text-ink cursor-pointer">Assessments</span>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-ink/90">{data?.assessmentTitle || '—'}</span>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-ink/90">{data?.studentName || '—'}</span>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-ink font-medium">Attempt Analytics</span>
            </nav>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-2xl font-bold text-ink">
                Attempt Analytics
              </h1>
              <span
                className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-lg border border-ink/50 bg-ink/15 text-ink"
                title="Illustrative scores — not computed from this attempt"
              >
                Sample data preview
              </span>
            </div>

            <p className="text-ink-muted flex items-center gap-2 flex-wrap">
              <span className="text-ink/80">{data?.assessmentTitle || '—'}</span>
              <span className="text-ink-subtle">—</span>
              <span className="italic text-ink-muted">{data?.assessmentQuestion || '—'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#E8E6E1] bg-[#F3F2EE] text-ink hover:border-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Assessment
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#E8E6E1]/50 bg-[#F3F2EE]/60 text-ink-muted cursor-not-allowed"
              disabled
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              type="button"
              onClick={onOpenNotes}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-ink text-primary-foreground border border-ink hover:bg-[#222] transition-colors"
            >
              <StickyNote className="w-4 h-4" />
              Educator Notes
            </button>
          </div>
        </div>
      </div>

      <MetaBar data={data} />
    </header>
  );
}

function MetaBar({ data }: { data: AnalyticsData | null }) {
  const meta = data?.meta;

  const metaItems = [
    { label: 'Prompts', value: meta?.promptCount },
    { label: 'Tokens in', value: meta?.tokensIn?.toLocaleString() },
    { label: 'Tokens out', value: meta?.tokensOut?.toLocaleString() },
    { label: 'Active time', value: meta ? `${meta.activeTimeMinutes} min` : null },
    { label: 'Revision cycles', value: meta?.revisionCycles },
    { label: 'Confidence', value: meta?.confidence },
  ];

  return (
    <div className="bg-[#F3F2EE]/80 border-t border-[#E8E6E1]/30">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-6 overflow-x-auto">
          {metaItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-[10px] text-ink-muted uppercase tracking-wide">
                {item.label}:
              </span>
              <span className="text-sm font-medium text-ink">
                {item.value ?? '—'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
