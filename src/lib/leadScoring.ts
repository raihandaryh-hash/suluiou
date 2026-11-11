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
  /** Tidak lagi dipakai untuk skor (DPIA Sulu 11 Nov §6 butir 2); dibiarkan agar pemanggil lama tetap jalan. */
  scores?: Record<string, number>;
}

/** Izin per tujuan (KEPUTUSAN Raihan 11 Nov 12.08; manifest Persetujuan dan Jalur Tarik v0.2). */
export interface IzinSkor {
  /** P1: "Saya ingin dihubungi IOU soal kuliah". */
  dihubungi: boolean;
  /** P2: hasil asesmen boleh dipakai untuk menentukan program yang ditawarkan. Hanya berlaku bila P1 ada. */
  hasilUntukTawaran: boolean;
}

export const TANPA_IZIN: IzinSkor = { dihubungi: false, hasilUntukTawaran: false };

/**
 * Skor prioritas kontak untuk tim penerimaan.
 * - Tanpa P1: 0 (tidak ada skor dan tidak ada status tindak lanjut).
 * - Sifat kepribadian tidak pernah dihitung.
 * - Kecocokan program hanya dihitung bila P2 ada.
 */
export function calculateLeadScore(lead: LeadData, izin: IzinSkor = TANPA_IZIN): number {
  if (!izin.dihubungi) return 0;
  let score = 30; // P1 sendiri adalah tanda minat terkuat
  if (lead.student_name) score += 5;
  if (lead.student_email) score += 10;
  if (lead.student_phone) score += 10;
  if (lead.school_name && lead.school_name !== 'Umum') score += 5;
  if (izin.hasilUntukTawaran) score += Math.round((Math.max(0, Math.min(100, lead.match_percentage)) / 100) * 40);
  return Math.min(score, 100);
}

export type LeadPriority = 'hot' | 'warm' | 'cold' | 'none';

/** Skor 0 = tanpa izin dihubungi: tidak diberi prioritas. */
export function getLeadPriority(score: number): LeadPriority {
  if (!score || score <= 0) return 'none';
  if (score >= 70) return 'hot';
  if (score >= 45) return 'warm';
  return 'cold';
}

export const priorityConfig: Record<LeadPriority, { label: string; color: string; bgColor: string }> = {
  hot: { label: '🔥 Hot', color: 'text-red-400', bgColor: 'bg-red-500/10 border-red-500/30' },
  warm: { label: '🌤️ Warm', color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/30' },
  cold: { label: '❄️ Cold', color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/30' },
  none: { label: 'Tanpa izin dihubungi', color: 'text-muted-foreground', bgColor: 'bg-muted/40 border-border' },
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
