create role anon; create role authenticated; create schema auth;
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('x.uid',true),'')::uuid $$;
create type app_role as enum('admin','user');
create table user_roles(user_id uuid, role app_role);
create function has_role(u uuid, r app_role) returns bool language sql stable security definer as $$select exists(select 1 from user_roles where user_id=u and role=r)$$;
create table assessment_results(id uuid primary key default gen_random_uuid(), user_id uuid, guest_identifier text, student_name text, student_email text, student_phone text, school_name text, match_percentage int not null default 0, lead_score int not null default 0, layer1_text text, student_class text, student_province text, province text, follow_up_status text, email_requested boolean default false);
alter table assessment_results enable row level security;
grant select,insert,update on assessment_results to anon, authenticated;
create policy ins on assessment_results for insert with check (true);
create policy sel on assessment_results for select using (user_id = auth.uid() or user_id is null);
CREATE POLICY "Owner can fill empty layer1_text" ON public.assessment_results FOR UPDATE TO anon, authenticated
USING (layer1_text IS NULL AND ((auth.uid() IS NOT NULL AND user_id = auth.uid()) OR (auth.uid() IS NULL AND user_id IS NULL AND guest_identifier IS NOT NULL)))
WITH CHECK ((auth.uid() IS NOT NULL AND user_id = auth.uid()) OR (auth.uid() IS NULL AND user_id IS NULL AND guest_identifier IS NOT NULL));
