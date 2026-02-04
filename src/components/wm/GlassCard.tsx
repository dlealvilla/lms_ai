import { type HTMLAttributes, type ReactNode } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: ReactNode;
  titleAction?: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function GlassCard({ 
  title,
  titleAction,
  padding = 'md',
  className = '', 
  children, 
  ...props 
}: GlassCardProps) {
  return (
    <div
      className={`wm-glass ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {(title || titleAction) && (
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-wm-border/50">
          {title && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-wm-blue-500" />
              <h3 className="font-semibold text-wm-navy-900">{title}</h3>
            </div>
          )}
          {titleAction}
        </div>
      )}
      {children}
    </div>
  );
}
