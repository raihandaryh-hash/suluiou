ALTER TABLE public.province_contexts
  ADD COLUMN data_verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN data_year INTEGER,
  ADD COLUMN primary_sources TEXT[] DEFAULT '{}';