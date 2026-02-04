import { type HTMLAttributes } from 'react';

type BadgeVariant = 'open' | 'closed' | 'completed' | 'neutral';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  open: 'bg-wm-blue-100 text-wm-blue-600 border-wm-blue-200',
  closed: 'bg-wm-coral-400/15 text-wm-coral-600 border-wm-coral-400/25',
  completed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  neutral: 'bg-wm-canvas text-wm-muted border-wm-border',
};

export function Badge({ variant = 'neutral', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1
        text-label font-semibold
        rounded-wm-pill
        border
        ${variantStyles[variant]}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {children}
    </span>
  );
}
