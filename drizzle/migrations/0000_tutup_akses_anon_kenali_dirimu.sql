drop policy if exists "Anyone can read kd sessions" on public.kenali_dirimu_sessions;
drop policy if exists "Anyone can update kd sessions" on public.kenali_dirimu_sessions;
drop policy if exists "Anyone can create kd session" on public.kenali_dirimu_sessions;

revoke select, insert, update on public.kenali_dirimu_sessions from anon;