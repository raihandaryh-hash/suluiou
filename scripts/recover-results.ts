/**
 * One-off recovery script.
 *
 * Backfill `assessment_results` from `assessment_progress` for students who
 * completed the assessment but never had a row inserted into results
 * (because the Results page never auto-saved — bug fixed retroactively).
 *
 * Strategy:
 *   1. SELECT all `assessment_progress` rows with completed_at IS NOT NULL
 *      that have no matching row in `assessment_results`.
 *   2. For each one, recompute scores using the SAME `combineScores()` logic
 *      the client uses (so recovered rows look identical to organic ones).
 *   3. INSERT into `assessment_results` with `notes = "[recovered ...]"` so
 *      we can audit which rows came from this script.
 *
 * Run: bun run scripts/recover-results.ts            (dry-run, default)
 *      bun run scripts/recover-results.ts --apply    (actually INSERT)
 */
import { createClient } from '@supabase/supabase-js';
import { combineScores } from '../src/lib/scoringNew';
import { calculateLeadScore } from '../src/lib/leadScoring';

const SUPABASE_URL = 'https://qjdmwssuzthihtxekeup.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqZG13c3N1enRoaWh0eGVrZXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjQxNjYsImV4cCI6MjA4NjIwMDE2Nn0.ujWdiutETEz8ee8DdFYAe1f89JIeSzpc7eIAGJMX1Xw';

const APPLY = process.argv.includes('--apply');

interface ProgressRow {
  id: string;
  user_id: string | null;
  guest_identifier: string | null;
  class_id: string | null;
  student_profile: {
    name?: string;
    province?: string;
    familyBackground?: string;
    aspiration?: string;
  } | null;
  hexaco_answers: Record<string, number>;
  sds_answers: Record<string, boolean>;
  completed_at: string;
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log(`Mode: ${APPLY ? '🔴 APPLY (will INSERT)' : '🟢 DRY-RUN (no writes)'}`);

  // 1. Fetch all completed progress
  console.log('Fetching completed progress…');
  const { data: progress, error: pErr } = await supabase
    .from('assessment_progress')
    .select('id, user_id, guest_identifier, class_id, student_profile, hexaco_answers, sds_answers, completed_at')
    .not('completed_at', 'is', null);
  if (pErr) throw pErr;
  console.log(`  → ${progress?.length ?? 0} completed progress rows`);

  // 2. Fetch all existing result identifiers
  const { data: existing, error: eErr } = await supabase
    .from('assessment_results')
    .select('user_id, guest_identifier');
  if (eErr) throw eErr;
  const existingUserIds = new Set(
    (existing ?? []).filter((r) => r.user_id).map((r) => r.user_id as string),
  );
  const existingGuests = new Set(
    (existing ?? []).filter((r) => r.guest_identifier).map((r) => r.guest_identifier as string),
  );

  // 3. Filter to missing rows
  const missing = (progress as ProgressRow[]).filter((p) => {
    if (p.user_id && existingUserIds.has(p.user_id)) return false;
    if (p.guest_identifier && existingGuests.has(p.guest_identifier)) return false;
    if (!p.user_id && !p.guest_identifier) return false; // can't dedupe later
    return true;
  });
  console.log(`  → ${missing.length} rows need recovery`);

  // Look up class names for the rows we're about to insert (for student_class column)
  const classIds = [...new Set(missing.map((m) => m.class_id).filter((x): x is string => !!x))];
  const classMap = new Map<string, { name: string | null; school_name: string | null }>();
  if (classIds.length > 0) {
    const { data: classes } = await supabase
      .from('classes')
      .select('id, name, school_name')
      .in('id', classIds);
    (classes ?? []).forEach((c) => {
      classMap.set(c.id as string, { name: (c.name as string) ?? null, school_name: (c.school_name as string) ?? null });
    });
  }

  let okCount = 0;
  let failCount = 0;
  const failures: { id: string; reason: string }[] = [];

  for (const p of missing) {
    try {
      // hexaco_answers keys come back as strings ("1","2",...) — convert to numeric keys.
      const hexNumeric: Record<number, number> = {};
      Object.entries(p.hexaco_answers ?? {}).forEach(([k, v]) => {
        const n = Number(k);
        if (!Number.isNaN(n)) hexNumeric[n] = v as number;
      });

      const { scores, hollandCode } = combineScores(hexNumeric, p.sds_answers ?? {});

      const profile = p.student_profile ?? {};
      const cls = p.class_id ? classMap.get(p.class_id) : null;

      const leadScore = calculateLeadScore({
        student_name: profile.name ?? null,
        student_email: null,
        student_phone: null,
        school_name: cls?.school_name ?? null,
        match_percentage: 0,
        scores: scores as Record<string, number>,
      });

      const insertRow = {
        student_name: profile.name ?? null,
        student_email: null,
        student_phone: null,
        student_class: cls?.name ?? null,
        school_name: cls?.school_name ?? null,
        student_province: profile.province ?? null,
        province: profile.province ?? null,
        family_background: profile.familyBackground ?? null,
        aspiration: profile.aspiration ?? null,
        scores,
        top_pathway_id: 'none',
        top_pathway_name: '-',
        match_percentage: 0,
        all_matches: [],
        selected_pathways: [],
        projection: '',
        layer1_text: null,
        lead_score: leadScore,
        email_requested: false,
        class_id: p.class_id,
        guest_identifier: p.guest_identifier,
        user_id: p.user_id,
        completed_at: p.completed_at,
        submitted_at: p.completed_at,
        follow_up_status: 'new',
        notes: `[recovered ${new Date().toISOString()} from progress ${p.id} | holland=${hollandCode}]`,
      };

      if (!APPLY) {
        console.log(
          `  [DRY] ${p.guest_identifier ?? p.user_id} cls=${cls?.name ?? '-'} ` +
            `holland=${hollandCode} lead=${leadScore} name=${profile.name ?? '∅'}`,
        );
        okCount++;
        continue;
      }

      const { error: insErr } = await supabase.from('assessment_results').insert(insertRow);
      if (insErr) {
        failCount++;
        failures.push({ id: p.id, reason: insErr.message });
        console.error(`  ✗ ${p.id}: ${insErr.message}`);
      } else {
        okCount++;
        if (okCount % 10 === 0) console.log(`  ✓ ${okCount} inserted…`);
      }
    } catch (err) {
      failCount++;
      const msg = err instanceof Error ? err.message : String(err);
      failures.push({ id: p.id, reason: msg });
      console.error(`  ✗ ${p.id}: ${msg}`);
    }
  }

  console.log('\n=== Recovery summary ===');
  console.log(`  Mode:     ${APPLY ? 'APPLY' : 'DRY-RUN'}`);
  console.log(`  OK:       ${okCount}`);
  console.log(`  Failed:   ${failCount}`);
  if (failures.length > 0) {
    console.log('  Failures:');
    failures.forEach((f) => console.log(`    - ${f.id}: ${f.reason}`));
  }
  if (!APPLY && okCount > 0) {
    console.log('\n  → Re-run with --apply to actually INSERT.');
  }
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
