
CREATE TABLE public.waitlist_sulu (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  whatsapp text NOT NULL,
  persona text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.waitlist_sulu TO anon;
GRANT INSERT ON public.waitlist_sulu TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.waitlist_sulu TO authenticated;
GRANT ALL ON public.waitlist_sulu TO service_role;

ALTER TABLE public.waitlist_sulu ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist_sulu FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins manage waitlist"
  ON public.waitlist_sulu FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));
