// src/hooks/useAuthUser.ts
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useAuthUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) setUser(data.user ?? null);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, loading };
}

