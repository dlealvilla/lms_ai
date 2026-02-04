interface ProgressProps {
  value: number;
  max: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function Progress({ value, max, showLabel = true, size = 'md' }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const heightStyles = {
    sm: 'h-1',
    md: 'h-1.5',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 bg-wm-border/60 rounded-full overflow-hidden ${heightStyles[size]}`}>
        <div 
          className="h-full bg-gradient-to-r from-wm-blue-400 to-wm-blue-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-small text-wm-muted font-medium tabular-nums min-w-[48px] text-right">
          {value}/{max}
        </span>
      )}
    </div>
  );
}
