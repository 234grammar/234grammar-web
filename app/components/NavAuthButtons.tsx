'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export function NavAuthButtons({ mobile = false }: { mobile?: boolean }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  // Avoid flash while checking auth
  if (isLoggedIn === null) return null;

  if (isLoggedIn) {
    return mobile ? (
      <Link
        href="/editor"
        className="block mt-3 bg-primary text-white px-5 py-3 rounded-lg text-center font-semibold hover:bg-primaryHover transition"
      >
        Go to Editor
      </Link>
    ) : (
      <Link
        href="/editor"
        className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primaryHover transition font-semibold"
      >
        Go to Editor
      </Link>
    );
  }

  return mobile ? (
    <>
      <Link href="/login" className="block py-3 text-gray-600 hover:text-primary">
        Login
      </Link>
      <Link
        href="/signup"
        className="block mt-3 bg-primary text-white px-5 py-3 rounded-lg text-center font-semibold hover:bg-primaryHover transition"
      >
        Start Free
      </Link>
    </>
  ) : (
    <>
      <Link href="/login" className="text-gray-600 hover:text-primary transition">
        Login
      </Link>
      <Link
        href="/signup"
        className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primaryHover transition font-semibold"
      >
        Start Free
      </Link>
    </>
  );
}
