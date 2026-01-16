import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { getAuthHeaders } from '../../lib/auth/AuthContext';

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
      <AuthLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading courses...</div>
        </div>
      </AuthLayout>
    );
  }

  if (error) {
    return (
      <AuthLayout>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">View your enrolled courses and assessments</p>
        </div>

        {/* Current Courses */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Courses</h2>
          {currentCourses.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
              No current courses
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {currentCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/student/courses/${course.id}`}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="text-sm text-blue-600 font-medium mb-1">
                    {course.code}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {course.term}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Past Courses */}
        {pastCourses.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Past Courses</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/student/courses/${course.id}`}
                  className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-all opacity-75"
                >
                  <div className="text-sm text-gray-500 font-medium mb-1">
                    {course.code}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {course.title}
                  </h3>
                  <div className="text-sm text-gray-400">
                    {course.term}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </AuthLayout>
  );
}

