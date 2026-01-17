import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthenticatedLayout } from '@/components/Layout/AuthenticatedLayout';
import { getAuthHeaders } from '@/lib/auth/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Course {
  id: string;
  code: string;
  title: string;
  term: string;
  status: 'CURRENT' | 'PAST';
}

export function StudentHome() {
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

  const currentCourses = courses.filter(c => c.status === 'CURRENT');
  const pastCourses = courses.filter(c => c.status === 'PAST');

  if (isLoading) {
    return (
      <AuthenticatedLayout title="My Courses">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-background-elevated rounded animate-pulse" />
            <div className="h-5 w-96 bg-background-elevated rounded animate-pulse" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="h-4 w-20 bg-background-elevated rounded animate-pulse mb-2" />
                  <div className="h-6 w-full bg-background-elevated rounded animate-pulse mb-2" />
                  <div className="h-4 w-32 bg-background-elevated rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (error) {
    return (
      <AuthenticatedLayout title="My Courses">
        <Card className="border-error/20 bg-error/5">
          <CardContent className="pt-6">
            <div className="text-error">{error}</div>
          </CardContent>
        </Card>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout title="My Courses">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
          <p className="text-foreground-muted">View your enrolled courses and assessments</p>
        </div>

        {/* Current Courses */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Current Courses</h2>
          {currentCourses.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
                  <p className="text-foreground-muted">No current courses</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {currentCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/student/courses/${course.id}`}
                  className="block"
                >
                  <Card className="hover:border-primary transition-all hover:shadow-md">
                    <CardContent className="pt-6">
                      <div className="text-sm text-primary font-medium mb-1">
                        {course.code}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {course.title}
                      </h3>
                      <div className="text-sm text-foreground-muted">
                        {course.term}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Past Courses */}
        {pastCourses.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Past Courses</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/student/courses/${course.id}`}
                  className="block"
                >
                  <Card className={cn(
                    "opacity-75 hover:opacity-100 transition-all",
                    "hover:border-border-strong"
                  )}>
                    <CardContent className="pt-6">
                      <div className="text-sm text-foreground-muted font-medium mb-1">
                        {course.code}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {course.title}
                      </h3>
                      <div className="text-sm text-foreground-subtle">
                        {course.term}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
