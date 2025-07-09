'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TempProfileSetup } from '@/src/components/TempProfileSetup';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <TempProfileSetup />
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <header className="navbar bg-base-200 shadow-lg">
        <div className="container mx-auto">
          <div className="flex-1">
            <Link href="/scenarios" className="btn btn-ghost text-xl">
              Living Abroad Budget Tool
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link 
                  href="/scenarios" 
                  className={pathname === '/scenarios' ? 'active' : ''}
                >
                  Scenarios
                </Link>
              </li>
              <li>
                <Link 
                  href="/profile" 
                  className={pathname === '/profile' ? 'active' : ''}
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-auto">
        <div>
          <p>© 2024 Living Abroad Budget Tool - Plan your relocation with confidence</p>
        </div>
      </footer>
    </div>
    </>
  );
}