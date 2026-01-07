"use client";

import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function TestSession() {
  useEffect(() => {
    const testSession = async () => {
      const supabase = createClientComponentClient();

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      console.log("SESSION:", session);
      console.log("ERROR:", error);
    };

    testSession();
  }, []);

  return <div>Open DevTools → Console</div>;
}