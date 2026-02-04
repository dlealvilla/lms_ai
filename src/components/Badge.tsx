import { type HTMLAttributes } from 'react';

type BadgeVariant = 'info' | 'success' | 'warning' | 'neutral' | 'open' | 'closed';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  info: 'bg-wm-blue-100 text-wm-blue-600 border-wm-blue-200',
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  warning: 'bg-wm-gold-100 text-wm-gold-600 border-wm-gold-200',
  neutral: 'bg-wm-canvas text-wm-muted border-wm-border',
  open: 'bg-wm-blue-100 text-wm-blue-600 border-wm-blue-200',
  closed: 'bg-wm-coral-400/20 text-wm-coral-600 border-wm-coral-400/30',
};

export function Badge({ variant = 'neutral', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1
        text-label font-medium
        rounded-wm-full
        border
        ${variantStyles[variant]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
    </span>
  );
}
