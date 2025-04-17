"use client"

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}

function NavBar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold flex items-center space-x-2">
                <span className="text-primary">Swift</span>
                <span>Bed</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="border-transparent text-foreground hover:border-foreground hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/beds"
                className="border-transparent text-foreground hover:border-foreground hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Beds
              </Link>
              {session.user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="border-transparent text-foreground hover:border-foreground hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <span className="text-foreground mr-4">{session.user?.name}</span>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: '/auth/signin' })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 