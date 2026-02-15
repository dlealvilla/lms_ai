import { useState } from 'react';
import { ChevronDown, ChevronRight, Brain, Cpu, Info, Check, X } from 'lucide-react';
import type { AnalyticsData } from '../mockAnalyticsData';

interface BreakdownSectionProps {
  data: AnalyticsData | null;
}

export function BreakdownSection({ data }: BreakdownSectionProps) {
  return (
    <section id="breakdown" className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Detailed Breakdown
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Knowledge Column */}
        <DomainKnowledgeBreakdown data={data} />

        {/* AI Usage Column */}
        <AIUsageBreakdown data={data} />
      </div>

      {/* Educator Override Panel */}
      <EducatorOverridePanel />
    </section>
  );
}

function DomainKnowledgeBreakdown({ data }: { data: AnalyticsData | null }) {
  const dk = data?.domainKnowledge;

  const components = [
    {
      id: 'coverage',
      title: 'Concept Coverage (Breadth)',
      description: 'Measures how many relevant concepts from the domain the student addresses.',
      score: dk?.coverage.score,
      metrics: [
        { label: 'Detected concepts', value: dk?.coverage.detectedConcepts.length ?? 0 },
        { label: 'Missing concepts', value: dk?.coverage.missingConcepts.length ?? 0 },
      ],
      details: dk?.coverage.detectedConcepts,
      detailsLabel: 'Detected Concepts',
    },
    {
      id: 'depth',
      title: 'Concept Depth (Specificity)',
      description: 'Evaluates the level of detail and precision in concept explanations.',
      score: dk?.depth.score,
      metrics: [
        { label: 'Named entities / 100 tokens', value: dk?.depth.namedEntitiesPer100Tokens ?? 0 },
        { label: 'Mechanism prompts', value: dk?.depth.mechanismPrompts ?? 0 },
        { label: 'Conditional reasoning', value: dk?.depth.conditionalReasoningPrompts ?? 0 },
        { label: 'Historiography prompts', value: dk?.depth.historiographyPrompts ?? 0 },
      ],
    },
    {
      id: 'cognitive',
      title: 'Cognitive Complexity',
      description: "Assesses the sophistication of thinking demonstrated (Bloom's taxonomy level).",
      score: dk?.cognitiveComplexity.score,
      metrics: [
        { label: 'Higher-order ratio', value: `${((dk?.cognitiveComplexity.higherOrderRatio ?? 0) * 100).toFixed(0)}%` },
      ],
      distribution: dk?.cognitiveComplexity.distribution,
    },
    {
      id: 'reasoning',
      title: 'Disciplinary Reasoning Structure',
      description: 'Examines whether arguments follow discipline-specific reasoning patterns.',
      score: dk?.disciplinaryReasoning.score,
      flags: [
        { label: 'Causal framing', value: dk?.disciplinaryReasoning.causalFraming },
        { label: 'Extent weighing', value: dk?.disciplinaryReasoning.extentWeighing },
        { label: 'Counterarguments', value: dk?.disciplinaryReasoning.counterarguments },
        { label: 'Historiography', value: dk?.disciplinaryReasoning.historiography },
        { label: 'Multi-factor analysis', value: dk?.disciplinaryReasoning.multiFactorAnalysis },
      ],
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
          score={component.score}
          metrics={component.metrics}
          details={component.details}
          detailsLabel={component.detailsLabel}
          distribution={component.distribution}
          flags={component.flags}
          variant="domain"
        />
      ))}
    </div>
  );
}

