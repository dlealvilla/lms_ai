import { BookOpen } from 'lucide-react';
import { Badge } from './Badge';
import { Progress } from './Progress';

type CourseStatus = 'open' | 'closed' | 'completed';

interface CourseCardProps {
  title: string;
  meta: string;
  status: CourseStatus;
  progress?: { value: number; max: number };
  score?: string;
  compact?: boolean;
  onClick?: () => void;
}

const statusLabels: Record<CourseStatus, string> = {
  open: 'Open',
  closed: 'Closed',
  completed: 'Completed',
};

export function CourseCard({ 
  title, 
  meta, 
  status, 
  progress, 
  score,
  compact = false,
  onClick 
}: CourseCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-4
        ${compact ? 'p-3' : 'p-4'}
        bg-white/70 backdrop-blur-sm
        rounded-wm-btn
        border border-wm-border/80
        hover:border-wm-blue-200 hover:bg-white/90 hover:shadow-wm-sm
        transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
      `.replace(/\s+/g, ' ').trim()}
    >
      {/* Icon */}
      <div className={`
        ${compact ? 'w-10 h-10' : 'w-12 h-12'}
        rounded-wm-btn flex-shrink-0
        bg-gradient-to-br from-wm-blue-50 to-wm-blue-100
        border border-wm-blue-200/50
        flex items-center justify-center
      `}>
        <BookOpen className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} text-wm-blue-500`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-wm-navy-900 truncate ${compact ? 'text-small' : ''}`}>
          {title}
        </p>
        <p className="text-label text-wm-muted truncate">{meta}</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {progress && (
          <div className="hidden sm:block w-24">
            <Progress value={progress.value} max={progress.max} size="sm" />
          </div>
        )}
        {score && (
          <span className="text-small font-semibold text-wm-navy-900 tabular-nums">
            {score}
          </span>
        )}
        <Badge variant={status}>{statusLabels[status]}</Badge>
      </div>
    </div>
  );
}
