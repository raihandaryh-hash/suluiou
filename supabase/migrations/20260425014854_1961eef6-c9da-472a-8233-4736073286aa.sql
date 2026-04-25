-- Create public bucket for Suar slide images
insert into storage.buckets (id, name, public)
values ('suar-slides', 'suar-slides', true)
on conflict (id) do update set public = true;

-- Public read (bucket is public, but explicit policy for clarity)
create policy "Public can read suar-slides"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'suar-slides');

-- Admin write (insert/update/delete)
create policy "Admins can upload suar-slides"
on storage.objects for insert
to authenticated
with check (bucket_id = 'suar-slides' and public.is_admin(auth.uid()));

create policy "Admins can update suar-slides"
on storage.objects for update
to authenticated
using (bucket_id = 'suar-slides' and public.is_admin(auth.uid()));

create policy "Admins can delete suar-slides"
on storage.objects for delete
to authenticated
using (bucket_id = 'suar-slides' and public.is_admin(auth.uid()));