function AIUsageBreakdown({ data }: { data: AnalyticsData | null }) {
  const aiu = data?.aiUsage;

  const components = [
    {
      id: 'framing',
      title: 'Task Framing',
      description: 'How well the student defines and structures prompts for the AI.',
      score: aiu?.taskFraming.score,
      flags: [
        { label: 'Thesis requested', value: aiu?.taskFraming.thesisRequested },
        { label: 'Explicit extent framing', value: aiu?.taskFraming.explicitExtentFraming },
        { label: 'Alignment to question', value: aiu?.taskFraming.alignmentToQuestion },
      ],
    },
    {
      id: 'control',
      title: 'Output Control',
      description: 'Ability to guide AI outputs toward desired format and content.',
      score: aiu?.outputControl.score,
      flags: [
        { label: 'Outline first', value: aiu?.outputControl.outlineFirst },
        { label: 'Paragraph segmentation', value: aiu?.outputControl.paragraphSegmentation },
        { label: 'Style constraints', value: aiu?.outputControl.styleConstraints },
        { label: 'Citation formatting', value: aiu?.outputControl.citationFormattingRequested },
      ],
    },
    {
      id: 'iteration',
      title: 'Iteration / Refinement',
      description: 'Evidence of progressive improvement through multiple prompt cycles.',
      score: aiu?.iteration.score,
      metrics: [
        { label: 'Revision cycles', value: aiu?.iteration.revisionCycles ?? 0 },
      ],
      flags: [
        { label: 'Critique loop', value: aiu?.iteration.critiqueLoop },
        { label: 'Increasing specificity', value: aiu?.iteration.increasingSpecificity },
      ],
    },
    {
      id: 'verification',
      title: 'Verification / Epistemic Responsibility',
      description: 'Signs that the student critically evaluates AI outputs.',
      score: aiu?.verification.score,
      flags: [
        { label: 'Counterargument prompt', value: aiu?.verification.counterargumentPrompt },
        { label: 'Accuracy check', value: aiu?.verification.accuracyCheck },
        { label: 'Source request', value: aiu?.verification.sourceRequest },
      ],
    },
    {
      id: 'integrity',
      title: 'Integrity Alignment',
      description: 'Compliance with academic integrity policies (configurable).',
      score: aiu?.integrityAlignment.score,
      metrics: [
        { label: 'Direct substitution prompts', value: aiu?.integrityAlignment.directSubstitutionPrompts ?? 0 },
        { label: 'Fabrication prompts', value: aiu?.integrityAlignment.fabricationPrompts ?? 0 },
      ],
      flags: [
        { label: 'Scaffolding usage', value: aiu?.integrityAlignment.scaffoldingUsage },
      ],
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
          score={component.score}
          metrics={component.metrics}
          flags={component.flags}
          variant="ai"
        />
      ))}
    </div>
  );
}

interface BreakdownCardProps {
  title: string;
  description: string;
  score?: number;
  metrics?: { label: string; value: number | string }[];
  details?: string[];
  detailsLabel?: string;
  distribution?: Record<string, number>;
  flags?: { label: string; value: boolean | string | undefined }[];
  variant: 'domain' | 'ai';
}

function BreakdownCard({
  title,
  description,
  score,
  metrics,
  details,
  detailsLabel,
  distribution,
  flags,
  variant,
}: BreakdownCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const accentBg = variant === 'domain' ? 'bg-blue-500' : 'bg-amber-500';
  const scoreColor = getScoreColor(score ?? 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${accentBg}`} />
          <div className="text-left">
            <h4 className="text-sm font-medium text-gray-900">{title}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-lg font-semibold ${scoreColor}`}>
            {score ?? '—'}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/50 space-y-4">
          {/* What this measures */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Info className="w-3 h-3 text-gray-400" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                What this measures
              </span>
            </div>
            <p className="text-sm text-gray-600">{description}</p>
          </div>

          {/* Metrics */}
          {metrics && metrics.length > 0 && (
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Metrics
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {metrics.map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-gray-100">
                    <span className="text-xs text-gray-600">{metric.label}</span>
                    <span className="text-sm font-medium text-gray-900">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Distribution (for cognitive complexity) */}
          {distribution && (
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Distribution (Bloom's Taxonomy)
              </span>
              <div className="mt-2 flex gap-2">
                {Object.entries(distribution).map(([level, count]) => (
                  <div key={level} className="flex-1 text-center">
                    <div className="text-lg font-semibold text-gray-900">{count}</div>
                    <div className="text-xs text-gray-500">{level}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flags */}
          {flags && flags.length > 0 && (
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Indicators
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {flags.map((flag) => {
                  const isTrue = flag.value === true || flag.value === 'true';
                  const isFalse = flag.value === false || flag.value === 'false';
                  const isString = typeof flag.value === 'string' && !['true', 'false'].includes(flag.value);

                  return (
                    <span
                      key={flag.label}
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                        isTrue
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : isFalse
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {isTrue && <Check className="w-3 h-3" />}
                      {isFalse && <X className="w-3 h-3" />}
                      {flag.label}
                      {isString && `: ${flag.value}`}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details list */}
          {details && details.length > 0 && (
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {detailsLabel || 'Details'}
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {details.map((item, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
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

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-amber-600';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}
