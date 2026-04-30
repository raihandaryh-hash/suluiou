-- 1. Add is_super_admin column to admin_users
ALTER TABLE public.admin_users
  ADD COLUMN IF NOT EXISTS is_super_admin boolean NOT NULL DEFAULT false;

-- 2. Seed raihandaryh@gmail.com as super admin
INSERT INTO public.admin_users (email, is_super_admin)
VALUES ('raihandaryh@gmail.com', true)
ON CONFLICT (email) DO UPDATE SET is_super_admin = true;

-- 3. Public RPC for sharable result page — returns only safe subset
CREATE OR REPLACE FUNCTION public.get_public_result(result_id uuid)
RETURNS TABLE (
  id uuid,
  student_name text,
  scores jsonb,
  top_pathway_id text,
  top_pathway_name text,
  match_percentage integer,
  all_matches jsonb,
  selected_pathways jsonb,
  layer1_text text,
  submitted_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    r.id,
    r.student_name,
    r.scores,
    r.top_pathway_id,
    r.top_pathway_name,
    r.match_percentage,
    r.all_matches,
    r.selected_pathways,
    r.layer1_text,
    r.submitted_at
  FROM public.assessment_results r
  WHERE r.id = result_id
  LIMIT 1;
$$;

-- Allow anonymous + authenticated to call this RPC
GRANT EXECUTE ON FUNCTION public.get_public_result(uuid) TO anon, authenticated;