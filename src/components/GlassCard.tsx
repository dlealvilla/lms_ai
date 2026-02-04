import { type HTMLAttributes, type ReactNode } from 'react';

type CardVariant = 'default' | 'compact' | 'highlight';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  header?: ReactNode;
  footer?: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'p-6',
  compact: 'p-4',
  highlight: 'p-6 ring-1 ring-wm-blue-200',
};

export function GlassCard({ 
  variant = 'default', 
  header, 
  footer, 
  className = '', 
  children, 
  ...props 
}: GlassCardProps) {
  return (
    <div
      className={`wm-glass ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {header && (
        <div className="mb-4 pb-4 border-b border-wm-border/50">
          {header}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="mt-4 pt-4 border-t border-wm-border/50">
          {footer}
        </div>
      )}
    </div>
  );
}
