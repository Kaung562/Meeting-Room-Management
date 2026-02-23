import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>{children}</div>;
}
