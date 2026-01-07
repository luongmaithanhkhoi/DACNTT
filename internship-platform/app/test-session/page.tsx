"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function TestSessionPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTest = async () => {
      const { data, error } = await supabase.auth.getSession();

      console.log("SESSION:", data.session);
      console.log("ERROR:", error);

      setSession(data.session);
      setLoading(false);
    };

    runTest();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <pre className="text-xs bg-gray-100 p-4 rounded">
      {JSON.stringify(session, null, 2)}
    </pre>
  );
}
