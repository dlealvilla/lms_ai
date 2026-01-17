import { ReactNode } from 'react';
import { AppShell } from './AppShell';

interface AuthenticatedLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function AuthenticatedLayout({ children, title, breadcrumbs }: AuthenticatedLayoutProps) {
  return (
    <AppShell title={title} breadcrumbs={breadcrumbs}>
      {children}
    </AppShell>
  );
}

