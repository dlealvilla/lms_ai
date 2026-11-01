import { Link } from 'react-router-dom';
import { BrandLockup } from '@/components/BrandLockup';
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
      <Link to={home} className="group">
        <BrandLockup size={compact ? 'sm' : 'lg'} />
      </Link>

      {showUser && user && (
        <div className="text-right">
          <div className="font-semibold text-sm text-ink">{user.name}</div>
          <div className="text-xs text-ink-subtle flex items-center justify-end gap-3">
            <span>{user.role}</span>
            <button type="button" onClick={logout} className="hover:text-ink">
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
