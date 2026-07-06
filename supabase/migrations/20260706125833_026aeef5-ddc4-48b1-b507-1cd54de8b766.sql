ALTER TABLE public.province_contexts
  ADD COLUMN fardhu_kifayah_gaps TEXT[] DEFAULT '{}',
  ADD COLUMN iou_program_relevance TEXT,
  ADD COLUMN key_questions TEXT[] DEFAULT '{}';

UPDATE public.province_contexts
SET
  fardhu_kifayah_gaps = ARRAY[
    'Jawa Barat adalah provinsi dengan jumlah pesantren terbanyak di Indonesia (13.005 lembaga, sekitar 30,6% dari total nasional, Kemenag per Oktober 2025) — tapi pendampingan psikologis santri berlandaskan nilai Islam masih jarang dan tidak merata; baru sebagian kecil pesantren besar yang punya psikolog tetap.',
    'Ratusan ribu santri di Jawa Barat mempelajari dasar bahasa Arab, tapi akses mendalam ke khazanah kitab klasik keilmuan Islam — yang sebagian besar belum diterjemahkan — tetap terbatas tanpa penguasaan bahasa Arab yang benar-benar kuat.'
  ],
  iou_program_relevance = 'Psikologi (BSc PSY) — psikologi Islam untuk pendampingan santri; Studi Bahasa Arab (BA ALS) — jembatan ke khazanah kitab klasik yang belum banyak diakses.',
  key_questions = ARRAY[
    'Di Jawa Barat, ribuan pesantren tapi psikolog berlandaskan nilai Islam masih langka — apa peranmu?',
    'Ratusan ribu santri di sekitarmu, tapi kitab klasik yang mereka rujuk sebagian besar belum diterjemahkan — siapa yang akan menjembatani?'
  ]
WHERE province = 'Jawa Barat';