import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  spinePaletteForCode,
  spineHeight,
  spineWidth,
} from '@/lib/bookshelf/spineColors';

export interface BookSpineProps {
  code: string;
  title?: string;
  href?: string;
  status?: 'OPEN' | 'CLOSED' | 'CURRENT' | 'PAST';
  muted?: boolean;
  showFoil?: boolean;
  className?: string;
  onClick?: () => void;
}

/** Folio slim color-bar spine (horizontal list / rail) */
export function BookSpine({
  code,
  title,
  href,
  status,
  muted,
  className,
  onClick,
}: BookSpineProps) {
  const palette = spinePaletteForCode(code);
  const height = spineHeight(code, 48, 20);
  const width = spineWidth(code);
  const isClosed = status === 'CLOSED' || status === 'PAST' || muted;

  const inner = (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-[10px] cursor-pointer hover:bg-[#F3F2EE]',
        isClosed && 'opacity-55',
        className,
      )}
      onClick={onClick}
      role={href || onClick ? 'button' : undefined}
    >
      <span
        className="rounded-lg shrink-0"
        style={{ width, height, background: palette.mid }}
        aria-hidden
      />
      <span className="min-w-0">
        <span className="block text-[11px] font-bold tracking-[0.06em] text-[#888]">{code}</span>
        {title && <span className="block text-[13px] font-semibold text-ink truncate">{title}</span>}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-[10px]">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function NewCourseSpine({ onClick, href }: { onClick?: () => void; href?: string }) {
  const body = (
    <div
      className="flex items-center justify-center rounded-[10px] border border-dashed border-[#E8E6E1] text-ink-subtle text-xs font-semibold cursor-pointer hover:border-ink hover:text-ink transition-colors px-4 py-6"
      onClick={onClick}
    >
      + New course
    </div>
  );
  if (href) return <Link to={href}>{body}</Link>;
  return body;
}

export function DecorativeSpine({
  label,
  color,
  height = 56,
  width = 8,
}: {
  label: string;
  color: string;
  height?: number;
  width?: number;
}) {
  return (
    <div
      className="rounded-lg shrink-0"
      style={{ width, height, background: color }}
      title={label}
      aria-hidden
    />
  );
}
