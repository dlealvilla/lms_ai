import { Brain, Cpu } from 'lucide-react';
import { Skeleton, SkeletonBar, SkeletonText, SkeletonChip } from './Skeleton';

export function ScoreSummaryCards() {
  return (
    <section id="overview" className="scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DomainKnowledgeCard />
        <AIUsageCard />
      </div>

      {/* Key Highlights */}
      <HighlightsRow />
    </section>
  );
}

function DomainKnowledgeCard() {
  const subscores = [
    'Concept Coverage',
    'Concept Depth / Specificity',
    'Cognitive Complexity',
    'Disciplinary Reasoning Structure',
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Brain className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            Domain Knowledge Integration
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            How well the student demonstrates subject matter understanding
          </p>
        </div>
      </div>

      {/* Large score */}
      <div className="mt-6 flex items-baseline gap-2">
        <Skeleton className="h-12 w-16" />
        <span className="text-2xl text-gray-400 font-light">/</span>
        <span className="text-2xl text-gray-400">100</span>
      </div>

      {/* Summary text */}
      <div className="mt-4">
        <SkeletonText lines={2} />
      </div>

      {/* Subscore bars */}
      <div className="mt-6 space-y-4">
        {subscores.map((subscore) => (
          <div key={subscore}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">{subscore}</span>
              <Skeleton className="h-4 w-8" />
            </div>
            <SkeletonBar />
          </div>
        ))}
      </div>
    </div>
  );
}

function AIUsageCard() {
  const subscores = [
    'Task Framing',
    'Output Control',
    'Iteration / Refinement',
    'Verification / Epistemic Hygiene',
    'Integrity Alignment',
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-amber-50 rounded-lg">
          <Cpu className="w-6 h-6 text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            AI Usage Skill
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            How effectively the student leverages AI assistance
          </p>
        </div>
      </div>

      {/* Large score */}
      <div className="mt-6 flex items-baseline gap-2">
        <Skeleton className="h-12 w-16" />
        <span className="text-2xl text-gray-400 font-light">/</span>
        <span className="text-2xl text-gray-400">100</span>
      </div>

      {/* Summary text */}
      <div className="mt-4">
        <SkeletonText lines={2} />
      </div>

      {/* Subscore bars */}
      <div className="mt-6 space-y-4">
        {subscores.map((subscore) => (
          <div key={subscore}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">{subscore}</span>
              <Skeleton className="h-4 w-8" />
            </div>
            <SkeletonBar />
          </div>
        ))}
      </div>
    </div>
  );
}

function HighlightsRow() {
  const highlights = [
    { type: 'strength', label: 'Strength 1' },
    { type: 'strength', label: 'Strength 2' },
    { type: 'gap', label: 'Gap 1' },
    { type: 'flag', label: 'Flag 1' },
  ];

  return (
    <div className="mt-6 bg-gray-50 rounded-xl p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Key Highlights</h4>
      <div className="flex flex-wrap gap-2">
        {highlights.map((_, index) => (
          <SkeletonChip key={index} className="w-24" />
        ))}
      </div>
    </div>
  );
}
