import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

type BrandLockupProps = {
  size?: 'sm' | 'md' | 'lg';
  /** When true, icon sits in a dark square (sidebar / header). */
  withIcon?: boolean;
  className?: string;
  /** Invert for dark backgrounds — not used in Folio shell today. */
  light?: boolean;
};

/**
 * Product brand mark. Never shows internal design-system names.
 * Primary: WildMind · Subtitle: AI for Education
 */
export function BrandLockup({ size = 'md', withIcon = true, className }: BrandLockupProps) {
  const title =
    size === 'lg' ? 'text-[15px]' : size === 'sm' ? 'text-sm' : 'text-sm';
  const sub = size === 'lg' ? 'text-[11px]' : 'text-[11px]';
  const iconBox =
    size === 'lg' ? 'w-9 h-9 rounded-[9px]' : size === 'sm' ? 'w-8 h-8 rounded-[9px]' : 'w-8 h-8 rounded-[9px]';
  const icon = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <div className={cn('flex items-center gap-2.5 min-w-0', className)}>
      {withIcon && (
        <div className={cn(iconBox, 'bg-ink text-white flex items-center justify-center shrink-0')}>
          <GraduationCap className={icon} aria-hidden />
        </div>
      )}
      <div className="min-w-0 leading-tight">
        <div className={cn('font-semibold text-ink truncate', title)}>WildMind</div>
        <div className={cn('text-[#999] truncate', sub)}>AI for Education</div>
      </div>
    </div>
  );
}
