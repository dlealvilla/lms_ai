import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth, Role } from '../lib/auth/AuthContext';

export function Login() {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Determine role from URL param
  const role: Role = (roleParam?.toUpperCase() as Role) || 'STUDENT';

  const getRoleConfig = () => {
    switch (role) {
      case 'TEACHER':
        return {
          title: 'Teacher Login',
          color: 'emerald',
          defaultEmail: 'teacher@wildmind.edu',
          redirectTo: '/teacher/home',
        };
      case 'ADMIN':
        return {
          title: 'Admin Login',
          color: 'red',
          defaultEmail: 'admin@wildmind.edu',
          redirectTo: '/admin',
        };
      default:
        return {
          title: 'Student Login',
          color: 'blue',
          defaultEmail: 'alice@wildmind.edu',
          redirectTo: '/student/home',
        };
    }
  };

  const config = getRoleConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email || config.defaultEmail, password, role);
      navigate(config.redirectTo);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const colorClasses = {
    blue: {
      button: 'bg-blue-500 hover:bg-blue-600',
      accent: 'text-blue-500',
    },
    emerald: {
      button: 'bg-emerald-500 hover:bg-emerald-600',
      accent: 'text-emerald-500',
    },
    red: {
      button: 'bg-red-500 hover:bg-red-600',
      accent: 'text-red-500',
    },
  };

  const colors = colorClasses[config.color as keyof typeof colorClasses];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link to="/" className="text-slate-400 hover:text-white mb-8 inline-block">
          ← Back to home
        </Link>

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {config.title}
            </h1>
            <p className="text-gray-500">
              Sign in to Wildmind Education
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={config.defaultEmail}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">
                (Mock login — any password works)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white font-semibold rounded-lg transition-colors ${colors.button} disabled:opacity-50`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick login hints */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">
              Quick login (for demo):
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {role === 'STUDENT' && (
                <>
                  <button
                    onClick={() => setEmail('alice@wildmind.edu')}
                    className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Alice
                  </button>
                  <button
                    onClick={() => setEmail('bob@wildmind.edu')}
                    className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Bob
                  </button>
                  <button
                    onClick={() => setEmail('charlie@wildmind.edu')}
                    className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Charlie
                  </button>
                </>
              )}
              {role === 'TEACHER' && (
                <button
                  onClick={() => setEmail('teacher@wildmind.edu')}
                  className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Dr. Smith
                </button>
              )}
              {role === 'ADMIN' && (
                <button
                  onClick={() => setEmail('admin@wildmind.edu')}
                  className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Admin
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Switch role links */}
        <div className="mt-6 text-center text-sm text-slate-400">
          {role !== 'STUDENT' && (
            <Link to="/login/student" className="hover:text-white mx-2">
              Student Login
            </Link>
          )}
          {role !== 'TEACHER' && (
            <Link to="/login/teacher" className="hover:text-white mx-2">
              Teacher Login
            </Link>
          )}
          {role !== 'ADMIN' && (
            <Link to="/login/admin" className="hover:text-white mx-2">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

