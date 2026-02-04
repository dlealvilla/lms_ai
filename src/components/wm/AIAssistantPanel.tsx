import { Sparkles, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface AIAssistantPanelProps {
  prompt: string;
  suggestions: string[];
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export function AIAssistantPanel({ 
  prompt, 
  suggestions, 
  ctaLabel = 'Improve Answer',
  onCtaClick 
}: AIAssistantPanelProps) {
  return (
    <div className="wm-glass p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-wm-blue-100 to-wm-blue-200 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-wm-blue-500" />
        </div>
        <span className="font-semibold text-wm-navy-900">AI Assistant</span>
      </div>

      {/* Prompt */}
      <div className="bg-white/60 rounded-wm-btn p-4 mb-4 border border-wm-border/50">
        <p className="text-small text-wm-navy-900 leading-relaxed">
          {prompt}
        </p>
      </div>

      {/* Suggestions */}
      <div className="mb-5">
        <p className="text-label text-wm-muted mb-3 font-medium">Suggestions:</p>
        <ul className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-wm-gold-400 mt-0.5 flex-shrink-0" />
              <span className="text-small text-wm-navy-800">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <Button 
        variant="secondary" 
        size="md" 
        className="w-full"
        onClick={onCtaClick}
      >
        {ctaLabel}
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
