import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "kd_session_id";

export type PossibleSelves = {
  harapan?: string;
  kekhawatiran?: string;
  harap_bisa?: string;
};

export type OdysseyPlan = {
  lintasan: "A" | "B" | "C";
  judul: string;
  gambaran: string;
};

export type KdSession = {
  id: string;
  session_id: string;
  wa_number: string | null;
  values_sorted: string[] | null;
  possible_selves: PossibleSelves | null;
  odyssey_plans: OdysseyPlan[] | null;
  ai_narrative: string | null;
  completed: boolean;
};

function genUUID(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "kd-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useKenaliDirimuSession() {
  const [sessionId, setSessionId] = useState<string>("");
  const [session, setSession] = useState<KdSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sid = "";
    try {
      sid = localStorage.getItem(STORAGE_KEY) || "";
    } catch {}
    if (!sid) {
      sid = genUUID();
      try { localStorage.setItem(STORAGE_KEY, sid); } catch {}
    }
    setSessionId(sid);

    (async () => {
      const { data } = await supabase
        .from("kenali_dirimu_sessions")
        .select("*")
        .eq("session_id", sid)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) {
        setSession(data as unknown as KdSession);
      }
      setLoading(false);
    })();
  }, []);

  const upsert = useCallback(async (patch: Partial<Omit<KdSession, "id" | "session_id">>) => {
    if (!sessionId) return null;
    if (session?.id) {
      const { data, error } = await supabase
        .from("kenali_dirimu_sessions")
        .update(patch as any)
        .eq("id", session.id)
        .select()
        .maybeSingle();
      if (error) { console.error("kd update error", error); return null; }
      if (data) setSession(data as unknown as KdSession);
      return data;
    } else {
      const { data, error } = await supabase
        .from("kenali_dirimu_sessions")
        .insert({ session_id: sessionId, ...(patch as any) })
        .select()
        .maybeSingle();
      if (error) { console.error("kd insert error", error); return null; }
      if (data) setSession(data as unknown as KdSession);
      return data;
    }
  }, [sessionId, session?.id]);

  return { sessionId, session, loading, upsert, setSession };
}
