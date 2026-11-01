import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { BrandLockup } from '@/components/BrandLockup';
import { useAuth } from '@/lib/auth/AuthContext';
import { cn } from '@/lib/utils';
import { spineColor } from '@/lib/bookshelf/spineColors';

/** Folio shell: optional slim spine rail + main content */
export function LibraryShell({
  children,
  className,
  contentClassName,
  showHeader = true,
  compactHeader = false,
  shelfCourses,
  activeCourseId,
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  showHeader?: boolean;
  compactHeader?: boolean;
  shelfCourses?: { id: string; code: string; title?: string; href?: string }[];
  activeCourseId?: string;
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

  const initials = (() => {
    if (!user?.name) return 'U';
    const titles = new Set(['dr', 'dr.', 'mr', 'mr.', 'mrs', 'mrs.', 'ms', 'ms.', 'prof', 'prof.']);
    const parts = user.name.trim().split(/\s+/).filter((p) => !titles.has(p.toLowerCase()));
    const src = parts.length ? parts : user.name.trim().split(/\s+/);
    return src.map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
  })();

  const showWideRail = Boolean(shelfCourses && shelfCourses.length > 0);

  return (
    <div className={cn('min-h-screen bg-[#FAFAF8] text-ink flex', className)}>
      {/* Slim or wide Folio shelf rail */}
      <aside
        className={cn(
          'shrink-0 border-r border-[#E8E6E1] bg-white flex flex-col',
          showWideRail ? 'w-[280px] px-4 py-6' : 'w-[72px] py-7 items-center',
        )}
        aria-label="Shelf navigation"
      >
        {showWideRail ? (
          <>
            <Link to={home} className="flex items-center gap-2.5 px-2 pb-5">
              <BrandLockup size="sm" />
            </Link>
            <div className="text-[11px] font-semibold tracking-[0.08em] text-[#AAA] px-3.5 pb-1.5">
              SHELF
            </div>
            <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
              {shelfCourses!.map((c) => {
                const active = c.id === activeCourseId;
                return (
                  <Link
                    key={c.id}
                    to={c.href || '#'}
                    className={cn(
                      'flex items-center gap-3.5 px-3.5 py-2.5 rounded-[10px] transition-colors',
                      active ? 'bg-[#F3F2EE]' : 'hover:bg-[#FAFAF8]',
                    )}
                  >
                    <span
                      className="w-2 rounded-lg shrink-0"
                      style={{ height: 40, background: spineColor(c.code) }}
                      aria-hidden
                    />
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold tracking-[0.06em] text-[#888]">
                        {c.code}
                      </span>
                      {c.title && (
                        <span className="block text-[13px] font-semibold text-ink truncate">
                          {c.title}
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </nav>
            {user && (
              <div className="mt-4 p-3 rounded-[10px] bg-[#FAFAF8] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8E6E1] text-[11px] font-bold flex items-center justify-center text-[#555]">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold truncate">{user.name}</div>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-[11px] text-[#999] hover:text-ink"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <Link
              to={home}
              className="w-9 h-9 rounded-[10px] bg-ink text-white flex items-center justify-center mb-4"
              aria-label="Home"
            >
              <GraduationCap className="h-4 w-4" />
            </Link>
            <div className="flex flex-col items-center gap-2.5 flex-1">
              <span className="w-2 h-14 rounded-[2px] bg-[#C45C4A]" aria-hidden />
              <span className="w-2 h-[72px] rounded-[2px] bg-[#3D6B9A]" aria-hidden />
              <span className="w-2 h-12 rounded-[2px] bg-[#4A7A52] opacity-45" aria-hidden />
            </div>
            {user && (
              <div
                className="w-7 h-7 rounded-full bg-[#E8E6E1] text-[11px] font-bold flex items-center justify-center text-[#555]"
                title={user.name}
              >
                {initials}
              </div>
            )}
          </>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {showHeader && !showWideRail && (
          <header
            className={cn(
              'flex justify-between items-center px-6 sm:px-10 border-b border-[#E8E6E1] bg-white',
              compactHeader ? 'py-3' : 'py-4',
            )}
          >
            <Link to={home} className="leading-tight">
              <div className="font-serif text-xl text-ink tracking-[-0.02em]">WildMind</div>
              <div className="text-[11px] text-[#999]">AI for Education</div>
            </Link>
            {user && (
              <div className="text-right">
                <div className="font-semibold text-sm text-ink">{user.name}</div>
                <div className="text-xs text-[#999] flex items-center justify-end gap-3">
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
        )}
        <div
          className={cn(
            'flex-1 w-full mx-auto',
            'px-6 sm:px-10 lg:px-12 py-8 lg:py-10',
            'max-w-[1440px]',
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
