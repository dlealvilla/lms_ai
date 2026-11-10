import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, role: Role, tenantSlug?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'lms_auth_token';
const USER_KEY = 'lms_auth_user';

/**
 * Client-side sanity check for a stored session token. The server is the
 * only authority (it verifies the HMAC signature); this just drops tokens
 * that are clearly unusable — legacy unsigned tokens from before signing
 * was added, or expired ones — so the user is sent to sign in again
 * instead of landing on a page whose API calls all fail.
 */
function isUsableStoredToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'v1' || !parts[1] || !parts[2]) return false;
  try {
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as { exp?: unknown };
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function loginPathForRole(role: unknown): string {
  if (role === 'TEACHER') return '/login/teacher';
  if (role === 'ADMIN') return '/login/admin';
  if (role === 'STUDENT') return '/login/student';
  return '/';
}

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

let fetchGuardInstalled = false;

/**
 * If an authenticated API call comes back 401 (token rejected, expired or
 * signed with an old secret), clear the session and send the user back to
 * the login screen for their role rather than leaving a broken page.
 */
function installSessionExpiryGuard() {
  if (fetchGuardInstalled || typeof window === 'undefined' || typeof window.fetch !== 'function') {
    return;
  }
  fetchGuardInstalled = true;
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const res = await originalFetch(input, init);
    try {
      if (res.status === 401) {
        const url = new URL(requestUrl(input), window.location.origin);
        const isOwnApi =
          url.origin === window.location.origin &&
          url.pathname.startsWith('/api/') &&
          !url.pathname.startsWith('/api/auth/');
        if (isOwnApi && localStorage.getItem(TOKEN_KEY)) {
          let role: unknown;
          try {
            role = JSON.parse(localStorage.getItem(USER_KEY) || 'null')?.role;
          } catch {
            role = undefined;
          }
          clearStoredAuth();
          const target = loginPathForRole(role);
          if (window.location.pathname !== target) {
            window.location.assign(target);
          }
        }
      }
    } catch {
      // Never let the guard break the original request.
    }
    return res;
  };
}

// Install at module load so it is active before any page issues API calls.
installSessionExpiryGuard();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && !isUsableStoredToken(storedToken)) {
      // Legacy unsigned or expired token: sign in again.
      clearStoredAuth();
    } else if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored auth:', error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string, role: Role, tenantSlug?: string) => {
    try {
      const response = await fetch('/api/auth/mock-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role, tenantSlug: tenantSlug || 'wildmind-academy' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      setToken(data.token);
      setUser(data.user);
      
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper to get auth headers for API calls
export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

