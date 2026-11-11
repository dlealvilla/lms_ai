import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth, Role } from '../lib/auth/AuthContext';
import { GraduationCap } from 'lucide-react';

export function Login() {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quickBusy, setQuickBusy] = useState<string | null>(null);

  const role: Role = (roleParam?.toUpperCase() as Role) || 'STUDENT';

  const getRoleConfig = () => {
    switch (role) {
      case 'TEACHER':
        return {
          title: 'Teacher Login',
          defaultEmail: 'teacher@wildmind.edu',
          redirectTo: '/teacher/home',
          quick: [{ label: 'Dr. Smith', email: 'teacher@wildmind.edu' }],
        };
      case 'ADMIN':
        return {
          title: 'Admin Login',
          defaultEmail: 'admin@wildmind.edu',
          redirectTo: '/admin',
          quick: [{ label: 'Admin', email: 'admin@wildmind.edu' }],
        };
      default:
        return {
          title: 'Student Login',
          defaultEmail: 'alice@wildmind.edu',
          redirectTo: '/student/home',
          quick: [
            { label: 'Alice', email: 'alice@wildmind.edu' },
            { label: 'Bob', email: 'bob@wildmind.edu' },
            { label: 'Charlie', email: 'charlie@wildmind.edu' },
          ],
        };
    }
  };

  const config = getRoleConfig();

  const signIn = async (signInEmail: string, signInPassword: string) => {
    await login(signInEmail || config.defaultEmail, signInPassword, role);
    navigate(config.redirectTo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const quickSignIn = async (quickEmail: string) => {
    setEmail(quickEmail);
    setError(null);
    setIsLoading(true);
    setQuickBusy(quickEmail);
    try {
      // Same demo login path and rate limits as the form; password is unused by the API.
      await signIn(quickEmail, '');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
      setQuickBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-ink flex flex-col">
      <header className="border-b border-[#E8E6E1] bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-ink text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-[15px]">WildMind</div>
              <div className="text-[11px] text-[#555]">AI for Education</div>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[400px] bg-white border border-[#E8E6E1] rounded-xl shadow-folio px-9 py-10">
          <div className="text-[12px] font-semibold tracking-[0.08em] text-[#555] mb-2">
            WILDMIND AI FOR EDUCATION
          </div>
          <h1 className="font-serif text-[36px] text-ink tracking-[0.01em] mb-1.5">
            {config.title}
          </h1>
          <p className="text-sm text-ink-muted mb-7">Sign in to WildMind AI for Education</p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label
                htmlFor="email"
                className="block text-[12px] font-semibold text-[#555] tracking-[0.06em] mb-1.5"
              >
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={config.defaultEmail}
                className="folio-input"
                autoComplete="username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[12px] font-semibold text-[#555] tracking-[0.06em] mb-1.5"
              >
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="folio-input"
                autoComplete="current-password"
              />
              <p className="text-sm text-ink-muted mt-2">Demo — sample accounts, no real data</p>
            </div>

            {error && (
              <div className="bg-error/10 text-error px-3 py-2 rounded-lg text-sm border border-error/30">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="folio-btn-primary w-full !py-3"
            >
              {isLoading && !quickBusy ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#E8E6E1] text-center">
            <p className="text-sm text-ink-muted mb-2">Quick login</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {config.quick.map((q) => (
                <button
                  key={q.email}
                  type="button"
                  onClick={() => quickSignIn(q.email)}
                  disabled={isLoading}
                  className="folio-btn-secondary !text-sm"
                >
                  {quickBusy === q.email ? 'Signing in…' : q.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-ink-muted">
            {role !== 'STUDENT' && (
              <Link to="/login/student" className="hover:text-ink mx-2 underline-offset-4 hover:underline">
                Student login
              </Link>
            )}
            {role !== 'TEACHER' && (
              <Link to="/login/teacher" className="hover:text-ink mx-2 underline-offset-4 hover:underline">
                Teacher login
              </Link>
            )}
            {role !== 'ADMIN' && (
              <Link to="/login/admin" className="hover:text-ink mx-2 underline-offset-4 hover:underline">
                Admin login
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
