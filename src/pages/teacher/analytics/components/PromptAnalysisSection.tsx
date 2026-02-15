import { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronRight, Brain, Cpu, ExternalLink } from 'lucide-react';
import { Skeleton, SkeletonText, SkeletonChip } from './Skeleton';

export function PromptAnalysisSection() {
  return (
    <section id="prompt-analysis" className="scroll-mt-24">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Prompt-Level Analysis
        </h2>
        <p className="text-sm text-gray-500 mt-1">
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
    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center">
      <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <h3 className="text-sm font-medium text-gray-600">No prompts to display</h3>
      <p className="text-sm text-gray-400 mt-1">
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
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Collapsed Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors text-left"
      >
        {/* Prompt number */}
        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">#{promptNumber}</span>
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
            <SkeletonChip className="w-14 bg-blue-100" />
            {/* Intent */}
            <SkeletonChip className="w-18 bg-amber-100" />
          </div>

          {/* Contribution mini-indicators */}
          <div className="flex items-center gap-6">
            {/* DK contributions */}
            <div className="flex items-center gap-2">
              <Brain className="w-3 h-3 text-blue-500" />
              <div className="flex gap-1">
                <MiniBar />
                <MiniBar />
                <MiniBar />
                <MiniBar />
              </div>
            </div>

            {/* AIU contributions */}
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-amber-500" />
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
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {/* Left: Domain Knowledge */}
            <PromptDKPanel />

            {/* Right: AI Usage */}
            <PromptAIUPanel />
          </div>

          {/* Links row */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-4">
            <a
              href="#dk-breakdown"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="w-3 h-3" />
              Jump to DK component
            </a>
            <a
              href="#aiu-breakdown"
              className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700"
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
    <div className="w-6 h-2 bg-gray-100 rounded-full overflow-hidden">
      <Skeleton className="h-full w-1/2 rounded-full" />
    </div>
  );
}

function PromptDKPanel() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-blue-600" />
        <h4 className="text-sm font-semibold text-gray-900">Domain Knowledge</h4>
      </div>

      {/* Detected concepts */}
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
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
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Depth Signals
        </span>
        <div className="mt-2 space-y-1">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>

      {/* Cognitive label */}
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Cognitive Label
        </span>
        <div className="mt-2">
          <SkeletonChip className="bg-blue-100" />
        </div>
      </div>

      {/* Reasoning markers */}
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Reasoning Markers
        </span>
        <div className="mt-2 space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>

      {/* Per-prompt insight summary */}
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Insight Summary
        </span>
        <div className="mt-2">
          <SkeletonText lines={2} />
        </div>
      </div>

      {/* Contribution notes */}
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Contribution Notes
        </span>
        <div className="mt-2 space-y-1">
          <div className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <Skeleton className="h-3 w-full" />
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
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
        <Cpu className="w-4 h-4 text-amber-600" />
        <h4 className="text-sm font-semibold text-gray-900">AI Usage</h4>
      </div>

      {/* Intent */}
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Intent
        </span>
        <div className="mt-2">
          <SkeletonChip className="bg-amber-100" />
        </div>
      </div>

      {/* Control signals */}
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Control Signals
        </span>
        <div className="mt-2 space-y-1">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>

      {/* Iteration role */}
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Iteration Role
        </span>
        <div className="mt-2">
          <SkeletonChip />
        </div>
      </div>

      {/* Verification signals */}
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Verification Signals
        </span>
        <div className="mt-2 text-xs text-gray-400 italic">
          Often empty
        </div>
      </div>

      {/* Integrity flags */}
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Integrity Flags
        </span>
        <div className="mt-2">
          <SkeletonChip className="w-12" />
        </div>
      </div>

      {/* Per-prompt insight summary */}
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Insight Summary
        </span>
        <div className="mt-2">
          <SkeletonText lines={2} />
        </div>
      </div>

      {/* Suggested interpretation */}
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Suggested Interpretation
        </span>
        <div className="mt-2">
          <SkeletonText lines={1} />
        </div>
      </div>
    </div>
  );
}
