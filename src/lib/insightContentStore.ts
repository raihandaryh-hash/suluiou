import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { defaultInsightContent, type InsightContent } from '@/data/insightContent';

const SLUG = 'insight';

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

// Deep merge: DB value wins when present; defaults fill any missing keys.
// Arrays are taken from override as-is (not merged item-by-item).
function deepMerge<T>(base: T, override: unknown): T {
  if (!isObject(override) || !isObject(base)) {
    return (override === undefined ? base : (override as T));
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override)) {
    const b = (base as Record<string, unknown>)[key];
    const o = (override as Record<string, unknown>)[key];
    if (Array.isArray(o)) {
      out[key] = o;
    } else if (isObject(o) && isObject(b)) {
      out[key] = deepMerge(b, o);
    } else {
      out[key] = o;
    }
  }
  return out as T;
}

export async function fetchInsightContent(): Promise<InsightContent> {
  const { data, error } = await supabase
    .from('site_content')
    .select('content')
    .eq('slug', SLUG)
    .maybeSingle();
  if (error || !data?.content) return defaultInsightContent;
  return deepMerge(defaultInsightContent, data.content);
}

export async function saveInsightContent(
  content: InsightContent,
  updatedBy: string | null
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('site_content')
    .upsert(
      {
        slug: SLUG,
        // JSON cast — Supabase types accept Json
        content: content as unknown as Record<string, unknown>,
        updated_by: updatedBy,
      },
      { onConflict: 'slug' }
    );
  return { error: error?.message ?? null };
}

export function useInsightContent() {
  const [content, setContent] = useState<InsightContent>(defaultInsightContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchInsightContent().then((c) => {
      if (!cancelled) {
        setContent(c);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { content, loading };
}
