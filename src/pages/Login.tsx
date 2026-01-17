import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth, Role } from '../lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

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
          defaultEmail: 'teacher@wildmind.edu',
          redirectTo: '/teacher/home',
        };
      case 'ADMIN':
        return {
          title: 'Admin Login',
          defaultEmail: 'admin@wildmind.edu',
          redirectTo: '/admin',
        };
      default:
        return {
          title: 'Student Login',
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link to="/" className="text-foreground-muted hover:text-foreground mb-8 inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Login card */}
        <Card>
          <CardHeader>
            <CardTitle>{config.title}</CardTitle>
            <CardDescription>Sign in to Wildmind Education</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={config.defaultEmail}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <p className="text-xs text-foreground-muted">
                  (Mock login — any password works)
                </p>
              </div>

              {error && (
                <div className="bg-error/10 text-error px-4 py-3 rounded-lg text-sm border border-error/20">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Quick login hints */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-foreground-muted text-center mb-3">
                Quick login (for demo):
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {role === 'STUDENT' && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEmail('alice@wildmind.edu')}
                    >
                      Alice
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEmail('bob@wildmind.edu')}
                    >
                      Bob
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEmail('charlie@wildmind.edu')}
                    >
                      Charlie
                    </Button>
                  </>
                )}
                {role === 'TEACHER' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEmail('teacher@wildmind.edu')}
                  >
                    Dr. Smith
                  </Button>
                )}
                {role === 'ADMIN' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEmail('admin@wildmind.edu')}
                  >
                    Admin
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Switch role links */}
        <div className="mt-6 text-center text-sm text-foreground-muted">
          {role !== 'STUDENT' && (
            <Link to="/login/student" className="hover:text-foreground mx-2">
              Student Login
            </Link>
          )}
          {role !== 'TEACHER' && (
            <Link to="/login/teacher" className="hover:text-foreground mx-2">
              Teacher Login
            </Link>
          )}
          {role !== 'ADMIN' && (
            <Link to="/login/admin" className="hover:text-foreground mx-2">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
