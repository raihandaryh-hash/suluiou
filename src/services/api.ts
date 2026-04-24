// Centralized API layer.
// In Lovable dev: VITE_API_BASE_URL is empty → uses Supabase client/edge functions.
// In production: set VITE_API_BASE_URL to a PHP backend root and all calls hit
// REST endpoints under that root. No other code changes needed.

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const USE_SUPABASE = !import.meta.env.VITE_API_BASE_URL;

// Privacy: strip PII before sending to AI.
// Real name / email / phone / school never leave the browser.
function pseudonymizeForAI(profile: {
  name: string;
  province: string;
  familyBackground: string;
  aspiration: string;
}) {
  return {
    name: 'kamu',
    province: profile.province,
    familyBackground: profile.familyBackground,
    aspiration: profile.aspiration,
  };
}

export const api = {
  async saveResult(data: {
    student_name: string | null;
    student_email: string | null;
    student_phone: string | null;
    student_class: string | null;
    school_name: string | null;
    student_province: string | null;
    province: string | null;
    family_background: string | null;
    aspiration: string | null;
    scores: Record<string, number>;
    top_pathway_id: string;
    top_pathway_name: string;
    match_percentage: number;
    all_matches: unknown;
    projection: string;
    lead_score: number;
    lm_name?: string | null;
    lm_id?: string | null;
  }) {
    if (USE_SUPABASE) {
      const { supabase } = await import('@/integrations/supabase/client');
      // Cast to satisfy generated Json typing for jsonb columns.
      return supabase
        .from('assessment_results')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(data as any);
    }
    const res = await fetch(`${API_BASE}/api/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { error: { message: text || `HTTP ${res.status}` } };
    }
    return { error: null };
  },

  async generateProjection(payload: {
    scores: Record<string, number>;
    hollandCode?: string | null;
    pathway: { name: string; careers: string[]; localIndustries: string[] };
    topTraits: string[];
    studentProfile: {
      name: string;
      province: string;
      familyBackground: string;
      aspiration: string;
    };
  }): Promise<string | null> {
    const safePayload = {
      ...payload,
      studentProfile: pseudonymizeForAI(payload.studentProfile),
    };

    if (USE_SUPABASE) {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke(
        'generate-projection',
        { body: safePayload }
      );
      if (error || !data?.projection) return null;
      return data.projection as string;
    }

    try {
      const res = await fetch(`${API_BASE}/api/generate-projection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(safePayload),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.projection || null;
    } catch {
      return null;
    }
  },

  // Returns a streaming Response so the chatbot can read SSE chunks.
  async careerChat(
    messages: unknown[],
    studentContext: {
      studentProfile?: {
        name: string;
        province: string;
        familyBackground: string;
        aspiration: string;
      } | null;
      [k: string]: unknown;
    }
  ): Promise<Response> {
    // Pseudonymize the profile inside studentContext too.
    const safeContext = {
      ...studentContext,
      studentProfile: studentContext.studentProfile
        ? pseudonymizeForAI(studentContext.studentProfile)
        : null,
    };

    if (USE_SUPABASE) {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/career-chat`;
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages, studentContext: safeContext }),
      });
    }

    return fetch(`${API_BASE}/api/career-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, studentContext: safeContext }),
    });
  },
};
