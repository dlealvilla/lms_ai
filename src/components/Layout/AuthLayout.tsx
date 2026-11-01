import { ReactNode } from 'react';
import { LibraryShell } from '@/components/bookshelf';

interface AuthLayoutProps {
  children: ReactNode;
}

/** Authenticated pages that are not the full-bleed shelf home */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <LibraryShell compactHeader>
      <div className="space-y-6">{children}</div>
    </LibraryShell>
  );
}
