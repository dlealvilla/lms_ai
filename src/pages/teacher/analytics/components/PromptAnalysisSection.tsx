import { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronRight, Brain, Cpu, ExternalLink } from 'lucide-react';
import { Skeleton, SkeletonText, SkeletonChip } from './Skeleton';

export function PromptAnalysisSection() {
  return (
    <section id="prompt-analysis" className="scroll-mt-24">
      <div className="mb-6">
        <h2 className="font-serif text-xl font-bold text-ink">
          Prompt-Level Analysis
        </h2>
        <p className="text-sm text-ink-muted mt-1">
          Each prompt is analysed independently. Expand a prompt to view all measurements and insights.
        </p>
      </div>

      {/* Empty state - shown when no data */}
      <EmptyPromptState />

      {/* Example prompt rows - rendered as wireframes */}
      <div className="space-y-3 mt-6">
        <PromptRowAccordion promptNumber={1} />
        <PromptRowAccordion promptNumber={2} />
        <PromptRowAccordion promptNumber={3} />
      </div>
    </section>
  );
}

function EmptyPromptState() {
  return (
    <div className="bg-page-muted border border-dashed border-[#111111]/40 rounded-[3px] p-8 text-center">
      <MessageSquare className="w-10 h-10 text-ink-subtle mx-auto mb-3" />
      <h3 className="text-sm font-medium text-ink-muted">No prompts to display</h3>
      <p className="text-sm text-ink-subtle mt-1">
        When data is connected, prompts will appear here.
      </p>
    </div>
  );
}

interface PromptRowAccordionProps {
  promptNumber: number;
}

function PromptRowAccordion({ promptNumber }: PromptRowAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-page border border-[#E8E6E1] rounded-lg overflow-hidden">
      {/* Collapsed Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-4 flex items-start gap-4 hover:bg-page-muted transition-colors text-left"
      >
        {/* Prompt number */}
        <div className="flex-shrink-0 w-8 h-8 bg-page-muted rounded-lg flex items-center justify-center">
          <span className="text-sm font-medium text-ink-muted">#{promptNumber}</span>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Prompt text preview */}
          <div className="mb-2">
            <Skeleton className="h-4 w-full max-w-md" />
          </div>

          {/* Tag chips */}
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Concepts */}
            <SkeletonChip className="w-16" />
            <SkeletonChip className="w-20" />
            {/* Cognitive level */}
            <SkeletonChip className="w-14 bg-spine-writ/20" />
            {/* Intent */}
            <SkeletonChip className="w-18 bg-ink/20" />
          </div>

          {/* Contribution mini-indicators */}
          <div className="flex items-center gap-6">
            {/* DK contributions */}
            <div className="flex items-center gap-2">
              <Brain className="w-3 h-3 text-spine-writ" />
              <div className="flex gap-1">
                <MiniBar />
                <MiniBar />
                <MiniBar />
                <MiniBar />
              </div>
            </div>

            {/* AIU contributions */}
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-ink" />
              <div className="flex gap-1">
                <MiniBar />
                <MiniBar />
                <MiniBar />
                <MiniBar />
                <MiniBar />
              </div>
            </div>

            {/* Timestamp */}
            <Skeleton className="h-3 w-16 ml-auto" />
          </div>
        </div>

        {/* Expand indicator */}
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-ink-subtle" />
          ) : (
            <ChevronRight className="w-5 h-5 text-ink-subtle" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-[#E8E6E1]/25">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-shelf/25">
            {/* Left: Domain Knowledge */}
            <PromptDKPanel />

            {/* Right: AI Usage */}
            <PromptAIUPanel />
          </div>

          {/* Links row */}
          <div className="px-4 py-3 bg-page-muted border-t border-[#E8E6E1]/25 flex items-center gap-4">
            <a
              href="#dk-breakdown"
              className="inline-flex items-center gap-1 text-xs text-spine-writ hover:text-spine-writ"
            >
              <ExternalLink className="w-3 h-3" />
              Jump to DK component
            </a>
            <a
              href="#aiu-breakdown"
              className="inline-flex items-center gap-1 text-xs text-ink hover:text-ink"
            >
              <ExternalLink className="w-3 h-3" />
              Jump to AIU component
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniBar() {
  return (
    <div className="w-6 h-2 bg-page-muted rounded-full overflow-hidden">
      <Skeleton className="h-full w-1/2 rounded-full" />
    </div>
  );
}

function PromptDKPanel() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-spine-writ" />
        <h4 className="text-sm font-semibold text-ink">Domain Knowledge</h4>
      </div>

      {/* Detected concepts */}
      <div>
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          Detected Concepts
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          <SkeletonChip />
          <SkeletonChip className="w-24" />
          <SkeletonChip className="w-16" />
        </div>
      </div>

      {/* Depth signals */}
      <div>
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          Depth Signals
        </span>
        <div className="mt-2 space-y-1">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>

      {/* Cognitive label */}
      <div>
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          Cognitive Label
        </span>
        <div className="mt-2">
          <SkeletonChip className="bg-spine-writ/20" />
        </div>
      </div>

      {/* Reasoning markers */}
      <div>
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          Reasoning Markers
        </span>
        <div className="mt-2 space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>

      {/* Per-prompt insight summary */}
      <div>
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          Insight Summary
        </span>
        <div className="mt-2">
          <SkeletonText lines={2} />
        </div>
      </div>

      {/* Contribution notes */}
      <div>
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          Contribution Notes
        </span>
        <div className="mt-2 space-y-1">
          <div className="flex items-start gap-2">
            <span className="text-ink-subtle">•</span>
            <Skeleton className="h-3 w-full" />
          </div>
          <div className="flex items-start gap-2">
            <span className="text-ink-subtle">•</span>
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PromptAIUPanel() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Cpu className="w-4 h-4 text-ink" />
        <h4 className="text-sm font-semibold text-ink">AI Usage</h4>
      </div>

      {/* Intent */}
      <div>
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          Intent
        </span>
        <div className="mt-2">
          <SkeletonChip className="bg-ink/20" />
        </div>
      </div>

      {/* Control signals */}
      <div>
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          Control Signals
        </span>
        <div className="mt-2 space-y-1">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>

      {/* Iteration role */}
      <div>
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          Iteration Role
        </span>
        <div className="mt-2">
          <SkeletonChip />
        </div>
      </div>

      {/* Verification signals */}
      <div>
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          Verification Signals
        </span>
        <div className="mt-2 text-xs text-ink-subtle italic">
          Often empty
        </div>
      </div>

      {/* Integrity flags */}
      <div>
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          Integrity Flags
        </span>
        <div className="mt-2">
          <SkeletonChip className="w-12" />
        </div>
      </div>

      {/* Per-prompt insight summary */}
      <div>
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          Insight Summary
        </span>
        <div className="mt-2">
          <SkeletonText lines={2} />
        </div>
      </div>

      {/* Suggested interpretation */}
      <div>
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          Suggested Interpretation
        </span>
        <div className="mt-2">
          <SkeletonText lines={1} />
        </div>
      </div>
    </div>
  );
}
