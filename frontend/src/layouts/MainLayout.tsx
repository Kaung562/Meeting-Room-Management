import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="page-shell">
      <div className="page-content">{children}</div>
    </div>
  );
}
