'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to scenarios page
    router.push('/scenarios');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Living Abroad Budget Tool</h1>
        <p className="text-lg text-gray-600">Redirecting to scenarios...</p>
      </div>
    </div>
  );
}