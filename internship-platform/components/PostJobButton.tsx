"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PostJobButton() {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: appUser } = await supabase
        .from('User')
        .select('role')
        .eq('provider_uid', user.id)
        .single();

      if (appUser && (appUser.role === 'ENTERPRISE' || appUser.role === 'ADMIN')) {
        setAllowed(true);
      }

      setLoading(false);
    };

    checkRole();
  }, []);

  if (loading) return null;

  if (!allowed) return null;

  return (
    <div className="post-btn">
      <Link href="/post-job" className="btn btn-danger px-6 py-3 fs-4">
        Post a Job
      </Link>
    </div>
  );
}