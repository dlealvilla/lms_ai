import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, Role } from '../lib/auth/AuthContext';

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect to appropriate login page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to user's home page based on role
    const homeRoute = user.role === 'STUDENT' ? '/student/home' :
                      user.role === 'TEACHER' ? '/teacher/home' :
                      user.role === 'ADMIN' ? '/admin' : '/';
    return <Navigate to={homeRoute} replace />;
  }

  return <>{children}</>;
}

