import { supabase } from '@/integrations/supabase/client';

export async function track(
  eventName: string,
  props?: Record<string, unknown>
): Promise<void> {
  try {
    const sessionId = localStorage.getItem('kd_session_id');
    await supabase
      .from('analytics_events')
      .insert({
        event_name: eventName,
        session_id: sessionId ?? null,
        props: props ?? {}
      });
  } catch {
    // Silent fail — tracking tidak boleh break UX apapun
  }
}
