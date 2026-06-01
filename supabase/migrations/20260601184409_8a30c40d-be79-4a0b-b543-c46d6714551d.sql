CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  session_id text,
  props jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT ALL ON public.analytics_events TO service_role;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read analytics events"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE INDEX idx_analytics_events_event_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at DESC);