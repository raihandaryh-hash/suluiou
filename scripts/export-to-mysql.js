#!/usr/bin/env node
/**
 * export-to-mysql.js
 *
 * Convert Postgres `pg_dump --column-inserts` output into MySQL-compatible
 * INSERT statements for the Sulu data migration.
 *
 * Usage:
 *   node scripts/export-to-mysql.js supabase_dump.sql > mysql_import.sql
 *
 * What it converts:
 *   - Strips `public.` schema prefix
 *   - Drops `::jsonb`, `::text[]`, `::timestamp with time zone` casts
 *   - Converts text[] literals `'{a,b,c}'` → JSON arrays `'["a","b","c"]'`
 *   - Drops timezone suffix from timestamps (`+00` → '')
 *   - Replaces `true`/`false` with `1`/`0`
 *   - Drops Postgres-specific E'...' string prefix
 *   - Skips `SET`, `SELECT pg_catalog.*`, comments, and ownership lines
 *
 * Limitations:
 *   - Assumes pg_dump format with --column-inserts
 *   - JSON values inside INSERT are passed through as-is (MySQL JSON column
 *     accepts the same syntax)
 *   - Doesn't handle COPY blocks (only INSERT)
 */

const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/export-to-mysql.js <supabase_dump.sql>');
  process.exit(1);
}

const raw = fs.readFileSync(path.resolve(inputPath), 'utf8');

const out = [];
out.push('-- Auto-generated MySQL import from Postgres dump');
out.push('-- Source: ' + path.basename(inputPath));
out.push('-- Generated: ' + new Date().toISOString());
out.push('SET NAMES utf8mb4;');
out.push('SET FOREIGN_KEY_CHECKS = 0;');
out.push('');

const lines = raw.split('\n');
let buffer = '';

const SKIP_PREFIXES = [
  '--', 'SET ', 'SELECT pg_catalog', 'ALTER TABLE', 'CREATE ', 'DROP ',
  'COMMENT ON', 'GRANT ', 'REVOKE ', '\\.', '\\connect', 'COPY ',
];

function shouldSkip(line) {
  const t = line.trim();
  if (!t) return true;
  return SKIP_PREFIXES.some((p) => t.startsWith(p));
}

/** Convert one INSERT statement from PG → MySQL. */
function convertInsert(stmt) {
  let s = stmt;

  // Strip schema prefix: INSERT INTO public.table → INSERT INTO `table`
  s = s.replace(/INSERT INTO public\.(\w+)/g, 'INSERT INTO `$1`');

  // Drop type casts: ::jsonb, ::text[], ::timestamp with time zone, ::uuid, etc.
  s = s.replace(/::jsonb/g, '');
  s = s.replace(/::text\[\]/g, '');
  s = s.replace(/::timestamp with time zone/g, '');
  s = s.replace(/::timestamp without time zone/g, '');
  s = s.replace(/::timestamp/g, '');
  s = s.replace(/::uuid/g, '');
  s = s.replace(/::text/g, '');
  s = s.replace(/::integer/g, '');
  s = s.replace(/::numeric/g, '');
  s = s.replace(/::boolean/g, '');

  // Drop E'...' string prefix
  s = s.replace(/\bE'/g, "'");

  // Convert PG text[] literal '{a,b,c}' to JSON array '["a","b","c"]'
  // Naive: only match simple cases (no commas inside strings)
  s = s.replace(/'\{([^{}']*)\}'/g, (_match, inner) => {
    if (inner.trim() === '') return "'[]'";
    const items = inner.split(',').map((item) => {
      const trimmed = item.trim().replace(/^"(.*)"$/, '$1');
      return JSON.stringify(trimmed);
    });
    return "'" + JSON.stringify(items).replace(/'/g, "''") + "'";
  });

  // Strip timezone from timestamps: '2025-04-25 10:00:00+00' → '2025-04-25 10:00:00'
  s = s.replace(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)?)\+\d{2}/g, '$1');

  // true/false → 1/0 (only as standalone values, careful not to touch strings)
  s = s.replace(/\btrue\b/g, '1');
  s = s.replace(/\bfalse\b/g, '0');

  return s;
}

for (const line of lines) {
  if (shouldSkip(line) && !buffer) continue;

  buffer += (buffer ? '\n' : '') + line;

  // Statement complete when ending with `);` at line end
  if (/\);\s*$/.test(line)) {
    if (buffer.trim().toUpperCase().startsWith('INSERT INTO')) {
      out.push(convertInsert(buffer));
    }
    buffer = '';
  }
}

out.push('');
out.push('SET FOREIGN_KEY_CHECKS = 1;');
out.push('-- End of import');

process.stdout.write(out.join('\n') + '\n');
