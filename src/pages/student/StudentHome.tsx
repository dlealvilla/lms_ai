import { useState, useEffect, useMemo } from 'react';
import { LibraryShell, CourseShelf, type ShelfCourse } from '@/components/bookshelf';
import { getAuthHeaders, useAuth } from '@/lib/auth/AuthContext';

interface Course {
  id: string;
  code: string;
  title: string;
  term: string;
  status: 'CURRENT' | 'PAST';
}

function greetingForHour(h: number) {
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function StudentHome() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/student/courses', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data.courses);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentCourses = courses.filter((c) => c.status === 'CURRENT') as ShelfCourse[];
  const pastCourses = courses.filter((c) => c.status === 'PAST') as ShelfCourse[];
  const firstName = (() => {
    const parts = (user?.name || '').trim().split(/\s+/).filter(Boolean);
    const titles = new Set(['dr', 'dr.', 'mr', 'mr.', 'mrs', 'mrs.', 'ms', 'ms.', 'prof', 'prof.']);
    const filtered = parts.filter((p) => !titles.has(p.toLowerCase()));
    return filtered[0] || parts[0] || 'there';
  })();
  const greet = useMemo(() => greetingForHour(new Date().getHours()), []);
  const termLabel = currentCourses[0]?.term || pastCourses[0]?.term || '';

  const shelfCourses = [...currentCourses, ...pastCourses].map((c) => ({
    id: c.id,
    code: c.code,
    title: c.title,
    href: `/student/courses/${c.id}`,
  }));

  if (isLoading) {
    return (
      <LibraryShell>
        <div className="flex items-center justify-center h-64 text-ink-muted">
          Loading courses...
        </div>
      </LibraryShell>
    );
  }

  if (error) {
    return (
      <LibraryShell>
        <div className="bg-error/10 text-error border border-error/30 p-4 rounded-lg">
          {error}
        </div>
      </LibraryShell>
    );
  }

  return (
    <LibraryShell
      showHeader={false}
      shelfCourses={shelfCourses}
      contentClassName="!max-w-none px-8 sm:px-10 py-8"
    >
      <div className="mb-7">
        <h1 className="font-serif text-[40px] tracking-[-0.02em] text-ink">
          {greet}, {firstName}
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          {courses.length} courses{termLabel ? ` · Term ${termLabel}` : ''}
        </p>
      </div>

      {currentCourses.length === 0 && pastCourses.length === 0 ? (
        <div className="bg-white border border-dashed border-[#E8E6E1] rounded-xl p-12 text-center text-ink-muted">
          No courses on your shelf yet
        </div>
      ) : (
        <CourseShelf
          current={currentCourses}
          past={pastCourses}
          basePath="/student/courses"
        />
      )}
    </LibraryShell>
  );
}
