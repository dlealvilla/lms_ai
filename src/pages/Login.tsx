import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth, Role } from '../lib/auth/AuthContext';
import { GraduationCap } from 'lucide-react';
import { DecorativeSpine } from '@/components/bookshelf';

export function Login() {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const quickFill = (quickEmail: string) => {
    setEmail(quickEmail);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-ink flex">
      <aside
        className="hidden sm:flex w-[72px] py-7 flex-col items-center border-r border-[#E8E6E1] bg-white"
        aria-label="Decorative spine rail"
      >
        <div className="w-9 h-9 rounded-[10px] bg-ink text-white flex items-center justify-center mb-4">
          <GraduationCap className="h-4 w-4" />
        </div>
        <div className="flex flex-col items-center gap-2.5 flex-1">
          <DecorativeSpine label="COMP101" color="#C45C4A" height={56} />
          <DecorativeSpine label="WRIT201" color="#3D6B9A" height={72} />
          <DecorativeSpine label="HIST201" color="#4A7A52" height={48} />
        </div>
        <div className="w-7 h-7 rounded-full bg-[#E8E6E1] text-[11px] font-bold flex items-center justify-center text-[#555]" aria-hidden>
          WM
        </div>
      </aside>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[400px] bg-white border border-[#E8E6E1] rounded-xl shadow-folio px-9 py-10">
          <div className="text-[12px] font-semibold tracking-[0.08em] text-[#888] mb-2">
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
                className="block text-[11px] font-semibold text-[#888] tracking-[0.06em] mb-1.5"
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
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-semibold text-[#888] tracking-[0.06em] mb-1.5"
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
              />
              <p className="text-xs text-ink-subtle mt-2">Mock login — any password works</p>
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
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#E8E6E1] text-center">
            <p className="text-[11px] text-ink-subtle mb-2">Quick login</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {config.quick.map((q) => (
                <button
                  key={q.email}
                  type="button"
                  onClick={() => quickFill(q.email)}
                  className="folio-btn-secondary !text-xs"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-ink-subtle">
            {role !== 'STUDENT' && (
              <Link to="/login/student" className="hover:text-ink mx-2">
                Student Login
              </Link>
            )}
            {role !== 'TEACHER' && (
              <Link to="/login/teacher" className="hover:text-ink mx-2">
                Teacher Login
              </Link>
            )}
            {role !== 'ADMIN' && (
              <Link to="/login/admin" className="hover:text-ink mx-2">
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
