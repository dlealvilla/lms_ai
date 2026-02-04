import { Badge } from './Badge';
import { BookOpen } from 'lucide-react';

type CourseStatus = 'open' | 'closed' | 'completed';

interface CourseCardProps {
  title: string;
  meta: string;
  status: CourseStatus;
  progress?: string;
  score?: string;
  onClick?: () => void;
}

export function CourseCard({ title, meta, status, progress, score, onClick }: CourseCardProps) {
  const statusLabels: Record<CourseStatus, string> = {
    open: 'Open',
    closed: 'Closed',
    completed: 'Completed',
  };

  const statusVariants: Record<CourseStatus, 'open' | 'closed' | 'success'> = {
    open: 'open',
    closed: 'closed',
    completed: 'success',
  };

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center justify-between
        p-4
        bg-white/70 backdrop-blur-sm
        rounded-wm-lg
        border border-wm-border
        hover:border-wm-blue-300 hover:shadow-wm-elev1
        transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
      `.trim().replace(/\s+/g, ' ')}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="
          w-12 h-12 
          rounded-wm-md 
          bg-gradient-to-br from-wm-blue-100 to-wm-blue-50 
          flex items-center justify-center
        ">
          <BookOpen className="w-6 h-6 text-wm-blue-500" />
        </div>

        {/* Content */}
        <div>
          <p className="font-medium text-wm-navy-900">{title}</p>
          <p className="text-small text-wm-muted">{meta}</p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {progress && (
          <span className="text-small text-wm-muted">{progress}</span>
        )}
        {score && (
          <span className="text-small font-medium text-wm-navy-900">{score}</span>
        )}
        <Badge variant={statusVariants[status]}>
          {statusLabels[status]}
        </Badge>
      </div>
    </div>
  );
}
