import { useState } from 'react';
import { ChevronDown, ChevronRight, Brain, Cpu, Info } from 'lucide-react';
import { Skeleton, SkeletonText, SkeletonBar } from './Skeleton';

export function BreakdownSection() {
  return (
    <section id="breakdown" className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Detailed Breakdown
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Knowledge Column */}
        <DomainKnowledgeBreakdown />

        {/* AI Usage Column */}
        <AIUsageBreakdown />
      </div>

      {/* Educator Override Panel */}
      <EducatorOverridePanel />
    </section>
  );
}

function DomainKnowledgeBreakdown() {
  const components = [
    {
      id: 'coverage',
      title: 'Concept Coverage (Breadth)',
      description: 'Measures how many relevant concepts from the domain the student addresses.',
    },
    {
      id: 'depth',
      title: 'Concept Depth (Specificity)',
      description: 'Evaluates the level of detail and precision in concept explanations.',
    },
    {
      id: 'cognitive',
      title: 'Cognitive Complexity',
      description: 'Assesses the sophistication of thinking demonstrated (Bloom\'s taxonomy level).',
    },
    {
      id: 'reasoning',
      title: 'Disciplinary Reasoning Structure',
      description: 'Examines whether arguments follow discipline-specific reasoning patterns.',
    },
  ];

  return (
    <div className="space-y-4" id="dk-breakdown">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">Domain Knowledge</h3>
      </div>

      {components.map((component) => (
        <BreakdownCard
          key={component.id}
          title={component.title}
          description={component.description}
          variant="domain"
        />
      ))}
    </div>
  );
}

function AIUsageBreakdown() {
  const components = [
    {
      id: 'framing',
      title: 'Task Framing',
      description: 'How well the student defines and structures prompts for the AI.',
    },
    {
      id: 'control',
      title: 'Output Control',
      description: 'Ability to guide AI outputs toward desired format and content.',
    },
    {
      id: 'iteration',
      title: 'Iteration / Refinement',
      description: 'Evidence of progressive improvement through multiple prompt cycles.',
    },
    {
      id: 'verification',
      title: 'Verification / Epistemic Responsibility',
      description: 'Signs that the student critically evaluates AI outputs.',
    },
    {
      id: 'integrity',
      title: 'Integrity Alignment',
      description: 'Compliance with academic integrity policies (configurable).',
    },
  ];

  return (
    <div className="space-y-4" id="aiu-breakdown">
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-5 h-5 text-amber-600" />
        <h3 className="text-lg font-medium text-gray-900">AI Usage Skill</h3>
      </div>

      {components.map((component) => (
        <BreakdownCard
          key={component.id}
          title={component.title}
          description={component.description}
          variant="ai"
        />
      ))}
    </div>
  );
}

interface BreakdownCardProps {
  title: string;
  description: string;
  variant: 'domain' | 'ai';
}

function BreakdownCard({ title, description, variant }: BreakdownCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const accentColor = variant === 'domain' ? 'blue' : 'amber';

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full bg-${accentColor}-500`} />
          <div className="text-left">
            <h4 className="text-sm font-medium text-gray-900">{title}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-12" />
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/50">
          {/* What this measures */}
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-1">
              <Info className="w-3 h-3 text-gray-400" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                What this measures
              </span>
            </div>
            <p className="text-sm text-gray-600">{description}</p>
          </div>

          {/* Intermediate metrics */}
          <div className="mb-4">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Intermediate Metrics
            </span>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-8" />
              </div>
              <SkeletonBar />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-8" />
              </div>
              <SkeletonBar />
            </div>
          </div>

          {/* Evidence references */}
          <div className="mb-4">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Evidence References
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                Prompt #—
              </span>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                Prompt #—
              </span>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                Prompt #—
              </span>
            </div>
          </div>

          {/* Notes / caveats */}
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Notes / Caveats
            </span>
            <div className="mt-1">
              <SkeletonText lines={1} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EducatorOverridePanel() {
  return (
    <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-xl p-6">
      <h4 className="text-sm font-semibold text-blue-900 mb-4">
        Educator Override (Optional)
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DK Override */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Domain Knowledge Rating
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              disabled
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-not-allowed"
            />
            <span className="text-sm text-gray-400 w-12">— / 100</span>
          </div>
        </div>

        {/* AIU Override */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            AI Usage Skill Rating
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              disabled
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-not-allowed"
            />
            <span className="text-sm text-gray-400 w-12">— / 100</span>
          </div>
        </div>
      </div>

      {/* Notes textarea */}
      <div className="mt-4">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Educator Notes
        </label>
        <textarea
          disabled
          placeholder="Add notes about this assessment attempt..."
          className="w-full h-24 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white resize-none cursor-not-allowed"
        />
      </div>
    </div>
  );
}
