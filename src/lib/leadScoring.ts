/**
 * Lead scoring algorithm for IOU partnership team.
 * Scores range from 0-100 based on completeness, match quality, and engagement signals.
 */

interface LeadData {
  student_name: string | null;
  student_email: string | null;
  student_phone: string | null;
  school_name: string | null;
  match_percentage: number;
  scores: Record<string, number>;
}

export function calculateLeadScore(lead: LeadData): number {
  let score = 0;

  // 1. Contact completeness (0-25 points)
  if (lead.student_name) score += 8;
  if (lead.student_email) score += 8;
  if (lead.student_phone) score += 9;

  // 2. Match quality (0-40 points) — highest weight
  score += Math.round((lead.match_percentage / 100) * 40);

  // 3. Profile strength (0-20 points) — strong personality signals
  const dimensionValues = Object.values(lead.scores || {});
  if (dimensionValues.length > 0) {
    const highScores = dimensionValues.filter((v) => v >= 4).length;
    score += Math.min(highScores * 4, 20);
  }

  // 4. School info provided (0-15 points) — engagement signal
  if (lead.school_name) score += 15;

  return Math.min(score, 100);
}

export type LeadPriority = 'hot' | 'warm' | 'cold';

export function getLeadPriority(score: number): LeadPriority {
  if (score >= 70) return 'hot';
  if (score >= 45) return 'warm';
  return 'cold';
}

export const priorityConfig: Record<LeadPriority, { label: string; color: string; bgColor: string }> = {
  hot: { label: '🔥 Hot', color: 'text-red-400', bgColor: 'bg-red-500/10 border-red-500/30' },
  warm: { label: '🌤️ Warm', color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/30' },
  cold: { label: '❄️ Cold', color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/30' },
};

export const followUpStatuses = ['new', 'contacted', 'interested', 'enrolled', 'declined'] as const;
export type FollowUpStatus = (typeof followUpStatuses)[number];

export const statusConfig: Record<FollowUpStatus, { label: string; color: string }> = {
  new: { label: 'Baru', color: 'bg-primary/20 text-primary' },
  contacted: { label: 'Dihubungi', color: 'bg-blue-500/20 text-blue-400' },
  interested: { label: 'Tertarik', color: 'bg-green-500/20 text-green-400' },
  enrolled: { label: 'Terdaftar', color: 'bg-emerald-500/20 text-emerald-400' },
  declined: { label: 'Menolak', color: 'bg-muted text-muted-foreground' },
};
