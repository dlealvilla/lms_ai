import { cn } from '@/lib/utils';

/** Folio hairline divider (replaces wood shelf board) */
export function ShelfBoard({ className }: { className?: string }) {
  return (
    <div
      className={cn('h-px w-full bg-[#E8E6E1]', className)}
      aria-hidden
    />
  );
}
