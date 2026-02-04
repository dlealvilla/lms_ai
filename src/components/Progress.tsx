interface ProgressProps {
  value: number;
  max: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function Progress({ value, max, showLabel = true, size = 'md' }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 bg-wm-border rounded-wm-full overflow-hidden ${sizeStyles[size]}`}>
        <div 
          className="h-full bg-gradient-to-r from-wm-blue-400 to-wm-blue-500 rounded-wm-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-small text-wm-muted font-medium tabular-nums">
          {value}/{max}
        </span>
      )}
    </div>
  );
}
