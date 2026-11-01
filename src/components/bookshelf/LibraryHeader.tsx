import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { cn } from '@/lib/utils';

export function LibraryHeader({
  className,
  showUser = true,
  compact = false,
}: {
  className?: string;
  showUser?: boolean;
  compact?: boolean;
}) {
  const { user, logout } = useAuth();

  const home =
    user?.role === 'TEACHER'
      ? '/teacher/home'
      : user?.role === 'ADMIN'
        ? '/admin'
        : user?.role === 'STUDENT'
          ? '/student/home'
          : '/';

  return (
    <header
      className={cn(
        'flex justify-between items-center',
        compact ? 'mb-4' : 'mb-8',
        className,
      )}
    >
      <Link to={home} className="flex items-center gap-3 group">
        <div
          className={cn(
            'flex items-center justify-center rounded-[9px] bg-ink text-white',
            compact ? 'w-8 h-8' : 'w-9 h-9',
          )}
        >
          <GraduationCap className={compact ? 'h-4 w-4' : 'h-4.5 w-4.5'} />
        </div>
        <div>
          <div className={cn('font-semibold text-ink', compact ? 'text-sm' : 'text-[15px]')}>
            Wildmind
          </div>
          {!compact && (
            <div className="text-[11px] text-[#999]">Library · Folio</div>
          )}
        </div>
      </Link>

      {showUser && user && (
        <div className="text-right">
          <div className="font-semibold text-sm text-ink">{user.name}</div>
          <div className="text-xs text-ink-subtle flex items-center justify-end gap-3">
            <span>{user.role}</span>
            <button
              type="button"
              onClick={logout}
              className="hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
