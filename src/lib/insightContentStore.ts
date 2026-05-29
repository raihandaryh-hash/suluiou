// Legacy stub. The /insight page now reads content directly from
// src/data/insightContent.ts (persona-aware). DB-backed editing has been
// removed for this page. Kept here only to avoid breaking unrelated imports.

export function useInsightContent() {
  return { content: null, loading: false };
}
