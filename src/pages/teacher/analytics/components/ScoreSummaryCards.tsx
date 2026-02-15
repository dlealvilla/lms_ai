import { Brain, Cpu } from 'lucide-react';
import type { AnalyticsData } from '../mockAnalyticsData';

interface ScoreSummaryCardsProps {
  data: AnalyticsData | null;
}

export function ScoreSummaryCards({ data }: ScoreSummaryCardsProps) {
  return (
    <section id="overview" className="scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DomainKnowledgeCard data={data} />
        <AIUsageCard data={data} />
      </div>

      {/* Key Highlights */}
      <HighlightsRow data={data} />
    </section>
  );
}

function DomainKnowledgeCard({ data }: { data: AnalyticsData | null }) {
  const dk = data?.domainKnowledge;

  const subscores = [
    { label: 'Concept Coverage', score: dk?.coverage.score },
    { label: 'Concept Depth / Specificity', score: dk?.depth.score },
    { label: 'Cognitive Complexity', score: dk?.cognitiveComplexity.score },
    { label: 'Disciplinary Reasoning Structure', score: dk?.disciplinaryReasoning.score },
  ];

  const composite = dk?.composite ?? 0;
  const scoreColor = getScoreColor(composite);

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
        <span className={`text-5xl font-bold ${scoreColor}`}>
          {dk?.composite ?? '—'}
        </span>
        <span className="text-2xl text-gray-400 font-light">/</span>
        <span className="text-2xl text-gray-400">100</span>
      </div>

      {/* Summary text */}
      <div className="mt-4 text-sm text-gray-600">
        {dk ? (
          <p>
            Covered {dk.coverage.detectedConcepts.length} key concepts with{' '}
            {dk.cognitiveComplexity.higherOrderRatio > 0.5 ? 'strong' : 'moderate'}{' '}
            higher-order thinking demonstrated.
          </p>
        ) : (
          <p className="text-gray-400">No data available</p>
        )}
      </div>

      {/* Subscore bars */}
      <div className="mt-6 space-y-4">
        {subscores.map((subscore) => (
          <div key={subscore.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">{subscore.label}</span>
              <span className={`text-sm font-medium ${getScoreColor(subscore.score ?? 0)}`}>
                {subscore.score ?? '—'}
              </span>
            </div>
            <ScoreBar score={subscore.score ?? 0} variant="blue" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AIUsageCard({ data }: { data: AnalyticsData | null }) {
  const aiu = data?.aiUsage;

  const subscores = [
    { label: 'Task Framing', score: aiu?.taskFraming.score },
    { label: 'Output Control', score: aiu?.outputControl.score },
    { label: 'Iteration / Refinement', score: aiu?.iteration.score },
    { label: 'Verification / Epistemic Hygiene', score: aiu?.verification.score },
    { label: 'Integrity Alignment', score: aiu?.integrityAlignment.score },
  ];

  const composite = aiu?.composite ?? 0;
  const scoreColor = getScoreColor(composite);

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
        <span className={`text-5xl font-bold ${scoreColor}`}>
          {aiu?.composite ?? '—'}
        </span>
        <span className="text-2xl text-gray-400 font-light">/</span>
        <span className="text-2xl text-gray-400">100</span>
      </div>

      {/* Summary text */}
      <div className="mt-4 text-sm text-gray-600">
        {aiu ? (
          <p>
            {aiu.iteration.revisionCycles} revision cycles with{' '}
            {aiu.iteration.critiqueLoop ? 'active' : 'no'} critique loop.{' '}
            {aiu.verification.score >= 60 ? 'Good' : 'Limited'} verification behaviour.
          </p>
        ) : (
          <p className="text-gray-400">No data available</p>
        )}
      </div>

      {/* Subscore bars */}
      <div className="mt-6 space-y-4">
        {subscores.map((subscore) => (
          <div key={subscore.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">{subscore.label}</span>
              <span className={`text-sm font-medium ${getScoreColor(subscore.score ?? 0)}`}>
                {subscore.score ?? '—'}
              </span>
            </div>
            <ScoreBar score={subscore.score ?? 0} variant="amber" />
          </div>
        ))}
      </div>
    </div>
  );
}

function HighlightsRow({ data }: { data: AnalyticsData | null }) {
  const insights = data?.summaryInsights;

  return (
    <div className="mt-6 bg-gray-50 rounded-xl p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Key Highlights</h4>
      <div className="flex flex-wrap gap-2">
        {/* Strengths */}
        {insights?.strengths.slice(0, 3).map((strength, i) => (
          <span
            key={`strength-${i}`}
            className="px-3 py-1.5 text-sm bg-green-50 text-green-700 border border-green-200 rounded-full"
          >
            ✓ {strength}
          </span>
        ))}
        {/* Gaps */}
        {insights?.gaps.slice(0, 2).map((gap, i) => (
          <span
            key={`gap-${i}`}
            className="px-3 py-1.5 text-sm bg-amber-50 text-amber-700 border border-amber-200 rounded-full"
          >
            ⚠ {gap}
          </span>
        ))}
        {!insights && (
          <span className="text-sm text-gray-400">No highlights available</span>
        )}
      </div>
    </div>
  );
}

// Helper components
function ScoreBar({ score, variant }: { score: number; variant: 'blue' | 'amber' }) {
  const bgColor = variant === 'blue' ? 'bg-blue-500' : 'bg-amber-500';
  const trackColor = variant === 'blue' ? 'bg-blue-100' : 'bg-amber-100';

  return (
    <div className={`h-2 ${trackColor} rounded-full overflow-hidden`}>
      <div
        className={`h-full ${bgColor} rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
      />
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-amber-600';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}
