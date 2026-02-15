import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded h-4',
        variant === 'rectangular' && 'rounded-md',
        className
      )}
    />
  );
}

export function SkeletonText({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn('h-4', i === lines - 1 && lines > 1 && 'w-3/4')}
        />
      ))}
    </div>
  );
}

export function SkeletonScore({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-baseline gap-1', className)}>
      <Skeleton className="h-10 w-12" />
      <span className="text-gray-400">/</span>
      <Skeleton className="h-6 w-8" />
    </div>
  );
}

export function SkeletonBar({ className }: { className?: string }) {
  return (
    <div className={cn('h-2 bg-gray-100 rounded-full overflow-hidden', className)}>
      <Skeleton className="h-full w-1/2 rounded-full" />
    </div>
  );
}

export function SkeletonChip({ className }: { className?: string }) {
  return <Skeleton className={cn('h-6 w-20 rounded-full', className)} />;
}
